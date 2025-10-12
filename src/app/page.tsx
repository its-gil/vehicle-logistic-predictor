"use client";
import { useEffect, useState } from "react";
import { useMarineWeather } from "@/providers/MarineWeatherProvider";
import LoadingOverlay from "@/components/LoadingOverlay";

const marineFeatureNames = [
    "wind_speed_10m",
    "wind_direction_10m",
    "wave_height",
    "wave_direction",
    "wave_period",
    "wind_wave_height",
    "wind_wave_direction",
    "wind_wave_period",
    "swell_wave_height",
    "swell_wave_direction",
    "swell_wave_period",
    "ocean_current_velocity",
    "ocean_current_direction",
];

export default function Home() {
    const { marineWeather, loading } = useMarineWeather();

    const [averages, setAverages] = useState<any>(null);

    useEffect(() => {
        if (!loading && marineWeather.length > 0) {
            // Calculate averages for marine weather features
            const calculatedAverages: Record<string, number | null> = {};
            marineFeatureNames.forEach((feature) => {
                const values = marineWeather
                    .map((data: any) => data[feature])
                    .filter((value: any) => value !== null && value !== undefined);
                const average =
                    values.length > 0
                        ? values.reduce((sum: number, value: number) => sum + value, 0) / values.length
                        : null;
                calculatedAverages[feature] = average;
            });
            setAverages(calculatedAverages);
        }
    }, [loading, marineWeather]);

    return (
        <div
            className="flex flex-row w-full min-h-0 box-border overflow-hidden bg-zinc-900"
            style={{ height: "calc(100vh - 64px)" }}
        >
            <div className="flex-1 flex flex-col h-full min-h-0 justify-center items-center">
                <div className="flex flex-col items-start pt-12 pb-8">
                    <h2 className="text-8xl font-extrabold mb-6 text-left text-white">Marine Weather Averages</h2>
                </div>
                {loading ? (
                    <LoadingOverlay className="relative" />
                ) : (
                    <div className="space-y-3 text-xl">
                        {averages &&
                            marineFeatureNames.map((name) => (
                                <div key={name} className="flex justify-between border-b border-zinc-800 pb-1">
                                    <span className="capitalize text-zinc-300">{name.replace(/_/g, " ")}:</span>
                                    <span className="text-white font-semibold">
                                        {averages[name] !== null && averages[name] !== undefined
                                            ? averages[name].toFixed(2)
                                            : "N/A"}
                                    </span>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}
