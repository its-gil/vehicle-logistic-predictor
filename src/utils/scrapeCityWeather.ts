import { cityPortList } from "./cityPortList";

type CityWeatherResult = {
    current: any;
    hourly_2days: any;
    hourly_7days: any;
    daily_2days: any;
    daily_7days: any;
};

export async function scrapeCityWeather(lat: number, lon: number): Promise<CityWeatherResult | null> {
    // Build the Open-Meteo API URL
    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,precipitation,weathercode,wind_speed_10m,wind_gusts_10m,wind_direction_10m,visibility,snowfall,snow_depth` +
        `&hourly=temperature_2m,precipitation_probability,precipitation,weathercode,wind_speed_10m,wind_gusts_10m,wind_direction_10m,visibility,pressure_msl,snowfall,snow_depth` +
        `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,snowfall_sum,snow_depth_max` +
        `&timezone=auto`;

    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();

    // Get current weather
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

    // Get daily: in 2 days, in 7 days
    let daily_2days = {};
    let daily_7days = {};
    if (data.daily && Array.isArray(data.daily.time)) {
        // Index 2 and 6 for 2 and 7 days ahead (assuming daily.time[0] is today)
        if (data.daily.time.length > 2) {
            daily_2days = Object.fromEntries(
                Object.entries(data.daily).map(([k, arr]) => [k, Array.isArray(arr) ? arr[2] : undefined])
            );
        }
        if (data.daily.time.length > 6) {
            daily_7days = Object.fromEntries(
                Object.entries(data.daily).map(([k, arr]) => [k, Array.isArray(arr) ? arr[6] : undefined])
            );
        }
    }

    return {
        current,
        hourly_2days,
        hourly_7days,
        daily_2days,
        daily_7days,
    };
}

// Example: scrape weather for all cities
export async function scrapeAllCitiesWeather() {
    return Promise.all(
        cityPortList.map(({ name, lat, lon }) =>
            scrapeCityWeather(lat, lon).then((weather) => ({
                name,
                lat,
                lon,
                weather,
            }))
        )
    );
}
