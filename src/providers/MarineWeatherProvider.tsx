import React, { createContext, useContext, useEffect, useState } from "react";
import fs from "fs";
import path from "path";
import { formatTimestamp } from "@/utils/formatTimestamp";

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
        async function fetchMarineWeather() {
            setLoading(true);
            try {
                const res = await fetch(`/api/marine-weather`);

                if (!res.ok) throw new Error("Failed to fetch marine weather data");

                const data = await res.json();

                if (Array.isArray(data)) {
                    setMarineWeather(data);
                }
            } catch (err) {
                console.log("Error fetching marine weather data:", err);
            }
            setLoading(false);
        }
        fetchMarineWeather();
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
