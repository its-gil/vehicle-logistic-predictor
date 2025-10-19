"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { StormMapMode } from "@/types";
import { useStorms } from "@/providers/StormsProvider";
import { viewLegends } from "@/constants/";
import { formatTimestamp } from "@/utils/formatTimestamp";

const MapStorms = dynamic(() => import("@/components/MapStorms").then((mod) => mod.MapStorms), { ssr: false });

export default function StormsPage() {
    const { atlanticStorms, noaaPoints, arrows, regions, loadingStorms } = useStorms();
    const [mapMode, setMapMode] = useState<StormMapMode>("active_storms");

    const [heatmapPoints, setHeatmapPoints] = useState<any[]>([]);
    const [heatmapLoaded, setHeatmapLoaded] = useState(false);
    const [stormsMapLoading, setStormsMapLoading] = useState(true);

    useEffect(() => {
        fetch("/hurdat2_storm_data_1851_2025.csv")
            .then((res) => res.text())
            .then((csvText) => {
                const lines = csvText.split("\n").filter((l) => l.trim());
                const header = lines[0].split(",");
                const latIdx = header.findIndex((h) => h.toLowerCase().includes("lat"));
                const lonIdx = header.findIndex((h) => h.toLowerCase().includes("lon"));
                const windIdx = header.findIndex((h) => h.toLowerCase().includes("wind"));
                const points = lines
                    .slice(1)
                    .map((line) => {
                        const cols = line.split(",");
                        return {
                            lat: parseFloat(cols[latIdx]),
                            lng: parseFloat(cols[lonIdx]),
                            intensity: parseInt(cols[windIdx], 10) || 0,
                        };
                    })
                    .filter((p) => !isNaN(p.lat) && !isNaN(p.lng));
                setHeatmapPoints(points);
                setHeatmapLoaded(true);
            })
            .catch((err) => {
                console.error(err);
                setHeatmapLoaded(true);
            });
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
                timestamp={formatTimestamp(new Date())}
                stormsLoading={stormsMapLoading}
            />
        </div>
    );
}
