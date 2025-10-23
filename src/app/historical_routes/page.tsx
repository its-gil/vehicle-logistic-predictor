"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { journeysFilterType } from "@/types";

const MapJourneys = dynamic(() => import("@/components/MapJourneys").then((mod) => mod.MapJourneys), { ssr: false });

export default function HistoricalRoutesPage() {
    const [filterType, setFilterType] = useState<journeysFilterType>("mmsi");
    const [selectedId, setSelectedId] = useState<string>("229710000");

    return (
        <div className="relative w-full min-h-0 box-border overflow-hidden" style={{ height: "calc(100vh - 64px)" }}>
            <MapJourneys
                journeysFilterType={filterType}
                setJourneysFilterType={setFilterType}
                selectedJourneyId={selectedId}
                setSelectedJourneyId={setSelectedId}
            />
        </div>
    );
}
