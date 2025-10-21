"use client";
import dynamic from "next/dynamic";
import { useMarineWeather } from "@/providers/MarineWeatherProvider";
import { marineWeatherFeatureNames, viewLegends } from "@/constants";
import { formatTimestamp } from "@/utils/formatTimestamp";
import MarineWeatherComponent from "@/components/MarineWeatherComponent";
import FilterAlertsWeather from "@/components/FilterAlertsWeather";
import { DashboardMode } from "@/types/ports";
import { useEffect, useState } from "react";
import { getAtlanticAlerts } from "@/utils/getAtlanticAlerts";
import { AlertsResponse } from "@/types";
import AlertsComponent from "@/components/AlertsComponent";

const MapMarineWeather = dynamic(() => import("@/components/MapMarineWeather").then((mod) => mod.MapMarineWeather), {
    ssr: false,
});

export default function MarineWeatherPage() {
    const { marineWeather, timestamp, loadingMarineWeather } = useMarineWeather();

    const [marineDashboardMode, setMarineDashboardMode] = useState<DashboardMode>("alerts");

    const [atlanticAlertsResponse, setAtlanticAlertsResponse] = useState<AlertsResponse | null>(null);
    const [loadingAtlanticAlerts, setLoadingAtlanticAlerts] = useState<boolean>(true);
    const [averages, setAverages] = useState<Record<string, number | null> | null>(null);
    const [loadingAverages, setLoadingAverages] = useState<boolean>(true);

    useEffect(() => {
        async function fetchAlerts() {
            const { localtime, alerts } = await getAtlanticAlerts();
            setAtlanticAlertsResponse({ localtime, alerts });
            setLoadingAtlanticAlerts(false);
        }
        fetchAlerts();
    }, []);

    useEffect(() => {
        if (!loadingMarineWeather && marineWeather.length > 0) {
            const calculatedAverages: Record<string, number | null> = {};
            marineWeatherFeatureNames.forEach((feature) => {
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
    }, [loadingMarineWeather, marineWeather]);

    return (
        <div
            className="flex flex-row w-full min-h-0 box-border overflow-hidden"
            style={{ height: "calc(100vh - 64px)" }}
        >
            <div
                className="w-2/5 bg-zinc-900 border-zinc-800 box-border overflow-hidden"
                style={{ height: "100%", scrollbarWidth: "thin" }}
            >
                <div className="flex flex-col flex-1 h-full min-h-0 bg-zinc-900 border-r border-zinc-800 p-8">
                    <div className="flex justify-between">
                        <span className="font-bold text-4xl text-white">Marine Weather</span>
                        <FilterAlertsWeather mode={marineDashboardMode} setMode={setMarineDashboardMode} />
                    </div>
                    {marineDashboardMode === "alerts" && (
                        <AlertsComponent
                            localtime={atlanticAlertsResponse?.localtime ?? ""}
                            alerts={atlanticAlertsResponse?.alerts ?? []}
                            loading={loadingAtlanticAlerts}
                        />
                    )}
                    {marineDashboardMode === "weather" && (
                        <MarineWeatherComponent
                            marineWeatherAverages={averages}
                            loadingMarineWeather={loadingAverages}
                        />
                    )}
                </div>
            </div>
            <div className="w-3/5 flex-1 flex flex-col h-full min-h-0 justify-center items-center bg-black">
                <MapMarineWeather
                    marineWeather={marineWeather}
                    legend={viewLegends.marineWeather}
                    timestamp={formatTimestamp(timestamp)}
                    loading={loadingMarineWeather}
                />
            </div>
        </div>
    );
}
