"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import BarChart from "@/components/BarChart";
import RingChart from "@/components/RingChart";

// Dynamically import WorldMap to avoid SSR issues with leaflet
const WorldMap = dynamic(() => import("@/components/WorldMap").then((mod) => mod.WorldMap), { ssr: false });

export default function Home() {
    const [percentage, setPercentage] = useState<number | null>(null);
    const [explanation, setExplanation] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [shipLoading, setShipLoading] = useState(false);
    const [portsLoading, setPortsLoading] = useState(false);
    const [mapData, setMapData] = useState<any[]>([]);
    const [showMap, setShowMap] = useState(false);
    const [selectedJourney, setSelectedJourney] = useState<string>("");

    // Load map data on page load
    useEffect(() => {
        async function fetchMapData() {
            const res = await fetch("/api/ships-positions");
            const data = await res.json();
            const points = data.map((row: any) => ({
                uuid: row.uuid,
                journey_id: row.journey_id,
                lat: parseFloat(row.lat),
                lon: parseFloat(row.lon),
                timestamp: row.timestamp,
            }));
            setMapData(points);
            setShowMap(true);
            // Set default selected journey to the first journey_id
            if (points.length > 0) {
                setSelectedJourney(points[0].journey_id);
            }
        }
        fetchMapData();
    }, []);

    // Get all unique journey_ids for the selector
    const journeyIds = Array.from(new Set(mapData.map((p) => p.journey_id)));

    // Filter data for the selected journey
    const filteredData = selectedJourney ? mapData.filter((p) => p.journey_id === selectedJourney) : [];

    async function refreshBlockedPercentage() {
        setLoading(true);
        try {
            const res = await fetch("/api/dashboard");
            const data = await res.json();
            const match = typeof data.percentage === "string" ? data.percentage.match(/(\d+(\.\d+)?)/) : null;
            setPercentage(match ? parseFloat(match[1]) / 100 : null);
            setExplanation(data.explanation || "");
        } catch {
            setPercentage(null);
            setExplanation("");
        } finally {
            setLoading(false);
        }
    }

    async function handleShipRequest() {
        setShipLoading(true);
        try {
            const res = await fetch("/api/ships?lat=53.507054061541524&lon=9.968746454384325");
            const data = await res.json();
            console.log("Ships API result:", data);
        } catch (e) {
            console.error("Ship API request failed:", e);
        } finally {
            setShipLoading(false);
        }
    }

    async function handlePortsRequest() {
        setPortsLoading(true);
        try {
            const res = await fetch("/api/ports");
            const data = await res.json();
            console.log("Ports API result:", data);
        } catch (e) {
            console.error("Ports API request failed:", e);
        } finally {
            setPortsLoading(false);
        }
    }

    return (
        <div className="font-sans grid grid-rows-[10px_1fr_10px] items-center justify-items-center p-8 pb-8 gap-8 sm:p-4">
            <header className="flex items-center justify-between w-full gap-4">
                <button
                    onClick={refreshBlockedPercentage}
                    className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
                    disabled={loading}
                >
                    {loading ? "Refreshing..." : "Refresh"}
                </button>
                <button
                    onClick={handleShipRequest}
                    className="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
                    disabled={shipLoading}
                >
                    {shipLoading ? "Loading Ships..." : "Get Ships"}
                </button>
                <button
                    onClick={handlePortsRequest}
                    className="px-4 py-2 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors"
                    disabled={portsLoading}
                >
                    {portsLoading ? "Loading Ports..." : "Get All Ports"}
                </button>
            </header>
            <main className="flex flex-col items-center w-full">
                <div className="flex flex-wrap justify-center gap-16 w-full">
                    <RingChart value={percentage ?? 0} comment="Potentiell blockierte Fahrzeuge" />
                </div>
                {explanation && (
                    <div className="mt-8 w-full max-w-2xl bg-zinc-100 dark:bg-zinc-800 rounded p-4 text-sm whitespace-pre-line">
                        <strong>Erklärung:</strong>
                        <br />
                        {explanation}
                    </div>
                )}
                {showMap && (
                    <div className="w-full max-w-4xl flex flex-col items-center">
                        <label className="mb-2 font-semibold">
                            Select Journey:
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
                        {/* Map for selected journey */}
                        <WorldMap data={filteredData} />
                        {/* Table for selected journey */}
                        {filteredData.length > 0 && (
                            <div className="overflow-x-auto w-full mt-6">
                                <table className="min-w-full border border-zinc-300 text-xs">
                                    <thead>
                                        <tr className="bg-zinc-100">
                                            <th className="border px-2 py-1">Timestamp</th>
                                            <th className="border px-2 py-1">Lat</th>
                                            <th className="border px-2 py-1">Lon</th>
                                            <th className="border px-2 py-1">UUID</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.map((entry, idx) => (
                                            <tr key={entry.timestamp + idx}>
                                                <td className="border px-2 py-1">{entry.timestamp}</td>
                                                <td className="border px-2 py-1">{entry.lat}</td>
                                                <td className="border px-2 py-1">{entry.lon}</td>
                                                <td className="border px-2 py-1">{entry.uuid}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
                {/* Map for all journeys */}
                {showMap && (
                    <div className="w-full max-w-4xl flex flex-col items-center mt-12">
                        <div className="mb-2 font-semibold">All Journeys</div>
                        <WorldMap data={mapData} showJourneyTooltip />
                    </div>
                )}
            </main>
        </div>
    );
}
