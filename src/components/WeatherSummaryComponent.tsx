"use client";

import React, { useEffect, useState } from "react";
import LoadingOverlay from "./LoadingOverlay";
import { getAtlanticAlerts, AtlanticAlert } from "@/utils/getAtlanticAlerts";

type WeatherSummaryProps = {
    marineWeather: any[];
    loading?: boolean;
};

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

const units: Record<string, string> = {
    wind_speed_10m: "km/h",
    wind_direction_10m: "°",
    wave_height: "m",
    wave_direction: "°",
    wave_period: "s",
    wind_wave_height: "m",
    wind_wave_direction: "°",
    wind_wave_period: "s",
    swell_wave_height: "m",
    swell_wave_direction: "°",
    swell_wave_period: "s",
    ocean_current_velocity: "km/h",
    ocean_current_direction: "°",
};

export default function WeatherSummaryComponent({ marineWeather, loading }: WeatherSummaryProps) {
    const [averages, setAverages] = useState<Record<string, number | null> | null>(null);
    const [loadingAverages, setLoadingAverages] = useState<boolean>(true);

    const [atlanticAlerts, setAtlanticAlerts] = useState<AtlanticAlert[]>([]);
    const [alertIdx, setAlertIdx] = useState<number>(0);

    // Fetch Atlantic alerts
    useEffect(() => {
        async function fetchAlerts() {
            const alerts = await getAtlanticAlerts();
            setAtlanticAlerts(alerts);
        }
        fetchAlerts();
    }, []);

    // Calculate averages for marine weather features
    useEffect(() => {
        if (!loading && marineWeather.length > 0) {
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
            setLoadingAverages(false);
        } else if (marineWeather.length === 0) {
            setAverages(null);
        }
    }, [loading, marineWeather]);

    const currentAlert = atlanticAlerts[alertIdx];

    return (
        <div className="flex flex-col flex-1 w-full h-full min-h-0">
            <div>
                <h1 className="text-4xl font-bold text-white mb-4">Weather Summary</h1>
            </div>

            {loadingAverages ? (
                <div className="flex-1">
                    <LoadingOverlay className="relative" />
                </div>
            ) : (
                <div className="flex-1 h-full space-y-2 text-sm">
                    {averages &&
                        marineFeatureNames.map((name) => (
                            <div key={name} className="flex justify-between border-b border-zinc-600 pb-1">
                                <span className="capitalize text-zinc-300">{name.replace(/_/g, " ")}:</span>
                                <span className="text-white font-semibold">
                                    {averages[name] !== null && averages[name] !== undefined
                                        ? `${averages[name]?.toFixed(2)} ${units[name] || ""}`
                                        : "N/A"}
                                </span>
                            </div>
                        ))}
                </div>
            )}

            {/* Atlantic Alerts Section */}
            <div className="mt-8">
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
                    <span>Atlantic Alerts</span>
                    <button
                        className={`text-2xl px-2 py-1 rounded ${
                            atlanticAlerts && alertIdx < atlanticAlerts.length - 1
                                ? "text-yellow-400 hover:bg-zinc-800 cursor-pointer"
                                : "text-zinc-700 cursor-not-allowed"
                        }`}
                        onClick={() =>
                            atlanticAlerts && alertIdx < atlanticAlerts.length - 1 && setAlertIdx(alertIdx + 1)
                        }
                        disabled={!atlanticAlerts || alertIdx >= atlanticAlerts.length - 1}
                        aria-label="Next alert"
                        style={{
                            cursor: atlanticAlerts && alertIdx < atlanticAlerts.length - 1 ? "pointer" : "not-allowed",
                        }}
                    >
                        &#8594;
                    </button>
                </div>
                <div
                    className="bg-zinc-900 rounded shadow p-4 text-base border border-zinc-700 justify-center overflow-y-auto"
                    style={{ height: "200px", scrollbarWidth: "thin" }}
                >
                    {atlanticAlerts.length === 0 && (
                        <div className="flex h-full w-full items-center justify-center text-zinc-500 italic">
                            No alerts
                        </div>
                    )}
                    {currentAlert && (
                        <>
                            <div className="font-semibold text-white mb-2">{currentAlert.headline}</div>
                            <div className="text-zinc-200 mb-1">
                                Severity: {currentAlert.severity} | Urgency: {currentAlert.urgency} | Certainty:{" "}
                                {currentAlert.certainty} | Event: {currentAlert.event}
                            </div>
                            <div className="text-zinc-300 mb-1">{currentAlert.description}</div>
                            <div className="text-zinc-400 text-sm">
                                Effective: {currentAlert.effective} | Expires: {currentAlert.expires}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
