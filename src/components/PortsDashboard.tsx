"use client";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import LoadingOverlay from "./LoadingOverlay";

type Port = {
    name: string;
    lat: number;
    lon: number;
    [key: string]: any;
};

type CityWeatherResult = {
    now: Record<string, any>;
    tomorrow: Record<string, any>;
    week: Record<string, any>;
};

type CityAlerts = {
    localtime: string;
    alerts: {
        headline: string;
        severity: string;
        urgency: string;
        certainty: string;
        event: string;
        desc: string;
        effective: string;
        expires: string;
    }[];
};

type Props = {
    port: Port | null;
    portWeather: CityWeatherResult | null;
    weatherMode: "now" | "tomorrow" | "week";
    setWeatherMode: (mode: "now" | "tomorrow" | "week") => void;
    cityAlerts: CityAlerts | null;
    loading: boolean;
};

const WEATHER_MODES = [
    { key: "now", label: "Current" },
    { key: "tomorrow", label: "Tomorrow" },
    { key: "week", label: "Next week" },
];

function WeatherDisplay({ weather }: { weather: Record<string, any> }) {
    if (!weather) return <div className="text-zinc-400">No weather data available.</div>;

    const units: Record<string, string> = {
        visibility: "m",
        surface_pressure: "hPa",
        temperature_2m: "°C",
        precipitation: "mm",
        weathercode: "wmo code",
        wind_speed_10m: "km/h",
        wind_gusts_10m: "km/h",
        wind_direction_10m: "°",
        snowfall: "cm",
        snow_depth: "m",
        temperature_2m_max: "°C",
        temperature_2m_min: "°C",
        precipitation_probability_max: "%",
        wind_speed_10m_max: "km/h",
        wind_gusts_10m_max: "km/h",
        wind_direction_10m_dominant: "°",
        snowfall_sum: "cm",
        snow_depth_max: "m",
    };

    return (
        <div className="space-y-2">
            {Object.entries(weather).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b border-zinc-800 pb-1">
                    <span className="capitalize text-zinc-300">{key.replace(/_/g, " ")}:</span>
                    <span className="text-white font-semibold">
                        {value !== undefined && value !== null ? value : "N/A"}
                        {units[key] ? ` ${units[key]}` : ""}
                    </span>
                </div>
            ))}
        </div>
    );
}

export function PortsDashboard(props: Props) {
    const { port, portWeather, weatherMode, setWeatherMode, cityAlerts, loading } = props;

    const [alertIdx, setAlertIdx] = useState(0);

    // Reset alert index when port changes
    useEffect(() => {
        setAlertIdx(0);
    }, [port]);

    // Get current alert from cityAlerts.alerts array
    const alertsArray = cityAlerts?.alerts ?? [];
    const currentAlert = alertsArray[alertIdx];

    return (
        <div className="flex-1 flex flex-col h-full min-h-0 bg-zinc-900 border-r border-zinc-800 p-8">
            {port ? (
                <div className="flex-1 flex flex-col w-full h-full min-h-0">
                    <div className="flex justify-between items-center gap-6 mb-6">
                        <span className="font-bold text-4xl text-white">{port.name}</span>
                        <div className="flex gap-6">
                            {WEATHER_MODES.map((mode) => (
                                <button
                                    key={mode.key}
                                    className={`bg-transparent border-none outline-none px-0 py-0 text-lg font-semibold cursor-pointer
                                            ${
                                                weatherMode === mode.key
                                                    ? "text-yellow-400 underline underline-offset-4"
                                                    : "text-white hover:text-yellow-400 hover:underline hover:underline-offset-4"
                                            }`}
                                    style={{
                                        transition: "color 0.2s, text-decoration-color 0.2s",
                                        textDecorationColor: weatherMode === mode.key ? "#FFD56B" : undefined,
                                    }}
                                    onClick={() => setWeatherMode(mode.key as "now" | "tomorrow" | "week")}
                                >
                                    {mode.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading && (
                        <div className="flex-1">
                            <LoadingOverlay className="relative" />
                        </div>
                    )}

                    {!loading && (
                        <div className="flex-1 flex flex-col h-full min-h-0">
                            {!portWeather && (
                                <div className="text-white">
                                    No weather data available at the moment. Try again later.
                                </div>
                            )}
                            {portWeather && (
                                <div className="flex-1 h-full min-h-0 mb-8">
                                    <WeatherDisplay weather={portWeather[weatherMode]} />
                                </div>
                            )}
                            <div className="flex-1 flex flex-col h-full min-h-0 justify-start mt-24">
                                <div className="mb-2 font-semibold text-lg text-white text-center flex items-center justify-center gap-4">
                                    <button
                                        className={`text-2xl px-2 py-1 rounded ${
                                            alertIdx > 0
                                                ? "text-yellow-400 hover:bg-zinc-800 cursor-pointer"
                                                : "text-zinc-700 cursor-not-allowed"
                                        }`}
                                        onClick={() => alertIdx > 0 && setAlertIdx(alertIdx - 1)}
                                        disabled={alertIdx === 0}
                                        aria-label="Previous alert"
                                        style={{ cursor: alertIdx > 0 ? "pointer" : "not-allowed" }}
                                    >
                                        &#8592;
                                    </button>
                                    <span>
                                        Weather Alerts for {port?.name}
                                        {cityAlerts?.localtime ? (
                                            <span className="ml-2 text-zinc-400 text-base">
                                                ({cityAlerts.localtime})
                                            </span>
                                        ) : null}
                                    </span>
                                    <button
                                        className={`text-2xl px-2 py-1 rounded ${
                                            alertsArray && alertIdx < alertsArray.length - 1
                                                ? "text-yellow-400 hover:bg-zinc-800 cursor-pointer"
                                                : "text-zinc-700 cursor-not-allowed"
                                        }`}
                                        onClick={() =>
                                            alertsArray &&
                                            alertIdx < alertsArray.length - 1 &&
                                            setAlertIdx(alertIdx + 1)
                                        }
                                        disabled={!alertsArray || alertIdx >= alertsArray.length - 1}
                                        aria-label="Next alert"
                                        style={{
                                            cursor:
                                                alertsArray && alertIdx < alertsArray.length - 1
                                                    ? "pointer"
                                                    : "not-allowed",
                                        }}
                                    >
                                        &#8594;
                                    </button>
                                </div>
                                <div
                                    className="bg-zinc-900 rounded shadow p-4 text-base border border-zinc-700 justify-center overflow-y-auto"
                                    style={{ height: "100%", scrollbarWidth: "thin" }}
                                >
                                    {alertsArray.length === 0 && (
                                        <div className="flex h-full w-full items-center justify-center text-zinc-500 italic">
                                            No alerts
                                        </div>
                                    )}
                                    {currentAlert && (
                                        <>
                                            <div className="font-semibold text-white mb-2">{currentAlert.headline}</div>
                                            <div className="text-zinc-200 mb-1">
                                                Severity: {currentAlert.severity} | Urgency: {currentAlert.urgency} |
                                                Certainty: {currentAlert.certainty} | Event: {currentAlert.event}
                                            </div>
                                            <div className="text-zinc-300 mb-1">{currentAlert.desc}</div>
                                            <div className="text-zinc-400 text-sm">
                                                Effective: {currentAlert.effective} | Expires: {currentAlert.expires}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex items-center justify-center h-full text-zinc-400 text-lg">
                    Click a port to see weather info.
                </div>
            )}
        </div>
    );
}
