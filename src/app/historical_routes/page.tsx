"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { viewLegends } from "@/constants";
import { journeysFilterType } from "@/types";

const MapJourneys = dynamic(() => import("@/components/MapJourneys").then((mod) => mod.MapJourneys), { ssr: false });

export default function HistoricalRoutesPage() {
    const [filterType, setFilterType] = useState<journeysFilterType>("journey_id");
    const [selectedId, setSelectedId] = useState<string>("1");

    return (
        <div className="relative w-full min-h-0 box-border overflow-hidden" style={{ height: "calc(100vh - 64px)" }}>
            <MapJourneys
                journeysFilterType={filterType}
                setJourneysFilterType={setFilterType}
                selectedJourneyId={selectedId}
                setSelectedJourneyId={setSelectedId}
                legend={viewLegends.historicalRoutes}
                timestamp={new Date().toISOString()}
            />
        </div>
    );
}
