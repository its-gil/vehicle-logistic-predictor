import fs from "fs";
import path from "path";
import { formatTimestamp } from "./formatTimestamp";

type MarineWeatherResult = {
    lat: number;
    lon: number;
    wind_speed_10m: number | null;
    wind_direction_10m: number | null;
    wave_height: number | null;
    wave_direction: number | null;
    wave_period: number | null;
    wind_wave_height: number | null;
    wind_wave_direction: number | null;
    wind_wave_period: number | null;
    swell_wave_height: number | null;
    swell_wave_direction: number | null;
    swell_wave_period: number | null;
    ocean_current_velocity: number | null;
    ocean_current_direction: number | null;
};

export async function getMarineWeather(lat: number, lon: number): Promise<MarineWeatherResult | null> {
    const wind_url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=wind_speed_10m,wind_direction_10m`;
    const marine_url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&current=wave_height,wave_direction,wave_period,wind_wave_height,wind_wave_direction,wind_wave_period,swell_wave_height,swell_wave_direction,swell_wave_period,ocean_current_velocity,ocean_current_direction`;

    try {
        const [windRes, marineRes] = await Promise.all([fetch(wind_url), fetch(marine_url)]);

        if (!windRes.ok || !marineRes.ok) {
            console.error("Failed to fetch marine weather data");
            return null;
        }

        const windData = await windRes.json();
        const marineData = await marineRes.json();

        let wind_speed_10m: number | null = null;
        let wind_direction_10m: number | null = null;

        if (windData.current) {
            if (typeof windData.current.wind_speed_10m === "number") {
                wind_speed_10m = windData.current.wind_speed_10m;
            }
            if (typeof windData.current.wind_direction_10m === "number") {
                wind_direction_10m = windData.current.wind_direction_10m;
            }
        }

        // Marine metrics
        const marineCurrent = marineData.current || {};
        const wave_height = typeof marineCurrent.wave_height === "number" ? marineCurrent.wave_height : null;
        const wave_direction = typeof marineCurrent.wave_direction === "number" ? marineCurrent.wave_direction : null;
        const wave_period = typeof marineCurrent.wave_period === "number" ? marineCurrent.wave_period : null;
        const wind_wave_height =
            typeof marineCurrent.wind_wave_height === "number" ? marineCurrent.wind_wave_height : null;
        const wind_wave_direction =
            typeof marineCurrent.wind_wave_direction === "number" ? marineCurrent.wind_wave_direction : null;
        const wind_wave_period =
            typeof marineCurrent.wind_wave_period === "number" ? marineCurrent.wind_wave_period : null;
        const swell_wave_height =
            typeof marineCurrent.swell_wave_height === "number" ? marineCurrent.swell_wave_height : null;
        const swell_wave_direction =
            typeof marineCurrent.swell_wave_direction === "number" ? marineCurrent.swell_wave_direction : null;
        const swell_wave_period =
            typeof marineCurrent.swell_wave_period === "number" ? marineCurrent.swell_wave_period : null;
        const ocean_current_velocity =
            typeof marineCurrent.ocean_current_velocity === "number" ? marineCurrent.ocean_current_velocity : null;
        const ocean_current_direction =
            typeof marineCurrent.ocean_current_direction === "number" ? marineCurrent.ocean_current_direction : null;

        return {
            lat,
            lon,
            wind_speed_10m,
            wind_direction_10m,
            wave_height,
            wave_direction,
            wave_period,
            wind_wave_height,
            wind_wave_direction,
            wind_wave_period,
            swell_wave_height,
            swell_wave_direction,
            swell_wave_period,
            ocean_current_velocity,
            ocean_current_direction,
        };
    } catch (error) {
        console.error("Error fetching marine weather:", error);
        return null;
    }
}
