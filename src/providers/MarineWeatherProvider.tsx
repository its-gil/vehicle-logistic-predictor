import React, { createContext, useContext, useEffect, useState } from "react";
import { getMarineWeather } from "@/utils/getMarineWeather";
import { MarineWeatherResult, MarineWeatherContextType } from "@/types";

const MarineWeatherContext = createContext<MarineWeatherContextType>({
    marineWeather: [],
    timestamp: "",
    loadingMarineWeather: true,
});

export function MarineWeatherProvider({ children }: { children: React.ReactNode }) {
    const [marineWeather, setMarineWeather] = useState<MarineWeatherResult[]>([]);
    const [loadingMarineWeather, setLoadingMarineWeather] = useState(true);

    useEffect(() => {
        async function fetchMarineWeatherGeneral() {
            setLoadingMarineWeather(true);
            try {
                const res = await fetch("/api/repeating-coordinates");
                const data = await res.json();

                if (data.coordinates) {
                    const results: MarineWeatherResult[] = [];

                    // Fetch marine weather for each coordinate
                    for (const { lat, lon } of data.coordinates) {
                        // eslint-disable-next-line no-await-in-loop
                        const weather = await getMarineWeather(lat, lon);
                        if (weather) {
                            results.push(weather);
                        }
                    }

                    setMarineWeather(results);
                }
            } catch (error) {
                console.error("Error fetching marine weather data:", error);
            }
            setLoadingMarineWeather(false);
        }

        fetchMarineWeatherGeneral();
    }, []);

    return (
        <MarineWeatherContext.Provider
            value={{ marineWeather, timestamp: new Date().toISOString(), loadingMarineWeather }}
        >
            {children}
        </MarineWeatherContext.Provider>
    );
}

export function useMarineWeather() {
    return useContext(MarineWeatherContext);
}
