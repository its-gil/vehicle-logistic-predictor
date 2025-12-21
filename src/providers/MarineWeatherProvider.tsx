import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { MarineWeatherResult, MarineWeatherContextType } from "@/types";

const MarineWeatherContext = createContext<MarineWeatherContextType>({
    marineWeather: [],
    timestamp: new Date(0),
    loadingMarineWeather: true,
    refetchMarineWeather: async () => {},
    isRefreshing: false,
});

export function MarineWeatherProvider({ children }: { children: React.ReactNode }) {
    const [marineWeather, setMarineWeather] = useState<MarineWeatherResult[]>([]);
    const [timestamp, setTimestamp] = useState<Date>(new Date(0));
    const [loadingMarineWeather, setLoadingMarineWeather] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchMarineWeatherGeneral = useCallback(async (forceRefresh = false) => {
        if (forceRefresh) {
            setIsRefreshing(true);
        } else {
            setLoadingMarineWeather(true);
        }

        try {
            const url = forceRefresh ? `/api/marine-weather?force=true` : `/api/marine-weather`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch marine weather");
            }
            const data = await response.json();

            setMarineWeather(data.results);
            setTimestamp(new Date(data.timestamp));
            console.log("Loaded marine weather points:", data.results.length);
            console.log("Timestamp:", data.timestamp);
        } catch (error) {
            console.error("Error fetching marine weather data:", error);
            setMarineWeather([]);
            setTimestamp(new Date(0));
        } finally {
            if (forceRefresh) {
                setIsRefreshing(false);
            } else {
                setLoadingMarineWeather(false);
            }
        }
    }, []);

    const refetchMarineWeather = useCallback(async () => {
        await fetchMarineWeatherGeneral(true);
    }, [fetchMarineWeatherGeneral]);

    useEffect(() => {
        fetchMarineWeatherGeneral(false);
    }, [fetchMarineWeatherGeneral]);

    return (
        <MarineWeatherContext.Provider
            value={{ marineWeather, timestamp, loadingMarineWeather, refetchMarineWeather, isRefreshing }}
        >
            {children}
        </MarineWeatherContext.Provider>
    );
}

export function useMarineWeather() {
    return useContext(MarineWeatherContext);
}
