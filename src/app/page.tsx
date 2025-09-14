"use client";
import { useEffect, useState } from "react";
import { useMarineWeather } from "@/providers/MarineWeatherProvider";
import { averageMarineWeather } from "@/utils/averageMarineWeather";
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
    const { marineWeather, timestamp, loading } = useMarineWeather();

    const [prediction, setPrediction] = useState<number | null>(null);
    const [loadingPrediction, setLoadingPrediction] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [averages, setAverages] = useState<any>(null);
    const [stormFeatures, setStormFeatures] = useState<{ maxStormWind: number }>({ maxStormWind: 0 });

    useEffect(() => {
        async function loadPrediction() {
            setLoadingPrediction(true);
            setError(null);

            try {
                const averages = averageMarineWeather(marineWeather);
                setAverages(averages);

                // Get storm max wind
                const stormsRes = await fetch("/api/storms");
                const stormsData = await stormsRes.json();
                let maxStormWind = 0;
                if (Array.isArray(stormsData)) {
                    const winds = stormsData.map((s: any) => s.intensity || 0);
                    maxStormWind = winds.length > 0 ? Math.max(...winds) : 0;
                } else if (stormsData && stormsData.intensity) {
                    maxStormWind = stormsData.intensity;
                }
                setStormFeatures({ maxStormWind });

                const input = {
                    max_storm_wind_300nm_24hr: maxStormWind,
                    avg_wave_height: averages.wave_height ?? 0,
                    avg_wave_direction: averages.wave_direction ?? 0,
                    avg_wave_period: averages.wave_period ?? 0,
                    avg_wind_wave_height: averages.wind_wave_height ?? 0,
                    avg_wind_wave_direction: averages.wind_wave_direction ?? 0,
                    avg_wind_wave_period: averages.wind_wave_period ?? 0,
                    avg_swell_wave_height: averages.swell_wave_height ?? 0,
                    avg_swell_wave_direction: averages.swell_wave_direction ?? 0,
                    avg_swell_wave_period: averages.swell_wave_period ?? 0,
                    avg_ocean_current_velocity: averages.ocean_current_velocity ?? 0,
                    avg_ocean_current_direction: averages.ocean_current_direction ?? 0,
                    avg_wind_speed_10m: averages.wind_speed_10m ?? 0,
                    avg_wind_direction_10m: averages.wind_direction_10m ?? 0,
                };

                const predRes = await fetch("/api/delay-prediction", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(input),
                });
                const predData = await predRes.json();

                if (predData.error) {
                    setError(predData.error);
                    setPrediction(null);
                } else {
                    setPrediction(predData.delay);
                }
            } catch (e: any) {
                setError("Failed to get prediction");
                setPrediction(null);
            } finally {
                setLoadingPrediction(false);
            }
        }
        if (!loading && marineWeather.length > 0) {
            loadPrediction();
        }
    }, [loading, marineWeather]);

    return (
        <div
            className="flex flex-row w-full min-h-0 box-border overflow-hidden bg-zinc-900"
            style={{ height: "calc(100vh - 64px)" }}
        >
            <div className="flex-1 flex flex-col h-full min-h-0 justify-center items-center ">
                <div className="flex flex-col items-start pt-12 pb-8">
                    <h2 className="text-8xl font-extrabold mb-6 text-left text-white">Delay time</h2>
                    <div className="text-[7rem] font-extrabold text-yellow-400 leading-none min-h-[7rem] flex items-center relative">
                        {loadingPrediction || loading ? (
                            <div className="flex-1">
                                <LoadingOverlay className="relative" />
                            </div>
                        ) : prediction !== null ? (
                            `${prediction.toFixed(2)} h`
                        ) : (
                            <span className="text-red-400">—</span>
                        )}
                    </div>
                    {error && <div className="text-red-400 text-2xl text-left mt-4">{error}</div>}
                </div>
                {/* Second row: takes remaining space */}
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-2xl text-zinc-400 text-center"></div>
                </div>
            </div>
            {/* Right column: Marine & Storm Features */}
            <div className="flex-1 flex flex-col h-full min-h-0 p-8">
                <div className="w-full h-full flex flex-col">
                    <div className="flex items-center mb-6 gap-8">
                        <span className="font-bold text-4xl text-white">Marine & Storm Features</span>
                    </div>

                    {loading && (
                        <div className="flex-1">
                            <LoadingOverlay className="relative" />
                        </div>
                    )}

                    {!loading && (
                        <>
                            <div className="space-y-3 text-xl">
                                <div className="flex justify-between border-b border-zinc-800 pb-1">
                                    <span className="capitalize text-zinc-300">max storm wind 300nm:</span>{" "}
                                    <span className="text-white font-semibold">
                                        {stormFeatures.maxStormWind ?? "—"}
                                    </span>
                                </div>
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
