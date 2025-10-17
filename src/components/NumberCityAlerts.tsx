"use client";

import React, { useState, useEffect } from "react";
import { getCityAlerts } from "@/utils/getCityAlerts";
import LoadingOverlay from "./LoadingOverlay";

type NumberCityAlertsProps = {
    lat: number | null;
    lon: number | null;
};

export default function NumberCityAlerts({ lat, lon }: NumberCityAlertsProps) {
    const [alerts, setAlerts] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function fetchCityAlerts() {
            if (lat === null || lon === null) return;

            setLoading(true);
            const result = await getCityAlerts(lat, lon);
            setAlerts(result.alerts.length);
            setLoading(false);
        }

        fetchCityAlerts();
    }, [lat, lon]);

    const dotColor =
        alerts === 0
            ? "bg-blue-500" // Blue for 0 alerts
            : alerts === 1
            ? "bg-yellow-500" // Yellow for 1 alert
            : "bg-red-500"; // Red for more than 1 alert

    return (
        <div className="flex flex-col flex-1 p-6 justify-between bg-black text-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-semibold mb-4">
                City
                <br />
                Alerts
            </h1>
            {loading ? (
                <LoadingOverlay />
            ) : (
                <div className="flex flex-row items-center justify-between">
                    <p className="text-4xl">{alerts}</p>
                    <div className={`w-3 h-3 rounded-full ${dotColor}`} />
                </div>
            )}
        </div>
    );
}
