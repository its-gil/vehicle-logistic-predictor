"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { scrapeNOAATropicalPoints, NOAAFeature } from "@/utils/scrapeNOAATropicalPoints";
import { scrapeNOAATropicalArrows, NOAAArrowFeature } from "@/utils/scrapeNOAATropicalArrows";
import { scrapeNOAATropicalRegions, NOAARegionFeature } from "@/utils/scrapeNOAATropicalRegions";
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";

// Dynamically import leaflet components
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then((mod) => mod.Polyline), { ssr: false });
const Tooltip = dynamic(() => import("react-leaflet").then((mod) => mod.Tooltip), { ssr: false });
const Polygon = dynamic(() => import("react-leaflet").then((mod) => mod.Polygon), { ssr: false });
const CircleMarker = dynamic(() => import("react-leaflet").then((mod) => mod.CircleMarker), { ssr: false });

export default function StormsPage() {
    const [mapData, setMapData] = useState<any[]>([]);
    const [noaaPoints, setNoaaPoints] = useState<NOAAFeature[]>([]);
    const [arrows, setArrows] = useState<NOAAArrowFeature[]>([]);
    const [regions, setRegions] = useState<NOAARegionFeature[]>([]);
    const [atlanticStorms, setAtlanticStorms] = useState<any[] | null>(null);
    const [stormsLoading, setStormsLoading] = useState(false);
    const [heatmapPoints, setHeatmapPoints] = useState<any[]>([]);

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
        }
        fetchMapData();
    }, []);

    useEffect(() => {
        scrapeNOAATropicalPoints().then(setNoaaPoints).catch(console.error);
        scrapeNOAATropicalArrows().then(setArrows).catch(console.error);
        scrapeNOAATropicalRegions().then(setRegions).catch(console.error);
    }, []);

    useEffect(() => {
        setStormsLoading(true);
        fetch("/api/storms")
            .then((res) => res.json())
            .then(setAtlanticStorms)
            .finally(() => setStormsLoading(false));
    }, []);

    useEffect(() => {
        fetch("/hurdat2_storm_data_1851_2025.csv")
            .then((res) => res.text())
            .then((csvText) => {
                // Simple CSV parsing (assumes header row and comma separation)
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
            })
            .catch(console.error);
    }, []);

    const center: [number, number] = [30, -40];

    function getColor(prob2day: string, prob7day: string) {
        const p2 = parseInt(prob2day.replace("%", ""), 10) || 0;
        const p7 = parseInt(prob7day.replace("%", ""), 10) || 0;
        return p2 > 60 || p7 > 60 ? "red" : "yellow";
    }

    // 1. Storms Map/Box
    function StormsMapBox() {
        if (stormsLoading) {
            return <div className="flex items-center justify-center h-full w-full text-lg">Loading storms...</div>;
        }
        if (!atlanticStorms || atlanticStorms.length === 0) {
            return (
                <div className="flex items-center justify-center h-full w-full text-lg text-zinc-700">
                    No active storms in the North Atlantic.
                </div>
            );
        }
        return (
            <MapContainer center={center} zoom={2} style={{ height: "95%", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                <HeatmapLayer
                    fitBoundsOnLoad
                    fitBoundsOnUpdate
                    points={heatmapPoints}
                    longitudeExtractor={(p: { lng: number }) => p.lng}
                    latitudeExtractor={(p: { lat: number }) => p.lat}
                    intensityExtractor={(p: { intensity: number }) => p.intensity}
                    max={95} // set max intensity based on your data
                    radius={5}
                    blur={8}
                    opacity={0.3}
                />
                {/* All journeys as faded grey polylines */}
                {Object.values(
                    mapData.reduce<Record<string, any[]>>((acc, point) => {
                        acc[point.journey_id] = acc[point.journey_id] || [];
                        acc[point.journey_id].push(point);
                        return acc;
                    }, {})
                ).map((points, idx) => (
                    <Polyline
                        key={idx}
                        positions={points.map((p) => [p.lat, p.lon])}
                        color="rgba(100,100,100,0.1)"
                        weight={2}
                        opacity={0.5}
                    />
                ))}
                {/* Storms as points with tooltips */}
                {atlanticStorms.map((storm) => (
                    <CircleMarker
                        key={storm.id}
                        center={[storm.latitudeNumeric, storm.longitudeNumeric]}
                        radius={12}
                        pathOptions={{
                            color: "red",
                            fillColor: "red",
                            fillOpacity: 0.8,
                        }}
                    >
                        <Tooltip direction="top" offset={[0, -5]} opacity={1} permanent={false}>
                            <div>
                                <div className="font-bold">{storm.name}</div>
                                <div>
                                    <span className="font-semibold">Classification:</span> {storm.classification}
                                </div>
                                <div>
                                    <span className="font-semibold">Location:</span> {storm.latitude}, {storm.longitude}
                                </div>
                                <div>
                                    <span className="font-semibold">Speed:</span> {storm.movementSpeed} kt
                                </div>
                                <div>
                                    <span className="font-semibold">Direction:</span> {storm.movementDir}&deg;
                                </div>
                                <div>
                                    <span className="font-semibold">Last Update:</span> {storm.lastUpdate}
                                </div>
                            </div>
                        </Tooltip>
                    </CircleMarker>
                ))}
            </MapContainer>
        );
    }

    // 2. Cyclone full disturbance map
    function CycloneDisturbanceMap() {
        return (
            <MapContainer center={center} zoom={2} style={{ height: "95%", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                {/* All journeys as faded grey polylines in background */}
                {Object.values(
                    mapData.reduce<Record<string, any[]>>((acc, point) => {
                        acc[point.journey_id] = acc[point.journey_id] || [];
                        acc[point.journey_id].push(point);
                        return acc;
                    }, {})
                ).map((points, idx) => (
                    <Polyline
                        key={idx}
                        positions={points.map((p) => [p.lat, p.lon])}
                        color="rgba(100,100,100,0.1)"
                        weight={2}
                        opacity={0.5}
                    />
                ))}
                {/* Regions as polygons */}
                {regions.map((region) => (
                    <Polygon
                        key={region.id}
                        positions={region.coordinates}
                        pathOptions={{
                            color: getColor(region.prob2day, region.prob7day),
                            fillColor: getColor(region.prob2day, region.prob7day),
                            fillOpacity: 0.3,
                        }}
                    >
                        <Tooltip sticky>
                            <div>
                                <div>2-day: {region.prob2day}</div>
                                <div>7-day: {region.prob7day}</div>
                            </div>
                        </Tooltip>
                    </Polygon>
                ))}
                {/* Arrows as polylines */}
                {arrows.map((arrow) => (
                    <Polyline
                        key={arrow.id}
                        positions={arrow.coordinates}
                        color={getColor(arrow.prob2day, arrow.prob7day)}
                        weight={4}
                    >
                        <Tooltip sticky>
                            <div>
                                <div>Basin: {arrow.basin}</div>
                                <div>2-day: {arrow.prob2day}</div>
                                <div>7-day: {arrow.prob7day}</div>
                            </div>
                        </Tooltip>
                    </Polyline>
                ))}
                {/* All origin points */}
                {noaaPoints.map((p) => (
                    <CircleMarker
                        key={p.id}
                        center={[p.lat, p.lon]}
                        radius={7}
                        pathOptions={{
                            color: getColor(p.prob2day, p.prob7day),
                            fillColor: getColor(p.prob2day, p.prob7day),
                            fillOpacity: 0.9,
                        }}
                    >
                        <Tooltip direction="top" offset={[0, -5]} opacity={1} permanent={false}>
                            <div>
                                <div>
                                    Lat: {p.lat}, Lon: {p.lon}
                                </div>
                                <div>2-day: {p.prob2day}</div>
                                <div>7-day: {p.prob7day}</div>
                            </div>
                        </Tooltip>
                    </CircleMarker>
                ))}
            </MapContainer>
        );
    }

    return (
        <div className="flex flex-row w-full h-screen gap-4 px-8 pt-4 box-border overflow-hidden">
            {/* Storms Map/Box */}
            <div className="flex-1 flex flex-col h-full min-h-0">
                <div className="px-4 pt-4 pb-2 font-semibold text-lg text-center">
                    Active Storms in the North Atlantic
                </div>
                <div className="flex-1 min-h-0 h-full">
                    <StormsMapBox />
                </div>
            </div>
            {/* Cyclone full disturbance map */}
            <div className="flex-1 flex flex-col h-full min-h-0">
                <div className="px-4 pt-4 pb-2 font-semibold text-lg text-center">
                    Cyclone Disturbance Areas, Arrows & Origins + All Ships
                </div>
                <div className="flex-1 min-h-0 h-full">
                    <CycloneDisturbanceMap />
                </div>
            </div>
        </div>
    );
}
