"use client";

import React, { useEffect, useState } from "react";
import { AlertsResponse } from "@/types/alerts";
import OverlayLoading from "./OverlayLoading";
import { useRouter } from "next/navigation";

export default function NumberOceanAlerts() {
    const [alerts, setAlerts] = useState<AlertsResponse["alerts"]>([]); // Use the correct type for alerts
    const [loading, setLoading] = useState<boolean>(true);

    const router = useRouter();

    useEffect(() => {
        async function fetchAlerts() {
            setLoading(true);
            try {
                const res = await fetch("/api/marine-alerts");
                if (!res.ok) throw new Error(`Failed to fetch marine alerts: ${res.status}`);
                const fetchedAlerts: AlertsResponse = await res.json();
                setAlerts(fetchedAlerts.alerts || []);
            } catch (err) {
                console.error("Error fetching marine alerts:", err);
                setAlerts([]);
            } finally {
                setLoading(false);
            }
        }

        fetchAlerts();
    }, []);

    const dotColor =
        alerts.length === 0
            ? "bg-blue-500" // Blue for 0 alerts
            : alerts.length === 1
            ? "bg-yellow-500" // Yellow for 1 alert
            : "bg-red-500"; // Red for more than 1 alert

    return (
        <button
            onClick={() => router.push("/marine_weather")}
            className="flex flex-col flex-1 justify-between p-6 bg-black text-white rounded-lg shadow-lg hover:bg-zinc-800 transition cursor-pointer text-left"
        >
            <h1 className="text-2xl font-semibold mb-4">Ocean Alerts</h1>
            {loading ? (
                <OverlayLoading />
            ) : (
                <div className="flex flex-row items-center justify-between">
                    <p className="text-4xl">{alerts.length}</p>
                    <div className={`w-3 h-3 rounded-full ${dotColor}`} />
                </div>
            )}
        </button>
    );
}
