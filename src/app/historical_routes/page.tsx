"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { cityPortList } from "@/utils/cityPortList";

// Dynamically import leaflet components
const WorldMap = dynamic(() => import("@/components/WorldMap").then((mod) => mod.WorldMap), { ssr: false });

export default function HistoricalRoutesPage() {
    const [mapData, setMapData] = useState<any[]>([]);
    const [selectedJourney, setSelectedJourney] = useState<string>("");
    const [selectedMmsi, setSelectedMmsi] = useState<string>("");

    useEffect(() => {
        async function fetchMapData() {
            const res = await fetch("/api/ships-positions");
            const data = await res.json();
            const points = data.map((row: any) => ({
                mmsi: row.mmsi,
                journey_id: row.journey_id,
                lat: parseFloat(row.lat),
                lon: parseFloat(row.lon),
                timestamp: row.timestamp,
            }));
            setMapData(points);
            if (points.length > 0) {
                setSelectedJourney(points[0].journey_id);
                setSelectedMmsi(points[0].mmsi);
            }
        }
        fetchMapData();
    }, []);

    const journeyIds = Array.from(new Set(mapData.map((p) => p.journey_id)));
    const mmsis = Array.from(new Set(mapData.map((p) => p.mmsi)));
    const filteredDataJourney = selectedJourney ? mapData.filter((p) => p.journey_id === selectedJourney) : [];
    const filteredDataMmsi = selectedMmsi ? mapData.filter((p) => p.mmsi === selectedMmsi) : [];

    return (
        <div className="flex flex-row w-full h-screen gap-4 p-8 box-border overflow-hidden">
            {/* Journey ID World Map */}
            <div className="flex-1 flex flex-col h-full min-h-0">
                <div className="mb-2 font-semibold text-lg text-center">Historical Routes by Journey ID</div>
                <label className="mb-2 font-semibold">
                    <select
                        className="ml-2 p-1 rounded border"
                        value={selectedJourney}
                        onChange={(e) => setSelectedJourney(e.target.value)}
                    >
                        {journeyIds.map((jid) => (
                            <option key={jid} value={jid}>
                                {jid}
                            </option>
                        ))}
                    </select>
                </label>
                <div className="flex-1 min-h-0">
                    <WorldMap data={filteredDataJourney} />
                </div>
            </div>
            {/* MMSI World Map */}
            <div className="flex-1 flex flex-col h-full min-h-0">
                <div className="mb-2 font-semibold text-lg text-center">Historical Routes by MMSI</div>
                <label className="mb-2 font-semibold">
                    <select
                        className="ml-2 p-1 rounded border"
                        value={selectedMmsi}
                        onChange={(e) => setSelectedMmsi(e.target.value)}
                    >
                        {mmsis.map((mmsi) => (
                            <option key={mmsi} value={mmsi}>
                                {mmsi}
                            </option>
                        ))}
                    </select>
                </label>
                <div className="flex-1 min-h-0">
                    <WorldMap data={filteredDataMmsi} groupBy="journey_id" showJourneyInTooltip />
                </div>
            </div>
        </div>
    );
}
