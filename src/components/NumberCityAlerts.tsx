"use client";

import React, { useState, useEffect } from "react";
import OverlayLoading from "./OverlayLoading";
import { CityAlertResult } from "@/utils/getCityAlerts";
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
                    const data: CityAlertResult = await res.json();
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
            className="flex flex-col flex-1 justify-between p-6 bg-black text-white rounded-lg shadow-lg hover:bg-zinc-800 transition cursor-pointer text-left"
        >
            <h1 className="text-2xl font-semibold mb-4">
                Destination
                <br />
                Alerts
            </h1>
            {loading ? (
                <OverlayLoading />
            ) : (
                <div className="flex flex-row items-center justify-between">
                    {alerts === "Submit destination" ? (
                        <>
                            <p className="text-sm text-gray-400">{alerts}</p>
                            <div className={`w-3 h-3 rounded-full ${dotColor}`} />
                        </>
                    ) : (
                        <>
                            <p className="text-4xl">{alerts}</p>
                            <div className={`w-3 h-3 rounded-full ${dotColor}`} />
                        </>
                    )}
                </div>
            )}
        </button>
    );
}
