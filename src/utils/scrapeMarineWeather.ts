import fs from "fs";
import path from "path";

type MarineWeatherResult = {
    lat: number;
    lon: number;
    current: any;
    hourly_2days: any;
    hourly_7days: any;
};

export async function scrapeMarineWeather(): Promise<MarineWeatherResult[]> {
    const csvPath = path.join(process.cwd(), "public", "repeating_coordinates.csv");
    const csvText = fs.readFileSync(csvPath, "utf8");
    const lines = csvText.trim().split("\n");
    const header = lines[0].split(",");
    const latIdx = header.indexOf("lat_int");
    const lonIdx = header.indexOf("lon_int");
    const countIdx = header.indexOf("count");

    const results: MarineWeatherResult[] = [];

    for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",");
        const lat = parseFloat(cols[latIdx]);
        const lon = parseFloat(cols[lonIdx]);
        const count = parseInt(cols[countIdx], 10);

        // Fetch marine weather for each point
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=wind_speed_10m_max,wind_direction_10m_dominant&hourly=wind_speed_10m,wind_direction_10m&current=wind_speed_10m,wind_direction_10m`;
        // eslint-disable-next-line no-await-in-loop
        const res = await fetch(url);
        if (!res.ok) continue;
        // eslint-disable-next-line no-await-in-loop
        const data = await res.json();

        // Get current marine weather
        const current = data.current || {};

        // Get hourly: now + 2 days, now + 7 days
        let hourly_2days = {};
        let hourly_7days = {};
        if (data.hourly && Array.isArray(data.hourly.time)) {
            const now = new Date(data.hourly.time[0]);
            const idx_2days = data.hourly.time.findIndex((t: string) => {
                const d = new Date(t);
                return (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) >= 2;
            });
            const idx_7days = data.hourly.time.findIndex((t: string) => {
                const d = new Date(t);
                return (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) >= 6;
            });

            if (idx_2days !== -1) {
                hourly_2days = Object.fromEntries(
                    Object.entries(data.hourly).map(([k, arr]) => [k, Array.isArray(arr) ? arr[idx_2days] : undefined])
                );
            }
            if (idx_7days !== -1) {
                hourly_7days = Object.fromEntries(
                    Object.entries(data.hourly).map(([k, arr]) => [k, Array.isArray(arr) ? arr[idx_7days] : undefined])
                );
            }
        }

        results.push({
            lat,
            lon,
            current,
            hourly_2days,
            hourly_7days,
        });
    }

    return results;
}

export async function scrapeMarineWeatherByLatLon(lat: number, lon: number) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=wind_speed_10m_max,wind_direction_10m_dominant&hourly=wind_speed_10m,wind_direction_10m&current=wind_speed_10m,wind_direction_10m`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    console.log("marineWeather", data);

    // Get current marine weather
    const current = data.current || {};

    // Get hourly: now + 2 days, now + 7 days
    let hourly_2days = {};
    let hourly_7days = {};
    if (data.hourly && Array.isArray(data.hourly.time)) {
        const now = new Date(data.hourly.time[0]);
        const idx_2days = data.hourly.time.findIndex((t: string) => {
            const d = new Date(t);
            return (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) >= 2;
        });
        const idx_7days = data.hourly.time.findIndex((t: string) => {
            const d = new Date(t);
            return (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) >= 6;
        });

        if (idx_2days !== -1) {
            hourly_2days = Object.fromEntries(
                Object.entries(data.hourly).map(([k, arr]) => [k, Array.isArray(arr) ? arr[idx_2days] : undefined])
            );
        }
        if (idx_7days !== -1) {
            hourly_7days = Object.fromEntries(
                Object.entries(data.hourly).map(([k, arr]) => [k, Array.isArray(arr) ? arr[idx_7days] : undefined])
            );
        }
    }

    return {
        lat,
        lon,
        current,
        hourly_2days,
        hourly_7days,
    };
}
