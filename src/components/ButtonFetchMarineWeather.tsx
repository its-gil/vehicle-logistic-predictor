"use client";

import React from "react";
import { RefreshCcw } from "lucide-react";
import { useMarineWeather } from "@/providers/MarineWeatherProvider";

export default function ButtonFetchMarineWeather() {
    const { refetchMarineWeather, isRefreshing } = useMarineWeather();

    const handleRefresh = async () => {
        await refetchMarineWeather();
    };

    return (
        <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="absolute top-3 right-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 px-4 py-2 rounded shadow-lg text-xs opacity-90 z-[2100] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            style={{ pointerEvents: "auto" }}
        >
            <RefreshCcw className={isRefreshing ? "text-yellow-400 animate-spin" : ""} />
        </button>
    );
}
