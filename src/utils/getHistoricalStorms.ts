import { StormPoint } from "@/types";

export default async function getHistoricalStorms(): Promise<StormPoint[]> {
    const response = await fetch("/hurdat2_storm_data_1851_2025.csv");
    const csvText = await response.text();

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
