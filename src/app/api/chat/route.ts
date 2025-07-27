import { NextRequest, NextResponse } from "next/server";
import { getEmbedding } from "@/utils/getEmbedding";
import { pineconeIndex } from "@/utils/pineconeClient";

export async function POST(req: NextRequest) {
    try {
        const { input } = await req.json();
        if (!input || typeof input !== "string") {
            return NextResponse.json({ error: "Missing or invalid input" }, { status: 400 });
        }

        // 1. Get embedding for user input
        const inputEmbedding = await getEmbedding(input);

        // 2. Query Pinecone for top 2 similar chunks
        const queryResult = await pineconeIndex.query({
            vector: inputEmbedding,
            topK: 2,
            includeMetadata: true,
        });
        const topChunks = (queryResult.matches || []).map((m: any) => m.metadata?.chunk).filter(Boolean);

        // 3. Return concatenation of user input and top 2 chunks
        const result = [input, ...topChunks].join("\n");
        return NextResponse.json({ result });
    } catch (e: any) {
        console.error("Chat error:", e);
        return NextResponse.json({ error: "Chat failed", details: e.message || e.toString() }, { status: 500 });
    }
}
