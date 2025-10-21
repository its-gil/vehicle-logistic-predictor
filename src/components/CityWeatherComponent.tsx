import { useEffect, useState } from "react";
import { WEATHER_MODES, portsWeatherUnits } from "@/constants";
import { WeatherModeKey, PortConditions, CityWeatherResult } from "@/types";
import OverlayLoading from "./OverlayLoading";

export default function CityWeatherComponent(props: PortConditions) {
    const { portWeather, loading } = props;

    const [weatherMode, setWeatherMode] = useState<{ key: WeatherModeKey; label: string }>(WEATHER_MODES[0]);

    return (
        <div className="flex-1 flex flex-col w-full h-full min-h-0 overflow-y-auto">
            <div className="flex items-center gap-6 my-6">
                <div className="flex gap-6">
                    {WEATHER_MODES.map((mode) => (
                        <button
                            key={mode.key}
                            className={`bg-transparent border-none outline-none px-0 py-0 text-lg font-semibold cursor-pointer
                                                ${
                                                    weatherMode.key === mode.key
                                                        ? "text-yellow-400 underline underline-offset-4"
                                                        : "text-white hover:text-yellow-400 hover:underline hover:underline-offset-4"
                                                }`}
                            style={{
                                transition: "color 0.2s, text-decoration-color 0.2s",
                                textDecorationColor: weatherMode.key === mode.key ? "#FFD56B" : undefined,
                            }}
                            onClick={() => setWeatherMode(mode as (typeof WEATHER_MODES)[number])}
                        >
                            {mode.label}
                        </button>
                    ))}
                </div>
            </div>

            {loading && (
                <div className="flex-1">
                    <OverlayLoading className="relative" />
                </div>
            )}

            {!loading && (
                <div className="flex-1 flex flex-col h-full min-h-0">
                    {!portWeather && (
                        <div className="text-white">No weather data available at the moment. Try again later.</div>
                    )}
                    {portWeather && (
                        <div className="flex-1 h-full min-h-0 mb-8">
                            <div className="space-y-2">
                                {Object.entries(portWeather[weatherMode.key]).map(([key, value]) => (
                                    <div key={key} className="flex justify-between border-b border-zinc-800 pb-1">
                                        <span className="capitalize text-zinc-300">{key.replace(/_/g, " ")}:</span>
                                        <span className="text-white font-semibold">
                                            {value !== undefined && value !== null ? value : "N/A"}
                                            {portsWeatherUnits[key] ? ` ${portsWeatherUnits[key]}` : ""}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
