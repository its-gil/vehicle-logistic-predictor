import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { ShipPoint } from "@/types/ships";

export function getHistoricalRoutes(): ShipPoint[] {
    const csvPath = path.join(process.cwd(), "public", "full_weather_with_storms.csv");

    // Check if the file exists
    if (!fs.existsSync(csvPath)) {
        throw new Error("CSV file not found");
    }

    // Read the CSV file
    const csvText = fs.readFileSync(csvPath, "utf8");

    // Parse the CSV data
    const parsed = Papa.parse<ShipPoint>(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(), // Ensure headers are trimmed
    });

    // Map the parsed data to the ShipPoint type
    const validData: ShipPoint[] = parsed.data.map((row) => ({
        mmsi: row.mmsi || "",
        journey_id: row.journey_id || "",
        lat: parseFloat(row.lat as unknown as string) || 0,
        lon: parseFloat(row.lon as unknown as string) || 0,
        date: row.date || "",
    }));

    return validData;
}
