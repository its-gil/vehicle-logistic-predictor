import React, { createContext, useContext, useEffect, useState } from "react";
import fs from "fs";
import path from "path";
import { formatTimestamp } from "@/utils/formatTimestamp";
import { getMarineWeather } from "@/utils/getMarineWeather";

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

type MarineWeatherContextType = {
    marineWeather: MarineWeatherResult[];
    timestamp: string;
    loading?: boolean;
};

const MarineWeatherContext = createContext<MarineWeatherContextType>({
    marineWeather: [],
    timestamp: formatTimestamp(new Date()),
    loading: true,
});

export function MarineWeatherProvider({ children }: { children: React.ReactNode }) {
    const [marineWeather, setMarineWeather] = useState<MarineWeatherResult[]>([]);
    const [timestamp, setTimestamp] = useState(formatTimestamp(new Date()));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMarineWeatherForRepeatingCoordinates() {
            setLoading(true);
            try {
                // Read the CSV file
                const csvPath = path.join(process.cwd(), "public", "repeating_coordinates.csv");
                const csvText = fs.readFileSync(csvPath, "utf8");
                const lines = csvText.trim().split("\n");
                const header = lines[0].split(",");
                const latIdx = header.indexOf("lat");
                const lonIdx = header.indexOf("lon");

                const results: MarineWeatherResult[] = [];

                for (let i = 1; i < lines.length; i++) {
                    const cols = lines[i].split(",");
                    const lat = parseFloat(cols[latIdx]);
                    const lon = parseFloat(cols[lonIdx]);

                    // Fetch marine weather for each coordinate
                    // eslint-disable-next-line no-await-in-loop
                    const weather = await getMarineWeather(lat, lon);
                    if (weather) {
                        results.push(weather);
                    }
                }

                setMarineWeather(results);
                setTimestamp(formatTimestamp(new Date()));
            } catch (err) {
                console.error("Error fetching marine weather data:", err);
            }
            setLoading(false);
        }

        fetchMarineWeatherForRepeatingCoordinates();
    }, []);

    return (
        <MarineWeatherContext.Provider value={{ marineWeather, timestamp, loading }}>
            {children}
        </MarineWeatherContext.Provider>
    );
}

export function useMarineWeather() {
    return useContext(MarineWeatherContext);
}
