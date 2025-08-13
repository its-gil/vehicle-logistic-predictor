"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import leaflet components
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then((mod) => mod.Polyline), { ssr: false });

export default function MarineWeatherPage() {
    const center: [number, number] = [30, 0];
    const [mapData, setMapData] = useState<any[]>([]);

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

    return (
        <div className="w-full h-screen min-h-0">
            <MapContainer center={center} zoom={2} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                {/* All historical routes as faded grey polylines */}
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
            </MapContainer>
        </div>
    );
}
