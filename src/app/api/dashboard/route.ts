import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { uploads } from "@/db/schema";
import { generateAIResponse } from "@/utils/generateAIResponse";

const HERE_API_KEY = process.env.HERE_API_KEY;

// Bounding box for Germany: minLon,minLat,maxLon,maxLat
const GERMANY_BBOX = "7.5,48.5,8.8,49.3"; //BW Northwest

async function fetchHereIncidents(origin: string, destination: string) {
    const url = `https://router.hereapi.com/v8/routes?origin=${origin}&destination=${destination}&return=polyline,incidents,summary&spans=incidents&transportMode=car&apiKey=${HERE_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) {
        const errorText = await res.text();
        console.error("HERE Routing API fetch failed:", res.status, errorText);
        return [];
    }
    const data = await res.json();
    // Collect all incident descriptions from all sections
    const descriptions: string[] = [];
    const sections = data?.routes?.[0]?.sections || [];
    for (const section of sections) {
        // section.incidents is an array of incident objects
        if (section.incidents && Array.isArray(section.incidents)) {
            for (const incident of section.incidents) {
                if (incident.description) {
                    descriptions.push(incident.description);
                }
                if (incident.type) {
                    descriptions.push(incident.type);
                }
                if (incident.criticality) {
                    descriptions.push(incident.criticality);
                }
            }
        }
    }
    return descriptions;
}

export async function GET() {
    // 1. Get all uploaded car/destination data (not just the latest)
    const uploaded = await db.select().from(uploads).orderBy(uploads.createdAt);
    const allCarTables = uploaded.map((u) => u.rowData).filter(Boolean);

    // 2. Build prompt for AI, including all table contents and request for explanation
    const prompt = `
Given the blockages in Germany from the provided tables, explain your reasoning by mentioning the vehicles with their start and ending points, the blocked roads and then estimate the percentage of vehicles that are potentially blocked on their way of being delivered. At the end, return only the percentage of vehicles from the total vehicles (e.g., '23%') on a new line.

Here are all tables with vehicles and their destinations:
${JSON.stringify(allCarTables, null, 2)}
`;

    // 3. Call AI model
    const aiResponse = await generateAIResponse([
        {
            role: "system",
            content:
                "You are an assistant that explains your logic step by step and at the end only returns a percentage (e.g., '23%') on a new line.",
        },
        {
            role: "user",
            content: prompt,
        },
    ]);

    // Log the full explanation for debugging
    console.log("AI full response:", aiResponse);

    // Extract only the percentage from the last line of the response
    const lines = aiResponse.trim().split("\n");
    const lastLine = lines[lines.length - 1];
    const match = lastLine.match(/(\d+(\.\d+)?)%/);
    const percentage = match ? match[0] : null;

    // Return both the full explanation and the percentage
    return NextResponse.json({ percentage, explanation: aiResponse });
}
