"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { StormMapMode } from "@/types";
import { useStorms } from "@/providers/StormsProvider";
import { viewLegends } from "@/constants/";
import { formatTimestamp } from "@/utils/formatTimestamp";
import getHistoricalStorms from "@/utils/getHistoricalStorms";

const MapStorms = dynamic(() => import("@/components/MapStorms").then((mod) => mod.MapStorms), { ssr: false });

export default function StormsPage() {
    const { atlanticStorms, noaaPoints, arrows, regions, timestamp, loadingStorms } = useStorms();
    const [mapMode, setMapMode] = useState<StormMapMode>("active_storms");

    const [heatmapPoints, setHeatmapPoints] = useState<any[]>([]);
    const [heatmapLoaded, setHeatmapLoaded] = useState(false);
    const [stormsMapLoading, setStormsMapLoading] = useState(true);

    useEffect(() => {
        async function fetchHeatmapPoints() {
            const points = await getHistoricalStorms();
            setHeatmapPoints(points);
            setHeatmapLoaded(true);
        }

        fetchHeatmapPoints();
    }, []);

    useEffect(() => {
        if (!loadingStorms && heatmapLoaded) {
            setStormsMapLoading(false);
        }
    }, [loadingStorms, heatmapLoaded]);

    return (
        <div className="relative w-full min-h-0 box-border overflow-hidden" style={{ height: "calc(100vh - 64px)" }}>
            <MapStorms
                stormMapMode={mapMode}
                onStormMapModeChange={setMapMode}
                storms={atlanticStorms || []}
                heatmapPoints={heatmapPoints}
                noaaPoints={noaaPoints}
                arrows={arrows}
                regions={regions}
                legend={viewLegends.storms}
                timestamp={formatTimestamp(timestamp)}
                stormsLoading={stormsMapLoading}
            />
        </div>
    );
}
