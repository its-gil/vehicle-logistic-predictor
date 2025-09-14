"use client";
import dynamic from "next/dynamic";
import { useMarineWeather } from "@/providers/MarineWeatherProvider";

const MarineWeatherMap = dynamic(() => import("@/components/MarineWeatherMap").then((mod) => mod.MarineWeatherMap), {
    ssr: false,
});

export default function MarineWeatherPage() {
    const { marineWeather, timestamp, loading } = useMarineWeather();

    return (
        <div className="w-full h-screen min-h-0" style={{ height: "calc(100vh - 64px)" }}>
            <MarineWeatherMap data={marineWeather} timestamp={timestamp} loading={loading} />
        </div>
    );
}
