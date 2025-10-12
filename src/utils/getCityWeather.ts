import fs from "fs";
import path from "path";

type CityWeatherResult = {
    now: any;
    tomorrow: any;
    week: any;
};

function getWeathercodeDescription(code: number | string): string {
    try {
        const jsonPath = path.join(process.cwd(), "public", "cities_weathercode_descriptions.json");
        const raw = fs.readFileSync(jsonPath, "utf8");
        const weathercodes = JSON.parse(raw);

        const codeStr = String(code);
        if (weathercodes[codeStr] && weathercodes[codeStr].day && weathercodes[codeStr].day.description) {
            return weathercodes[codeStr].day.description;
        }
        return String(code);
    } catch {
        return String(code);
    }
}

function formatTimeString(timeStr: string): string {
    // Example input: "2024-09-01T15:00"
    if (!timeStr.includes("T")) return timeStr;
    const [date, time] = timeStr.split("T");
    const [year, month, day] = date.split("-");
    const [hour, minute] = time.split(":");
    return `${day}.${month}.${year} ${hour}:${minute}`;
}

export async function getCityWeather(lat: number, lon: number): Promise<CityWeatherResult | null> {
    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=visibility,surface_pressure,temperature_2m,precipitation,weathercode,wind_speed_10m,wind_gusts_10m,wind_direction_10m,snowfall,snow_depth` +
        `&hourly=visibility,surface_pressure` +
        `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,snowfall_sum,snow_depth_max` +
        `&timezone=auto`;

    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();

    // Get current weather (now), skip 'interval' key if present
    let now: Record<string, any> = {};
    if (data.current) {
        const entries = Object.entries(data.current);
        entries.forEach(([key, value], idx) => {
            if (key === "interval") return; // skip interval
            if (key === "weathercode") {
                now[key] = getWeathercodeDescription(value as string | number);
            } else if (key === "time" && typeof value === "string" && value.includes("T")) {
                now[key] = formatTimeString(value);
            } else {
                now[key] = value;
            }
        });
    }

    // Find indices for tomorrow and one week ahead in hourly data
    let tomorrow = {};
    let week = {};
    if (data.hourly && Array.isArray(data.hourly.time)) {
        const nowDate = new Date(data.hourly.time[0]);
        const idx_tomorrow = data.hourly.time.findIndex((t: string) => {
            const d = new Date(t);
            return (d.getTime() - nowDate.getTime()) / (1000 * 60 * 60 * 24) >= 1;
        });
        const idx_week = data.hourly.time.findIndex((t: string) => {
            const d = new Date(t);
            return (d.getTime() - nowDate.getTime()) / (1000 * 60 * 60 * 24) >= 6;
        });

        if (idx_tomorrow !== -1) {
            tomorrow = Object.fromEntries(
                Object.entries(data.hourly).map(([k, arr]) => [k, Array.isArray(arr) ? arr[idx_tomorrow] : undefined])
            );
        }
        if (idx_week !== -1) {
            week = Object.fromEntries(
                Object.entries(data.hourly).map(([k, arr]) => [k, Array.isArray(arr) ? arr[idx_week] : undefined])
            );
        }
    }

    // Optionally, add daily values for tomorrow and week if available
    if (data.daily && Array.isArray(data.daily.time)) {
        if (data.daily.time.length > 1) {
            const daily_tomorrow = Object.fromEntries(
                Object.entries(data.daily).map(([k, arr]) => [k, Array.isArray(arr) ? arr[1] : undefined])
            );
            tomorrow = { ...tomorrow, ...daily_tomorrow };
        }
        if (data.daily.time.length > 6) {
            const daily_week = Object.fromEntries(
                Object.entries(data.daily).map(([k, arr]) => [k, Array.isArray(arr) ? arr[6] : undefined])
            );
            week = { ...week, ...daily_week };
        }
    }

    // Replace weathercode in tomorrow and week with description if present
    if ("weathercode" in tomorrow) {
        tomorrow["weathercode"] = getWeathercodeDescription(tomorrow["weathercode"] as string | number);
    }
    if ("weathercode" in week) {
        week["weathercode"] = getWeathercodeDescription(week["weathercode"] as string | number);
    }

    return {
        now,
        tomorrow,
        week,
    };
}
