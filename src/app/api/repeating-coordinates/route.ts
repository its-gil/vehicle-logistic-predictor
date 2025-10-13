import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
    try {
        // Path to the CSV file
        const csvPath = path.join(process.cwd(), "public", "repeating_coordinates.csv");
        const csvText = fs.readFileSync(csvPath, "utf8");

        // Parse the CSV file
        const lines = csvText.trim().split("\n");
        const header = lines[0].split(",");
        const latIdx = header.indexOf("lat_int");
        const lonIdx = header.indexOf("lon_int");

        if (latIdx === -1 || lonIdx === -1) {
            throw new Error("CSV file does not contain 'lat_int' or 'lon_int' columns");
        }

        const coordinates = lines.slice(1).map((line) => {
            const cols = line.split(",");
            return {
                lat: parseFloat(cols[latIdx]),
                lon: parseFloat(cols[lonIdx]),
            };
        });

        return NextResponse.json({ coordinates });
    } catch (error) {
        console.error("Error reading CSV file:", error);
        return NextResponse.json({ error: "Failed to read CSV file" }, { status: 500 });
    }
}
