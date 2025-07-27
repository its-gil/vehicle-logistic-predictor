import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { uploads } from "@/db/schema";
import { parseFileToRows } from "@/utils/parseFileToRows";
import { rowToChunkLine } from "@/utils/rowToChunkLine";
import { getEmbedding } from "@/utils/getEmbedding";
import { pineconeIndex } from "@/utils/pineconeClient";
import { and } from "drizzle-orm";
import { eq } from "drizzle-orm/sql/expressions/conditions";

export async function GET(req: NextRequest) {
    // For demo, use a hardcoded userId (replace with real auth in production)
    const userId = "test";
    try {
        const tables = await db
            .select()
            .from(uploads)
            .where((u) => eq(u.userId, userId));
        return NextResponse.json({ tables });
    } catch (e: any) {
        console.error("DB fetch error:", e);
        return NextResponse.json({ error: "DB fetch failed", details: e.message || e.toString() }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    // Try to detect if this is a file upload (multipart/form-data) or JSON body
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
        const formData = await req.formData();
        const file = formData.get("file");
        const tableName = formData.get("tableName") as string;
        console.log("Received file:", file, "Table name:", tableName);

        if (!file || !(file instanceof File) || !tableName) {
            return NextResponse.json({ error: "Missing file or table name" }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = [
            "text/csv",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ];
        const name = file.name.toLowerCase();
        if (
            !allowedTypes.includes(file.type) &&
            !name.endsWith(".csv") &&
            !name.endsWith(".xls") &&
            !name.endsWith(".xlsx")
        ) {
            return NextResponse.json({ error: "Only CSV or Excel files are allowed." }, { status: 400 });
        }

        // Parse file to row data (array of objects)
        let rows: any[];
        try {
            rows = await parseFileToRows(file);
            console.log("Parsed rows:", rows);
        } catch (e: any) {
            return NextResponse.json({ error: e.message || "Failed to parse file" }, { status: 400 });
        }

        // 1. Turn each row into a chunk string
        const fields = Object.keys(rows[0] || {});
        const chunkLines = rows.map((row) => rowToChunkLine(row, fields));

        // 2. Get embeddings for each chunk
        const embeddings = await Promise.all(chunkLines.map((line) => getEmbedding(line)));

        // 3. Upsert to Pinecone
        try {
            const uploadId = crypto.randomUUID();
            await pineconeIndex.upsert(
                chunkLines.map((line, i) => ({
                    id: `${uploadId}-${i}`,
                    values: embeddings[i],
                    metadata: {
                        uploadId,
                        tableName,
                        chunk: line,
                        rowIndex: i,
                    },
                }))
            );

            const [inserted] = await db
                .insert(uploads)
                .values({
                    userId: "test", // Replace with real user ID in production
                    uploadId,
                    tableName,
                    tableDimensions: rows.length,
                    tableSize: file.size.toString(),
                    createdAt: new Date(),
                    rowData: rows,
                })
                .returning();
            return NextResponse.json({ inserted });
        } catch (e: any) {
            console.error("DB insert error:", e);
            return NextResponse.json(
                { error: "DB insert failed", details: e.message || e.toString() },
                { status: 500 }
            );
        }
    } else if (contentType.includes("application/json")) {
        // Accept a single row as JSON
        let body: any;
        try {
            body = await req.json();
        } catch (e) {
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
        }
        const { tableName, row } = body;
        if (!tableName || !row || typeof row !== "object") {
            return NextResponse.json({ error: "Missing tableName or row object" }, { status: 400 });
        }
        // Insert single row as array
        try {
            const userId = crypto.randomUUID();
            const uploadId = crypto.randomUUID();
            await db.insert(uploads).values({
                userId: "test", // Replace with real user ID in production
                uploadId,
                tableName,
                tableDimensions: 1,
                tableSize: JSON.stringify(row).length.toString(),
                createdAt: new Date(),
                rowData: [row],
            });
            return NextResponse.json({ success: true });
        } catch (e: any) {
            console.error("DB insert error:", e);
            return NextResponse.json(
                { error: "DB insert failed", details: e.message || e.toString() },
                { status: 500 }
            );
        }
    } else {
        return NextResponse.json({ error: "Unsupported content type" }, { status: 415 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { uploadId } = await req.json();
        if (!uploadId) {
            return NextResponse.json({ error: "Missing uploadId" }, { status: 400 });
        }
        // For demo, use hardcoded userId (replace with real auth in production)
        const userId = "test";

        // Query all vector IDs with this uploadId in metadata
        const dummyVector = Array(384).fill(0); // dimension must match index
        const queryResult = await pineconeIndex.query({
            vector: dummyVector,
            topK: 10000, // adjust if you expect more
            filter: { uploadId },
            includeValues: false,
            includeMetadata: false,
        });
        const idsToDelete = (queryResult.matches || []).map((m: any) => m.id);
        if (idsToDelete.length > 0) {
            await pineconeIndex.deleteMany(idsToDelete);
        }

        const result = await db.delete(uploads).where(and(eq(uploads.uploadId, uploadId), eq(uploads.userId, userId)));
        return NextResponse.json({ success: true });
    } catch (e: any) {
        console.error("DB delete error:", e);
        return NextResponse.json({ error: "DB delete failed", details: e.message || e.toString() }, { status: 500 });
    }
}
