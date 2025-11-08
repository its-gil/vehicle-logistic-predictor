import { NextRequest } from "next/server";
import { db } from "@/db";
import { marineWeatherData } from "@/db/schema";
import { fetchMarineWeather } from "@/utils/fetchMarineWeather";
import { eq, and, desc } from "drizzle-orm";
import { REPEATING_COORDINATES } from "@/constants/repeatingCoordinates";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const forceRefresh = searchParams.get("force") === "true";

        if (!forceRefresh) {
            // Simply return all cached entries
            const cachedData = await db.select().from(marineWeatherData).orderBy(desc(marineWeatherData.timestamp));

            const results = cachedData.map((data) => ({
                lat: data.lat,
                lon: data.lon,
                ocean_current_velocity: data.oceanCurrentVelocity,
                ocean_current_direction: data.oceanCurrentDirection,
                wind_speed_10m: data.windSpeed10m,
                wind_direction_10m: data.windDirection10m,
                wave_height: data.waveHeight,
                wave_direction: data.waveDirection,
                wave_period: data.wavePeriod,
                wind_wave_height: data.windWaveHeight,
                wind_wave_direction: data.windWaveDirection,
                wind_wave_period: data.windWavePeriod,
                swell_wave_height: data.swellWaveHeight,
                swell_wave_direction: data.swellWaveDirection,
                swell_wave_period: data.swellWavePeriod,
                timestamp: data.timestamp,
            }));

            // Get newest timestamp
            const newestTimestamp = cachedData.length > 0 ? cachedData[0].timestamp : new Date(0);

            console.log(`Returning ${results.length} cached marine weather points`);
            return Response.json({ results, timestamp: newestTimestamp }, { status: 200 });
        }

        // Force refresh - fetch and update all coordinates
        const results = [];
        const now = new Date();

        for (const { lat, lon } of REPEATING_COORDINATES) {
            console.log(`Fetching marine weather from API for lat=${lat}, lon=${lon}`);
            // eslint-disable-next-line no-await-in-loop
            const weatherData = await fetchMarineWeather(lat, lon);

            if (weatherData) {
                // eslint-disable-next-line no-await-in-loop
                await db
                    .update(marineWeatherData)
                    .set({
                        oceanCurrentVelocity: weatherData.ocean_current_velocity,
                        oceanCurrentDirection: weatherData.ocean_current_direction,
                        windSpeed10m: weatherData.wind_speed_10m,
                        windDirection10m: weatherData.wind_direction_10m,
                        waveHeight: weatherData.wave_height,
                        waveDirection: weatherData.wave_direction,
                        wavePeriod: weatherData.wave_period,
                        windWaveHeight: weatherData.wind_wave_height,
                        windWaveDirection: weatherData.wind_wave_direction,
                        windWavePeriod: weatherData.wind_wave_period,
                        swellWaveHeight: weatherData.swell_wave_height,
                        swellWaveDirection: weatherData.swell_wave_direction,
                        swellWavePeriod: weatherData.swell_wave_period,
                        timestamp: now,
                    })
                    .where(and(eq(marineWeatherData.lat, lat), eq(marineWeatherData.lon, lon)));

                console.log(`Updated marine weather for lat=${lat}, lon=${lon}`);
                results.push(weatherData);
            } else {
                console.error(`Failed to fetch marine weather for lat=${lat}, lon=${lon}`);
            }
        }

        console.log(`Updated ${results.length} marine weather points`);
        return Response.json({ results, timestamp: now }, { status: 200 });
    } catch (error) {
        console.error("Error fetching marine weather:", error);
        return Response.json({ error: "Failed to fetch marine weather data" }, { status: 500 });
    }
}
