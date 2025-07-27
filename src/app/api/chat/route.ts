import { NextRequest, NextResponse } from "next/server";
import { getEmbedding } from "@/utils/getEmbedding";

import { pineconeIndex } from "@/utils/pineconeClient";
import { generateMistralResponse, ChatMessage } from "@/utils/generateMistralResponse";

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
            topK: 3,
            includeMetadata: true,
        });
        const topChunks = (queryResult.matches || []).map((m: any) => m.metadata?.chunk).filter(Boolean);

        // 3. Concatenate user input and top 2 chunks as context
        const context = topChunks.join("\n");
        const prompt = context ? `Context:\n${context}\n\nUser: ${input}` : input;

        // 4. Call Mistral model with the prompt
        const messages: ChatMessage[] = [
            context
                ? { role: "system", content: `Use the following context to answer the user question.\n${context}` }
                : undefined,
            { role: "user", content: input },
        ].filter(Boolean) as ChatMessage[];

        const answer = await generateMistralResponse(messages);
        return NextResponse.json({ answer });
    } catch (e: any) {
        console.error("Chat error:", e);
        return NextResponse.json({ error: "Chat failed", details: e.message || e.toString() }, { status: 500 });
    }
}
