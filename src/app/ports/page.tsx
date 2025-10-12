"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { cityPortList } from "@/utils/cityPortList";
import { PortsDashboard } from "@/components/PortsDashboard";
import { Port, CityWeatherResult, CityAlerts } from "@/types";

const PortsMap = dynamic(() => import("@/components/PortsMap").then((mod) => mod.PortsMap), { ssr: false });

export default function PortsPage() {
    const [selectedPort, setSelectedPort] = useState<Port | null>(
        cityPortList.find((port) => port.name === "Brunswick") || null
    );
    const [portWeather, setPortWeather] = useState<CityWeatherResult | null>(null);
    const [weatherMode, setWeatherMode] = useState<"now" | "tomorrow" | "week">("now");
    const [weatherLoading, setWeatherLoading] = useState(true);
    const [cityAlerts, setCityAlerts] = useState<CityAlerts | null>(null);
    const [alertsLoading, setAlertsLoading] = useState(true);
    const [overallLoading, setOverallLoading] = useState(true);

    useEffect(() => {
        if (!selectedPort) {
            setPortWeather(null);
            return;
        }
        setWeatherLoading(true);
        fetch(`/api/city-weather?lat=${selectedPort.lat}&lon=${selectedPort.lon}`)
            .then((res) => res.json())
            .then((data) => {
                setPortWeather(data);
                setWeatherMode("now");
            })
            .finally(() => setWeatherLoading(false));
    }, [selectedPort]);

    useEffect(() => {
        if (!selectedPort) {
            setCityAlerts(null);
            setAlertsLoading(false);
            return;
        }
        setAlertsLoading(true);
        fetch(`/api/city-alerts?lat=${selectedPort.lat}&lon=${selectedPort.lon}`)
            .then((res) => res.json())
            .then((data: CityAlerts) => {
                setCityAlerts(data);
            })
            .finally(() => setAlertsLoading(false));
    }, [selectedPort]);

    useEffect(() => {
        if (!alertsLoading && !weatherLoading) {
            setOverallLoading(false);
        } else {
            setOverallLoading(true);
        }
    }, [alertsLoading, weatherLoading]);

    return (
        <div
            className="flex flex-row w-full min-h-0 box-border overflow-hidden"
            style={{ height: "calc(100vh - 64px)" }}
        >
            <PortsDashboard
                port={selectedPort}
                portWeather={portWeather}
                weatherMode={weatherMode}
                setWeatherMode={setWeatherMode}
                cityAlerts={cityAlerts}
                loading={overallLoading}
            />
            <div className="flex-1 flex flex-col h-full min-h-0 justify-center items-center bg-black">
                <PortsMap ports={cityPortList} onPortClick={setSelectedPort} />
            </div>
        </div>
    );
}
