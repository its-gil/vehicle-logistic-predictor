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
    // 1. Get uploaded car/destination data
    const uploaded = await db.select().from(uploads).orderBy(uploads.createdAt).limit(1);
    const carTable = uploaded[0]?.rowData || [];

    const origin = "52.4077,8.0016"; //bramsche
    const destination = "53.5488,9.9872"; //hamburg
    const blockages = await fetchHereIncidents(origin, destination);
    console.log("Blockages along route:", blockages);

    // 3. Build prompt for AI
    const prompt = `
Given the following car data and current road blockages in Germany, estimate the percentage of vehicles that are potentially blocked. Only respond with a percentage (e.g., '23%').

Cars and destinations:
${JSON.stringify(carTable, null, 2)}

Road blockages:
${JSON.stringify(blockages, null, 2)}
`;

    console.log("Generated prompt:", prompt);

    // 4. Call AI model
    const percentage = await generateAIResponse([
        {
            role: "system",
            content: "You are an assistant that only responds with a percentage (e.g., '23%').",
        },
        {
            role: "user",
            content: prompt,
        },
    ]);

    console.log("AI response percentage:", percentage);

    return NextResponse.json({ percentage });
}
