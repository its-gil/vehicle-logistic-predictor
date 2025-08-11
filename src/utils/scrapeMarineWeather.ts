import { cityPortList } from "./cityPortList";

type MarineWeatherResult = {
    current: any;
    hourly_2days: any;
    hourly_7days: any;
};

export async function scrapeMarineWeather(lat: number, lon: number): Promise<MarineWeatherResult | null> {
    const url =
        `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}` +
        `&hourly=wave_height,wave_direction,wave_period,wind_wave_height,wind_wave_direction,wind_wave_period,swell_wave_height,swell_wave_direction,swell_wave_period,ocean_current_velocity,ocean_current_direction` +
        `&current=wave_height,wave_direction,wave_period,wind_wave_height,wind_wave_direction,wind_wave_period,swell_wave_height,swell_wave_direction,swell_wave_period,ocean_current_velocity,ocean_current_direction` +
        `&timezone=auto`;

    const res = await fetch(url);
    if (!res.ok) return null;
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

    return {
        current,
        hourly_2days,
        hourly_7days,
    };
}

// Example: scrape marine weather for all cities
export async function scrapeAllCitiesMarineWeather() {
    return Promise.all(
        cityPortList.map(({ name, lat, lon }) =>
            scrapeMarineWeather(lat, lon).then((weather) => ({
                name,
                lat,
                lon,
                weather,
            }))
        )
    );
}
