import fs from "fs";
import path from "path";
import { StormPoint } from "@/types";

export default async function getHistoricalStorms(): Promise<StormPoint[]> {
    // Resolve the path to the CSV file in the public folder
    const csvPath = path.join(process.cwd(), "public", "hurdat2_storm_data_1851_2025.csv");

    // Check if the file exists
    if (!fs.existsSync(csvPath)) {
        throw new Error(`CSV file not found at ${csvPath}`);
    }

    // Read the CSV file
    const csvText = fs.readFileSync(csvPath, "utf8");

    // Parse the CSV data
    const lines = csvText.split("\n").filter((l) => l.trim());
    const header = lines[0].split(",");

    const nameIdx = header.findIndex((h) => h.toLowerCase().includes("name"));
    const latIdx = header.findIndex((h) => h.toLowerCase().includes("lat"));
    const lonIdx = header.findIndex((h) => h.toLowerCase().includes("lon"));
    const windIdx = header.findIndex((h) => h.toLowerCase().includes("wind"));
    const timeIdx = header.findIndex((h) => h.toLowerCase().includes("time"));

    const points = lines
        .slice(1)
        .map((line) => {
            const cols = line.split(",");
            return {
                name: cols[nameIdx] || "",
                lat: parseFloat(cols[latIdx]),
                lon: parseFloat(cols[lonIdx]),
                intensity: parseInt(cols[windIdx], 10) || 0,
                timestamp: cols[timeIdx] || "",
            };
        })
        .filter((p) => !isNaN(p.lat) && !isNaN(p.lon) && p.timestamp);

    return points;
}
