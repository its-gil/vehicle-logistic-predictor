import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { chats, messages } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    try {
        const { chatName } = await req.json();
        if (!chatName) {
            return NextResponse.json({ error: "Missing chatName" }, { status: 400 });
        }
        const [chat] = await db
            .insert(chats)
            .values({
                userId: "test", // Replace with real user ID in production
                chatName,
            })
            .returning();
        return NextResponse.json({ chatId: chat.id, chatName: chat.chatName });
    } catch (e: any) {
        return NextResponse.json(
            { error: "Failed to create chat", details: e.message || e.toString() },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const allChats = await db.select().from(chats);
        return NextResponse.json({ chats: allChats });
        // later check if we need to filter by userId
    } catch (e: any) {
        return NextResponse.json(
            { error: "Failed to fetch chats", details: e.message || e.toString() },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) {
            return NextResponse.json({ error: "Missing id" }, { status: 400 });
        }
        const chatId = Number(id);
        if (isNaN(chatId)) {
            return NextResponse.json({ error: "Invalid id" }, { status: 400 });
        }
        // Delete messages first (simulate ON DELETE CASCADE)
        await db.delete(messages).where(eq(messages.chatId, chatId));
        // Then delete chat
        await db.delete(chats).where(eq(chats.id, chatId));
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json(
            { error: "Failed to delete chat", details: e.message || e.toString() },
            { status: 500 }
        );
    }
}
