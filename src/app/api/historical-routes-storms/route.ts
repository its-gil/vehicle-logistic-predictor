import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const journey_id = searchParams.get("journey_id");
    if (!journey_id) {
        return new Response(JSON.stringify({ error: "Missing journey_id" }), { status: 400 });
    }

    // Load the journeys_storms.csv file
    const csvPath = path.join(process.cwd(), "public", "journeys_storms.csv");
    if (!fs.existsSync(csvPath)) {
        return new Response(JSON.stringify({ error: "Data file not found" }), { status: 500 });
    }
    const csvText = fs.readFileSync(csvPath, "utf8");
    const lines = csvText.trim().split("\n");
    const header = lines[0].split(",");
    const journeyIdx = header.indexOf("journey_id");
    const stormIdIdx = header.indexOf("storm_id");
    const stormNameIdx = header.indexOf("storm_name");
    const systemStatusIdx = header.indexOf("system_status");
    const latIdx = header.indexOf("lat");
    const lonIdx = header.indexOf("lon");
    const windIdx = header.indexOf("max_sustained_wind");
    const datetimeIdx = header.indexOf("datetime");
    const systemStatusDescIdx = header.indexOf("system_status_desc");

    if (
        journeyIdx === -1 ||
        stormIdIdx === -1 ||
        stormNameIdx === -1 ||
        systemStatusIdx === -1 ||
        latIdx === -1 ||
        lonIdx === -1 ||
        windIdx === -1 ||
        datetimeIdx === -1 ||
        systemStatusDescIdx === -1
    ) {
        return new Response(JSON.stringify({ error: "Missing required columns in CSV" }), { status: 500 });
    }

    const storms = lines
        .slice(1)
        .map((line) => {
            const cols = line.split(",");
            return {
                journey_id: cols[journeyIdx],
                storm_id: cols[stormIdIdx],
                storm_name: cols[stormNameIdx],
                system_status: cols[systemStatusIdx],
                lat:
                    cols[latIdx] === "" || cols[latIdx] === "null" || cols[latIdx] === "none"
                        ? null
                        : parseFloat(cols[latIdx]),
                lon:
                    cols[lonIdx] === "" || cols[lonIdx] === "null" || cols[lonIdx] === "none"
                        ? null
                        : parseFloat(cols[lonIdx]),
                max_sustained_wind:
                    cols[windIdx] === "" || cols[windIdx] === "null" || cols[windIdx] === "none"
                        ? null
                        : parseFloat(cols[windIdx]),
                datetime: cols[datetimeIdx],
                system_status_desc: cols[systemStatusDescIdx],
            };
        })
        .filter((storm) => storm.journey_id === journey_id);

    return Response.json({ journey_id, storms });
}
