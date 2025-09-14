"use client";
import { useState } from "react";
import dynamic from "next/dynamic";

const JourneysMap = dynamic(() => import("@/components/JourneysMap").then((mod) => mod.JourneysMap), { ssr: false });

export default function HistoricalRoutesPage() {
    const [filterType, setFilterType] = useState<"journey_id" | "mmsi">("journey_id");
    const [selectedId, setSelectedId] = useState<string>("1");

    return (
        <div className="relative w-full min-h-0 box-border overflow-hidden" style={{ height: "calc(100vh - 64px)" }}>
            <JourneysMap
                filterType={filterType}
                selectedId={selectedId}
                setFilterType={setFilterType}
                setSelectedId={setSelectedId}
            />
        </div>
    );
}
