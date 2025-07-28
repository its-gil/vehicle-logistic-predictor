import { NextRequest, NextResponse } from "next/server";
import { getEmbedding } from "@/utils/getEmbedding";
import { pineconeIndex } from "@/utils/pineconeClient";
import { generateMistralResponse, ChatMessage } from "@/utils/generateMistralResponse";
import { db } from "@/db";
import { chats, messages } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    try {
        const { input, chatName, chatId } = await req.json();
        if (!input || typeof input !== "string") {
            return NextResponse.json({ error: "Missing or invalid input" }, { status: 400 });
        }

        // 1. Get embedding for user input
        const inputEmbedding = await getEmbedding(input);

        // 2. Query Pinecone for top 2 similar chunks
        const queryResult = await pineconeIndex.query({
            vector: inputEmbedding,
            topK: 3,
            includeMetadata: true,
        });
        const topChunks = (queryResult.matches || []).map((m: any) => m.metadata?.chunk).filter(Boolean);

        // 3. Concatenate user input and top 2 chunks as context
        const context = topChunks.join("\n");

        // 4. Call Mistral model with the prompt
        const messagesArr: ChatMessage[] = [
            context
                ? { role: "system", content: `Use the following context to answer the user question.\n${context}` }
                : undefined,
            { role: "user", content: input },
        ].filter(Boolean) as ChatMessage[];

        const answer = await generateMistralResponse(messagesArr);

        // 5. Find or create chat
        let chat_id = chatId;
        if (!chat_id) {
            if (!chatName || typeof chatName !== "string") {
                return NextResponse.json({ error: "Missing chatName for new chat" }, { status: 400 });
            }
            const [chat] = await db
                .insert(chats)
                .values({
                    userId: "test", // Replace with real user ID in production
                    chatName,
                })
                .returning();
            chat_id = chat.id;
        }

        // 6. Store message in the database
        await db.insert(messages).values({
            chatId: chat_id,
            question: input,
            answer,
        });

        return NextResponse.json({ answer, chatId: chat_id });
    } catch (e: any) {
        console.error("Chat error:", e);
        return NextResponse.json({ error: "Chat failed", details: e.message || e.toString() }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const chatId = searchParams.get("chatId");
        if (!chatId) {
            return NextResponse.json({ error: "Missing chatId" }, { status: 400 });
        }

        const chatIdNum = Number(chatId);
        if (isNaN(chatIdNum)) {
            return NextResponse.json({ error: "Invalid chatId" }, { status: 400 });
        }

        const msgs = await db.select().from(messages).where(eq(messages.chatId, chatIdNum)).orderBy(messages.id);

        // Format as { role, content }
        const formatted = msgs
            .map((msg: any) => [
                { role: "user", content: msg.question },
                { role: "assistant", content: msg.answer },
            ])
            .flat();

        return NextResponse.json({ messages: formatted });
    } catch (e: any) {
        return NextResponse.json(
            { error: "Failed to fetch messages", details: e.message || e.toString() },
            { status: 500 }
        );
    }
}
