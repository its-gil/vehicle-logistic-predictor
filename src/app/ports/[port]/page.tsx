"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CityWeatherResult, DashboardMode, Port } from "@/types/ports";
import CityWeatherComponent from "@/components/CityWeatherComponent";
import FilterAlertsWeather from "@/components/FilterAlertsWeather";
import { AlertsResponse } from "@/types";
import AlertsComponent from "@/components/AlertsComponent";

export default function PortPage() {
    const params = useParams<{ port: string }>();

    let portName = typeof params?.port === "string" ? params.port.toLowerCase() : "";

    const [port, setPort] = useState<Port | null>(null);
    const [portLoading, setPortLoading] = useState(true);
    const [portWeather, setPortWeather] = useState<CityWeatherResult | null>(null);
    const [weatherLoading, setWeatherLoading] = useState(true);
    const [cityAlerts, setCityAlerts] = useState<AlertsResponse | null>(null);
    const [alertsLoading, setAlertsLoading] = useState(true);
    const [loading, setLoading] = useState(true);

    const [portsDashboardMode, setPortsDashboardMode] = useState<DashboardMode>("alerts");

    useEffect(() => {
        async function fetchPortData() {
            setPortLoading(true);
            try {
                const response = await fetch(`/api/port/${portName}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch port data");
                }
                const data = await response.json();
                setPort(data);
            } catch (error) {
                console.error("Error fetching port data:", error);
            } finally {
                setPortLoading(false);
            }
        }

        if (portName) {
            fetchPortData();
        }
    }, [portName]);

    useEffect(() => {
        if (!port) {
            setCityAlerts(null);
            setAlertsLoading(false);
            return;
        }
        setAlertsLoading(true);
        fetch(`/api/city-alerts?lat=${port.lat}&lon=${port.lon}`)
            .then((res) => res.json())
            .then((data: AlertsResponse) => {
                setCityAlerts(data);
            })
            .finally(() => setAlertsLoading(false));
    }, [port]);

    useEffect(() => {
        if (!port) {
            setPortWeather(null);
            return;
        }
        setWeatherLoading(true);
        fetch(`/api/city-weather?lat=${port.lat}&lon=${port.lon}`)
            .then((res) => res.json())
            .then((data) => {
                setPortWeather(data);
            })
            .finally(() => setWeatherLoading(false));
    }, [port]);

    useEffect(() => {
        if (portLoading || alertsLoading || weatherLoading) {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [portLoading, alertsLoading, weatherLoading]);

    return (
        <>
            {!loading && !port && (
                <div className="flex items-center justify-center h-full text-zinc-400 text-lg">
                    Your selected port was not found.
                </div>
            )}
            <div className="flex justify-between">
                <span className="font-bold text-4xl text-white">{port?.name ?? ""}</span>
                <FilterAlertsWeather mode={portsDashboardMode} setMode={setPortsDashboardMode} />
            </div>
            {portsDashboardMode === "alerts" && (
                <AlertsComponent
                    localtime={cityAlerts?.localtime ?? ""}
                    alerts={cityAlerts?.alerts ?? []}
                    loading={loading}
                />
            )}
            {portsDashboardMode === "weather" && (
                <>
                    <CityWeatherComponent port={port} portWeather={portWeather} loading={loading} />
                </>
            )}
        </>
    );
}
