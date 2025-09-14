import fs from "fs";
import path from "path";

type MarineWeatherResult = {
    lat: number;
    lon: number;
    count: number;
    metrics: Record<string, number>;
};

export async function scrapeMarineWeatherAverage(): Promise<{
    averages: Record<string, number>;
    points: MarineWeatherResult[];
}> {
    const csvPath = path.join(process.cwd(), "public", "repeating_coordinates.csv");
    const csvText = fs.readFileSync(csvPath, "utf8");
    const lines = csvText.trim().split("\n");
    const header = lines[0].split(",");
    const latIdx = header.indexOf("lat_int");
    const lonIdx = header.indexOf("lon_int");
    const countIdx = header.indexOf("count");

    const points: MarineWeatherResult[] = [];
    const allMetrics: Record<string, number[]> = {};

    for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",");
        const lat = parseFloat(cols[latIdx]);
        const lon = parseFloat(cols[lonIdx]);
        const count = parseInt(cols[countIdx], 10);

        // Fetch marine weather for each point
        const marine_url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&current=wave_height,wave_direction,wave_period,wind_wave_height,wind_wave_direction,wind_wave_period,swell_wave_height,swell_wave_direction,swell_wave_period,ocean_current_velocity,ocean_current_direction`;
        const wind_url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=wind_speed_10m,wind_direction_10m`;

        // eslint-disable-next-line no-await-in-loop
        const marineRes = await fetch(marine_url);
        // eslint-disable-next-line no-await-in-loop
        const windRes = await fetch(wind_url);

        if (!marineRes.ok || !windRes.ok) continue;

        // eslint-disable-next-line no-await-in-loop
        const marineData = await marineRes.json();
        // eslint-disable-next-line no-await-in-loop
        const windData = await windRes.json();

        // Collect only metrics from 'current' sections for this point (ignore interval/time)
        const metrics: Record<string, number> = {};

        if (marineData.current) {
            Object.entries(marineData.current).forEach(([key, value]) => {
                if (
                    typeof value === "number" &&
                    !key.toLowerCase().includes("interval") &&
                    !key.toLowerCase().includes("time")
                ) {
                    metrics[key] = value;
                    allMetrics[key] = allMetrics[key] || [];
                    allMetrics[key].push(value);
                }
            });
        }

        if (windData.current) {
            Object.entries(windData.current).forEach(([key, value]) => {
                if (
                    typeof value === "number" &&
                    !key.toLowerCase().includes("interval") &&
                    !key.toLowerCase().includes("time")
                ) {
                    metrics[key] = value;
                    allMetrics[key] = allMetrics[key] || [];
                    allMetrics[key].push(value);
                }
            });
        }

        points.push({
            lat,
            lon,
            count,
            metrics,
        });
    }

    // Aggregate: calculate average for each metric across all points
    const averages: Record<string, number> = {};
    Object.entries(allMetrics).forEach(([key, arr]) => {
        if (arr.length > 0) {
            averages[key] = arr.reduce((a, b) => a + b, 0) / arr.length;
        }
    });

    return { averages, points };
}
