"use client";

import React, { useState, useEffect } from "react";
import OverlayLoading from "./OverlayLoading";
import { AlertsResponse } from "@/types/alerts";
import { useRouter } from "next/navigation";
import { cityPortList } from "@/constants";

type NumberCityAlertsProps = {
    lat: number | null;
    lon: number | null;
};

export default function NumberCityAlerts({ lat, lon }: NumberCityAlertsProps) {
    const [alerts, setAlerts] = useState<number | "Submit destination">("Submit destination");
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    useEffect(() => {
        async function fetchCityAlerts() {
            if (lat === null || lon === null) return;

            setLoading(true);
            try {
                const res = await fetch(`/api/city-alerts?lat=${lat}&lon=${lon}`);
                if (res.ok) {
                    const data: AlertsResponse = await res.json();
                    setAlerts(data.alerts.length);
                } else {
                    setAlerts(0);
                }
            } catch (error) {
                console.error("Error fetching city alerts:", error);
                setAlerts(0);
            } finally {
                setLoading(false);
            }
        }

        fetchCityAlerts();
    }, [lat, lon]);

    const dotColor =
        alerts === 0
            ? "bg-blue-500"
            : alerts === 1
            ? "bg-yellow-500"
            : alerts !== "Submit destination"
            ? "bg-red-500"
            : "bg-transparent";

    let port = cityPortList.find((port) => port.lat === lat && port.lon === lon);

    return (
        <button
            onClick={() => router.push(`/ports/${port?.name.toLowerCase() || ""}`)}
            className="flex flex-col justify-between p-4 sm:p-6 bg-black text-white rounded-lg shadow-lg hover:bg-zinc-800 transition cursor-pointer text-left min-w-50"
        >
            <h1 className="text-md sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4">
                Destination
                <br />
                Alerts
            </h1>
            {loading ? (
                <OverlayLoading />
            ) : (
                <div className="flex flex-row items-center justify-between gap-2">
                    {alerts === "Submit destination" ? (
                        <>
                            <p className="text-xs sm:text-sm text-gray-400 truncate">{alerts}</p>
                            <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${dotColor}`} />
                        </>
                    ) : (
                        <>
                            <p className="text-2xl sm:text-3xl lg:text-4xl">{alerts}</p>
                            <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${dotColor}`} />
                        </>
                    )}
                </div>
            )}
        </button>
    );
}
