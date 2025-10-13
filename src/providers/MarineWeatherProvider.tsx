import React, { createContext, useContext, useEffect, useState } from "react";
import { getMarineWeather } from "@/utils/getMarineWeather";
import { MarineWeatherResult, MarineWeatherContextType } from "@/types";

const MarineWeatherContext = createContext<MarineWeatherContextType>({
    marineWeather: [],
    timestamp: "",
    loading: true,
});

export function MarineWeatherProvider({ children }: { children: React.ReactNode }) {
    const [marineWeather, setMarineWeather] = useState<MarineWeatherResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMarineWeatherGeneral() {
            setLoading(true);
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
            setLoading(false);
        }

        fetchMarineWeatherGeneral();
    }, []);

    return (
        <MarineWeatherContext.Provider value={{ marineWeather, timestamp: new Date().toISOString(), loading }}>
            {children}
        </MarineWeatherContext.Provider>
    );
}

export function useMarineWeather() {
    return useContext(MarineWeatherContext);
}
