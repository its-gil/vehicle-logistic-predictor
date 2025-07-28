const HF_API_GEN_URL = process.env.HF_API_GEN_URL!;
const HF_API_KEY = process.env.HF_API_KEY!;

export interface ChatMessage {
    role: "user" | "assistant" | "system";
    content: string;
}

export async function generateAIResponse(
    messages: ChatMessage[],
    model: string = "meta-llama/Llama-3.3-70B-Instruct"
): Promise<string> {
    try {
        const response = await fetch(HF_API_GEN_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${HF_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messages,
                model,
                stream: false,
            }),
        });
        if (response.ok) {
            const data = await response.json();
            if (data.choices && Array.isArray(data.choices) && data.choices[0]?.message?.content) {
                return data.choices[0].message.content;
            }
            return "";
        } else {
            // Try fallback model if available
            if (model !== "mistralai/Mistral-7B-Instruct-v0.2:featherless-ai") {
                console.warn(`Llama API error: ${response.status}. Trying fallback model...`);
                return await generateAIResponse(messages, "mistralai/Mistral-7B-Instruct-v0.2:featherless-ai");
            }
            console.warn(`Both models failed: ${response.status}`);
            return "";
        }
    } catch (error) {
        // Try fallback model if available
        if (model !== "mistralai/Mistral-7B-Instruct-v0.2:featherless-ai") {
            console.error("Error generating AI response, trying fallback:", error);
            return await generateAIResponse(messages, "mistralai/Mistral-7B-Instruct-v0.2:featherless-ai");
        }
        console.error("Error generating Mistral response:", error);
        return "";
    }
}
