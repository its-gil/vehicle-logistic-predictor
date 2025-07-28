import { NextRequest, NextResponse } from "next/server";
import { getEmbedding } from "@/utils/getEmbedding";
import { pineconeIndex } from "@/utils/pineconeClient";
import { generateAIResponse, ChatMessage } from "@/utils/generateAIResponse";
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

        // 2. Query Pinecone for top 100 similar chunks
        let context = "";
        let contextFound = false;
        try {
            const queryResult = await pineconeIndex.query({
                vector: inputEmbedding,
                topK: 100,
                includeMetadata: true,
            });
            const topChunks = (queryResult.matches || []).map((m: any) => m.metadata?.chunk).filter(Boolean);
            context = topChunks.join("\n");
            contextFound = topChunks.length > 0;
        } catch (err) {
            // If Pinecone is empty or unavailable, treat as no context
            context = "";
            contextFound = false;
        }

        console.log("Context found:", contextFound, "Content length:", context.length);
        console.log(context);

        // 3. Build prompt
        let messagesArr: ChatMessage[];
        if (contextFound) {
            messagesArr = [
                {
                    role: "system",
                    content: `If useful, refer to the following context:\n${context}\n.`,
                },
                { role: "user", content: input },
            ];
        } else {
            messagesArr = [
                {
                    role: "system",
                    content:
                        "No relevant context is available. Answer the user's question using your general knowledge.",
                },
                { role: "user", content: input },
            ];
        }

        console.log("Messages array:", messagesArr);

        // 4. Call Mistral model with the prompt
        const answer = await generateAIResponse(messagesArr);

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
