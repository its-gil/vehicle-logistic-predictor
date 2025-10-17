"use client";

import React, { useEffect, useState } from "react";
import { getAtlanticAlerts, AtlanticAlert } from "@/utils/getAtlanticAlerts";
import LoadingOverlay from "./LoadingOverlay";

export default function NumberOceanAlerts() {
    const [alerts, setAlerts] = useState<AtlanticAlert[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchAlerts() {
            setLoading(true);
            const fetchedAlerts = await getAtlanticAlerts();
            setAlerts(fetchedAlerts);
            setLoading(false);
        }

        fetchAlerts();
    }, []);

    // Determine the dot color based on the number of storms
    const dotColor =
        alerts.length === 0
            ? "bg-blue-500" // Blue for 0 alerts
            : alerts.length === 1
            ? "bg-yellow-500" // Yellow for 1 alert
            : "bg-red-500"; // Red for more than 1 alert

    return (
        <div className="flex flex-col flex-1 justify-between p-6 bg-zinc-900 text-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-semibold mb-4">Ocean Alerts</h1>
            {loading ? (
                <LoadingOverlay />
            ) : (
                <div className="flex flex-row items-center justify-between">
                    <p className="text-4xl">{alerts.length}</p>
                    <div className={`w-3 h-3 rounded-full ${dotColor}`} />
                </div>
            )}
        </div>
    );
}
