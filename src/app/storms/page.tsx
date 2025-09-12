"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { scrapeNOAATropicalPoints, NOAAFeature } from "@/utils/scrapeNOAATropicalPoints";
import { scrapeNOAATropicalArrows, NOAAArrowFeature } from "@/utils/scrapeNOAATropicalArrows";
import { scrapeNOAATropicalRegions, NOAARegionFeature } from "@/utils/scrapeNOAATropicalRegions";

const StormsMap = dynamic(() => import("@/components/StormsMap").then((mod) => mod.StormsMap), { ssr: false });

type StormMapMode = "active_storms" | "cyclone_disturbances";

export default function StormsPage() {
    const [mapMode, setMapMode] = useState<StormMapMode>("active_storms");
    const [noaaPoints, setNoaaPoints] = useState<NOAAFeature[]>([]);
    const [arrows, setArrows] = useState<NOAAArrowFeature[]>([]);
    const [regions, setRegions] = useState<NOAARegionFeature[]>([]);
    const [atlanticStorms, setAtlanticStorms] = useState<any[] | null>(null);
    const [heatmapPoints, setHeatmapPoints] = useState<any[]>([]);
    const [stormsLoading, setStormsLoading] = useState(true);
    const [stormsFetched, setStormsFetched] = useState(false);
    const [heatmapFetched, setHeatmapFetched] = useState(false);

    useEffect(() => {
        scrapeNOAATropicalPoints().then(setNoaaPoints).catch(console.error);
        scrapeNOAATropicalArrows().then(setArrows).catch(console.error);
        scrapeNOAATropicalRegions().then(setRegions).catch(console.error);
    }, []);

    useEffect(() => {
        fetch("/api/storms")
            .then((res) => res.json())
            .then(setAtlanticStorms)
            .finally(() => setStormsFetched(true));
    }, []);

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
                setHeatmapFetched(true);
            })
            .catch((err) => {
                console.error(err);
                setHeatmapFetched(true);
            });
    }, []);

    useEffect(() => {
        if (stormsFetched && heatmapFetched) {
            setStormsLoading(false);
        }
    }, [stormsFetched, heatmapFetched]);

    return (
        <div className="relative w-full min-h-0 box-border overflow-hidden" style={{ height: "calc(100vh - 64px)" }}>
            <StormsMap
                mapMode={mapMode}
                onMapModeChange={setMapMode}
                storms={atlanticStorms || []}
                heatmapPoints={heatmapPoints}
                noaaPoints={noaaPoints}
                arrows={arrows}
                regions={regions}
                stormsLoading={stormsLoading}
            />
        </div>
    );
}
