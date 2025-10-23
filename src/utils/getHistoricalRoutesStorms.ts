import fs from "fs";
import path from "path";
import { StormPoint } from "@/types/storms";
import { formatDate } from "./formatTimestamp";

export function getHistoricalRoutesStorms(start_date: string, end_date: string): StormPoint[] {
    if (!start_date || !end_date) {
        throw new Error("Both start_date and end_date are required.");
    }

    // Validate and parse the given date range
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    console.log("Parsed Start Date:", startDate);
    console.log("Parsed End Date:", endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error("Invalid date format. Please provide valid ISO date strings.");
    }

    const csvPath = path.join(process.cwd(), "public", "hurdat2_storm_data_1851_2025.csv");
    if (!fs.existsSync(csvPath)) {
        throw new Error(`Data file not found at path: ${csvPath}`);
    }

    const csvText = fs.readFileSync(csvPath, "utf8");
    const lines = csvText.trim().split("\n");
    const header = lines[0].split(",");

    // Map column indices
    const stormIdIdx = header.indexOf("storm_id");
    const stormNameIdx = header.indexOf("storm_name");
    const systemStatusIdx = header.indexOf("system_status");
    const latIdx = header.indexOf("lat");
    const lonIdx = header.indexOf("lon");
    const windIdx = header.indexOf("max_sustained_wind");
    const datetimeIdx = header.indexOf("datetime");
    const systemStatusDescIdx = header.indexOf("system_status_desc");

    // Validate required columns
    if (
        stormIdIdx === -1 ||
        stormNameIdx === -1 ||
        systemStatusIdx === -1 ||
        latIdx === -1 ||
        lonIdx === -1 ||
        windIdx === -1 ||
        datetimeIdx === -1 ||
        systemStatusDescIdx === -1
    ) {
        throw new Error("Missing required columns in the CSV file.");
    }

    // Parse and filter storms
    const storms: StormPoint[] = lines
        .slice(1)
        .map((line, index) => {
            const cols = line.split(",").map((col) => col.trim()); // Trim each column value

            // Parse the storm date and normalize it to ISO format
            const stormDateStr = cols[datetimeIdx];
            const stormDate = new Date(stormDateStr.replace(" ", "T")); // Convert "1851-06-25 00:00:00" to "1851-06-25T00:00:00"

            const lat = parseFloat(cols[latIdx]);
            const lon = parseFloat(cols[lonIdx]);
            const maxSustainedWind = cols[windIdx] ? parseFloat(cols[windIdx]) : null;

            if (
                isNaN(stormDate.getTime()) || // Invalid date
                isNaN(lat) || // Invalid latitude
                isNaN(lon) || // Invalid longitude
                !cols[stormIdIdx] // Missing storm_id
            ) {
                console.warn(`Skipping invalid row at index ${index + 1}: ${line}`);
                return null;
            }

            return {
                id: cols[stormIdIdx],
                storm_id: cols[stormIdIdx],
                storm_name: cols[stormNameIdx] || undefined,
                system_status: cols[systemStatusIdx] || undefined,
                system_status_desc: cols[systemStatusDescIdx] || undefined,
                lat,
                lon,
                max_sustained_wind: maxSustainedWind,
                datetime: stormDate.toISOString(), // Store the normalized ISO date string
            } as StormPoint;
        })
        .filter((storm) => storm !== null)
        .filter((storm) => {
            // Filter rows within the date range
            const stormDate = new Date(storm!.datetime!);
            return stormDate >= startDate && stormDate <= endDate;
        }) as StormPoint[];

    // Format the datetime field before returning the result
    const formattedStorms = storms.map((storm) => ({
        ...storm,
        datetime: formatDate(storm.datetime), // Format the datetime field
    }));

    console.log(formattedStorms);
    return formattedStorms;
}
