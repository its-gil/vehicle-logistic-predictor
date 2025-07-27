const HF_API_GEN_URL = process.env.HF_API_GEN_URL!; // e.g. https://router.huggingface.co/v1/chat/completions
const HF_API_KEY = process.env.HF_API_KEY!;

export interface ChatMessage {
    role: "user" | "assistant" | "system";
    content: string;
}

export async function generateMistralResponse(
    messages: ChatMessage[],
    model: string = "mistralai/Mistral-7B-Instruct-v0.2:featherless-ai"
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
        if (!response.ok) {
            console.warn(`Mistral API error: ${response.status}`);
            return "";
        }
        const data = await response.json();
        // The response format is { choices: [{ message: { content: ... } }] }
        if (data.choices && Array.isArray(data.choices) && data.choices[0]?.message?.content) {
            return data.choices[0].message.content;
        }
        return "";
    } catch (error) {
        console.error("Error generating Mistral response:", error);
        return "";
    }
}
