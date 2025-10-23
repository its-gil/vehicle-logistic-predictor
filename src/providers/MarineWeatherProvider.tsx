import React, { createContext, useContext, useEffect, useState } from "react";
import { MarineWeatherResult, MarineWeatherContextType } from "@/types";
import { REPEATING_COORDINATES } from "@/constants/repeatingCoordinates";

const MarineWeatherContext = createContext<MarineWeatherContextType>({
    marineWeather: [],
    timestamp: new Date(0),
    loadingMarineWeather: true,
});

export function MarineWeatherProvider({ children }: { children: React.ReactNode }) {
    const [marineWeather, setMarineWeather] = useState<MarineWeatherResult[]>([]);
    const [loadingMarineWeather, setLoadingMarineWeather] = useState(true);

    useEffect(() => {
        async function fetchMarineWeatherGeneral() {
            setLoadingMarineWeather(true);
            console.log("Fetching marine weather data...");
            const results: MarineWeatherResult[] = [];
            try {
                // Fetch marine weather for each coordinate using the API
                for (const { lat, lon } of REPEATING_COORDINATES) {
                    // eslint-disable-next-line no-await-in-loop
                    const response = await fetch(`/api/marine-weather?lat=${lat}&lon=${lon}`);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch marine weather for lat=${lat}, lon=${lon}`);
                    }
                    const weather: MarineWeatherResult = await response.json();
                    results.push(weather);
                }
                setMarineWeather(results);
                console.log("Fetched a number of marine weather points:", results.length);
            } catch (error) {
                console.error("Error fetching marine weather data:", error);
            }
            setLoadingMarineWeather(false);
        }
        fetchMarineWeatherGeneral();
    }, []);

    return (
        <MarineWeatherContext.Provider value={{ marineWeather, timestamp: new Date(), loadingMarineWeather }}>
            {children}
        </MarineWeatherContext.Provider>
    );
}

export function useMarineWeather() {
    return useContext(MarineWeatherContext);
}
