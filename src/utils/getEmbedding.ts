const HF_API_URL = process.env.HF_API_URL!;
const HF_API_KEY = process.env.HF_API_KEY!;

export async function getEmbedding(row: string): Promise<number[]> {
    try {
        const response = await fetch(HF_API_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${HF_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs: row }),
        });

        if (!response.ok) {
            console.warn(`HF API error: ${response.status}`);
            return [];
        }

        const data = await response.json();

        // Ensure correct format
        return Array.isArray(data) ? (data as number[]) : [];
    } catch (error) {
        console.error(`Error fetching embedding for "${row}":`, error);
        return [];
    }
}
