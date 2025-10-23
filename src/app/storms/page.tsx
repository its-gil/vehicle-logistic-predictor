"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { StormMapMode } from "@/types";
import { useStorms } from "@/providers/StormsProvider";
import { formatTimestamp } from "@/utils/formatTimestamp";

const MapStorms = dynamic(() => import("@/components/MapStorms").then((mod) => mod.MapStorms), { ssr: false });

export default function StormsPage() {
    const { atlanticStorms, noaaPoints, arrows, regions, timestamp, loadingStorms } = useStorms();
    const [mapMode, setMapMode] = useState<StormMapMode>("active_storms");

    const [heatmapPoints, setHeatmapPoints] = useState<any[]>([]);
    const [heatmapLoaded, setHeatmapLoaded] = useState(false);
    const [stormsMapLoading, setStormsMapLoading] = useState(true);

    useEffect(() => {
        async function fetchHeatmapPoints() {
            try {
                const response = await fetch("/api/historical-storms");
                if (!response.ok) {
                    throw new Error("Failed to fetch historical storms");
                }

                const points = await response.json();
                setHeatmapPoints(points);
                setHeatmapLoaded(true);
            } catch (error) {
                console.error("Error fetching heatmap points:", error);
                setHeatmapPoints([]);
            }
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
                timestamp={formatTimestamp(timestamp)}
                stormsLoading={stormsMapLoading}
            />
        </div>
    );
}
