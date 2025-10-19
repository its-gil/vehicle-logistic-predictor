"use client";
import dynamic from "next/dynamic";
import { useMarineWeather } from "@/providers/MarineWeatherProvider";
import WeatherSummaryComponent from "@/components/SummaryWeatherComponents";
import { viewLegends } from "@/constants";

const MapMarineWeather = dynamic(() => import("@/components/MapMarineWeather").then((mod) => mod.MapMarineWeather), {
    ssr: false,
});

export default function MarineWeatherPage() {
    const { marineWeather, timestamp, loadingMarineWeather } = useMarineWeather();

    return (
        <div
            className="flex flex-row w-full min-h-0 box-border overflow-hidden"
            style={{ height: "calc(100vh - 64px)" }}
        >
            <div
                className="w-1/3 bg-zinc-900 border-r border-zinc-800 p-8 overflow-y-auto"
                style={{ height: "100%", scrollbarWidth: "thin" }}
            >
                <WeatherSummaryComponent marineWeather={marineWeather} loading={loadingMarineWeather} />
            </div>
            <div className="w-2/3 flex-1 flex flex-col h-full min-h-0 justify-center items-center bg-black">
                <MapMarineWeather
                    marineWeather={marineWeather}
                    legend={viewLegends.storms}
                    timestamp={timestamp}
                    loading={loadingMarineWeather}
                />
            </div>
        </div>
    );
}
