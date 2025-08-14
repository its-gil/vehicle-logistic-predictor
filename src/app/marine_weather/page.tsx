"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import leaflet components
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then((mod) => mod.Polyline), { ssr: false });

type MarineWeatherResult = {
    lat: number;
    lon: number;
    current: {
        wind_speed_10m?: number;
        wind_direction_10m?: number;
    };
    hourly_2days: any;
    hourly_7days: any;
};

export default function MarineWeatherPage() {
    const center: [number, number] = [30, 0];
    const [mapData, setMapData] = useState<any[]>([]);
    const [marineWeather, setMarineWeather] = useState<MarineWeatherResult[]>([]);

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
        async function fetchMarineWeather() {
            const res = await fetch("/api/marine-weather");
            const data = await res.json();
            console.log("marineWeather", data);
            setMarineWeather(Array.isArray(data) ? data : []);
        }
        fetchMarineWeather();
    }, []);

    // Helper to draw wind arrows with arrowhead
    function getArrowCoords(lat: number, lon: number, direction: number, speed: number): [number, number][][] {
        // Main line
        const length = Math.min(2 + speed * 0.2, 5); // max 5 degrees
        const rad = (direction * Math.PI) / 180;
        const lat2 = lat + length * Math.cos(rad) * 0.1;
        const lon2 = lon + length * Math.sin(rad) * 0.1;

        // Arrowhead (two lines)
        const arrowHeadLength = 0.2;
        const arrowAngle = 25 * (Math.PI / 180); // 25 degrees

        const leftRad = rad + arrowAngle;
        const rightRad = rad - arrowAngle;

        const leftLat = lat2 - arrowHeadLength * Math.cos(leftRad);
        const leftLon = lon2 - arrowHeadLength * Math.sin(leftRad);

        const rightLat = lat2 - arrowHeadLength * Math.cos(rightRad);
        const rightLon = lon2 - arrowHeadLength * Math.sin(rightRad);

        // Return three polylines: main, left head, right head
        return [
            [
                [lat, lon],
                [lat2, lon2],
            ], // main line
            [
                [lat2, lon2],
                [leftLat, leftLon],
            ], // left arrowhead
            [
                [lat2, lon2],
                [rightLat, rightLon],
            ], // right arrowhead
        ];
    }

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
                {/* Wind arrows from marine weather data */}
                {marineWeather.map((mw, idx) => {
                    const speed = mw.current?.wind_speed_10m ?? 0;
                    const direction = mw.current?.wind_direction_10m ?? 0;
                    if (!speed || !direction) return null;
                    const arrowLines = getArrowCoords(mw.lat, mw.lon, direction, speed);
                    const color = speed > 15 ? "red" : speed > 8 ? "orange" : "blue";
                    return arrowLines.map((line, i) => (
                        <Polyline
                            key={`${idx}-${i}`}
                            positions={line}
                            color={color}
                            weight={i === 0 ? 2 + speed * 0.2 : 2}
                            opacity={0.8}
                        />
                    ));
                })}
            </MapContainer>
        </div>
    );
}
