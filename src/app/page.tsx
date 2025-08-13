"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Papa from "papaparse";
import BarChart from "@/components/BarChart";
import RingChart from "@/components/RingChart";
import { scrapeNOAATropicalPoints, NOAAFeature } from "@/utils/scrapeNOAATropicalPoints";
import { scrapeNOAATropicalArrows, NOAAArrowFeature } from "@/utils/scrapeNOAATropicalArrows";
import { scrapeNOAATropicalRegions, NOAARegionFeature } from "@/utils/scrapeNOAATropicalRegions";
import { scrapeNOAAActiveStorms, NOAAStorm } from "@/utils/scrapeNOAAActiveStorms";
import { cityPortList } from "@/utils/cityPortList";
import { scrapeCityAlerts } from "@/utils/scrapeCityAlerts";

// Dynamically import leaflet components
const WorldMap = dynamic(() => import("@/components/WorldMap").then((mod) => mod.WorldMap), { ssr: false });
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then((mod) => mod.Polyline), { ssr: false });
const Tooltip = dynamic(() => import("react-leaflet").then((mod) => mod.Tooltip), { ssr: false });
const Polygon = dynamic(() => import("react-leaflet").then((mod) => mod.Polygon), { ssr: false });
const CircleMarker = dynamic(() => import("react-leaflet").then((mod) => mod.CircleMarker), { ssr: false });

type CityWeatherResult = {
    current: any;
    hourly_2days: any;
    hourly_7days: any;
    daily_2days: any;
    daily_7days: any;
};

export default function Home() {
    const [percentage, setPercentage] = useState<number | null>(null);
    const [explanation, setExplanation] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [shipLoading, setShipLoading] = useState(false);
    const [portsLoading, setPortsLoading] = useState(false);
    const [mapData, setMapData] = useState<any[]>([]);
    const [showMap, setShowMap] = useState(false);
    const [selectedJourney, setSelectedJourney] = useState<string>("");
    const [selectedMmsi, setSelectedMmsi] = useState<string>("");
    const [noaaPoints, setNoaaPoints] = useState<NOAAFeature[]>([]);
    const [arrows, setArrows] = useState<NOAAArrowFeature[]>([]);
    const [regions, setRegions] = useState<NOAARegionFeature[]>([]);
    const [atlanticStorms, setAtlanticStorms] = useState<NOAAStorm[] | null>(null);
    const [stormsLoading, setStormsLoading] = useState(false);
    const [routePoints, setRoutePoints] = useState<{ lat: number; lon: number }[]>([]);
    const [cityAlerts, setCityAlerts] = useState<{ name: string; localtime: string; alerts: any[] }[]>([]);

    type Port = {
        name: string;
        lat: number;
        lon: number;
        [key: string]: any;
    };
    const [selectedPort, setSelectedPort] = useState<Port | null>(null);
    const [portWeather, setPortWeather] = useState<CityWeatherResult | null>(null);
    const [weatherLoading, setWeatherLoading] = useState(false);

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
            setShowMap(true);
            if (points.length > 0) {
                setSelectedJourney(points[0].journey_id);
                setSelectedMmsi(points[0].mmsi);
            }
        }
        fetchMapData();
    }, []);

    useEffect(() => {
        scrapeNOAATropicalPoints().then(setNoaaPoints).catch(console.error);
        scrapeNOAATropicalArrows().then(setArrows).catch(console.error);
        scrapeNOAATropicalRegions().then(setRegions).catch(console.error);
    }, []);

    // Fetch North Atlantic storms on mount
    useEffect(() => {
        setStormsLoading(true);
        fetch("/api/storms")
            .then((res) => res.json())
            .then(setAtlanticStorms)
            .finally(() => setStormsLoading(false));
    }, []);

    // Load route points from CSV
    useEffect(() => {
        fetch("/routes_flat.csv")
            .then((res) => res.text())
            .then((csvText) => {
                const parsed = Papa.parse(csvText, { header: true });
                if (parsed.data && Array.isArray(parsed.data)) {
                    // Group by lat/lon to check for overlaps
                    const pointMap = new Map<string, any>();
                    for (const row of parsed.data as any[]) {
                        const lat = parseFloat(row.lat);
                        const lon = parseFloat(row.lon);
                        const from_port_name = row.from_port_name;
                        const to_port_name = row.to_port_name;
                        if (isNaN(lat) || isNaN(lon) || !from_port_name || !to_port_name) continue;
                        const key = `${lat.toFixed(6)},${lon.toFixed(6)}`;
                        const existing = pointMap.get(key);
                        // If overlap, prioritize if from_port_name or to_port_name is "Brunswick"
                        if (
                            !existing ||
                            from_port_name?.toLowerCase().includes("brunswick") ||
                            to_port_name?.toLowerCase().includes("brunswick")
                        ) {
                            pointMap.set(key, {
                                lat,
                                lon,
                                from_port_name,
                                to_port_name,
                            });
                        }
                    }
                    setRoutePoints(Array.from(pointMap.values()));
                }
            });
    }, []);

    // Fetch weather for selected port
    useEffect(() => {
        if (!selectedPort) {
            setPortWeather(null);
            return;
        }
        setWeatherLoading(true);
        fetch(`/api/city-weather?lat=${selectedPort.lat}&lon=${selectedPort.lon}`)
            .then((res) => res.json())
            .then(setPortWeather)
            .finally(() => setWeatherLoading(false));
    }, [selectedPort]);

    const journeyIds = Array.from(new Set(mapData.map((p) => p.journey_id)));
    const mmsis = Array.from(new Set(mapData.map((p) => p.mmsi)));
    const filteredData = selectedJourney ? mapData.filter((p) => p.journey_id === selectedJourney) : [];
    const filteredDataMmsi = selectedMmsi ? mapData.filter((p) => p.mmsi === selectedMmsi) : [];

    const center: [number, number] = [30, -30];

    function getColor(prob2day: string, prob7day: string) {
        const p2 = parseInt(prob2day.replace("%", ""), 10) || 0;
        const p7 = parseInt(prob7day.replace("%", ""), 10) || 0;
        return p2 > 60 || p7 > 60 ? "red" : "yellow";
    }

    function extractNOAADate(idp_source?: string): string | null {
        if (!idp_source) return null;
        const match = idp_source.match(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})$/);
        if (!match) return null;
        let [, year, month, day, hour, minute] = match;
        // Add 2 hours for Germany time
        const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
        date.setHours(date.getHours() + 2);
        // Format with leading zeros
        const pad = (n: number) => n.toString().padStart(2, "0");
        return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(
            date.getMinutes()
        )} (GMT +2)`;
    }

    const noaaDate = extractNOAADate(noaaPoints[0]?.idp_source) || null;

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

    // Only 2-day prognosis points (origin points)
    const noaaPoints2Day = noaaPoints.filter((p) => p.prob2day && p.prob2day !== "0%");

    // Storms map content
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
        // Show all storms on the map with tooltips, ships greyed out in background
        return (
            <MapContainer center={center} zoom={2} style={{ height: "350px", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
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
                        color="rgba(100,100,100,0.3)"
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

    // Replace the RoutesPointsMap function with the following:
    function RoutesPointsMap() {
        const center: [number, number] = [30, -30];

        // Group by route: from_port_name + " → " + to_port_name
        const [routeGroups, colorKeys]: [
            Record<string, { lat: number; lon: number; from_port_name: string; to_port_name: string }[]>,
            string[]
        ] = (() => {
            if (routePoints.length === 0) return [{}, []];
            const groups: Record<string, { lat: number; lon: number; from_port_name: string; to_port_name: string }[]> =
                {};
            for (const p of routePoints as any[]) {
                const key = `${p.from_port_name} → ${p.to_port_name}`;
                if (!groups[key]) groups[key] = [];
                groups[key].push({
                    lat: p.lat,
                    lon: p.lon,
                    from_port_name: p.from_port_name,
                    to_port_name: p.to_port_name,
                });
            }
            return [groups, Object.keys(groups)];
        })();

        // Color palette
        const colors = [
            "#0074D9",
            "#FF4136",
            "#2ECC40",
            "#FF851B",
            "#B10DC9",
            "#7FDBFF",
            "#39CCCC",
            "#01FF70",
            "#F012BE",
            "#85144b",
            "#3D9970",
            "#111111",
            "#AAAAAA",
            "#FFDC00",
            "#001f3f",
            "#F012BE",
            "#FF4136",
            "#2ECC40",
        ];

        return (
            <MapContainer center={center} zoom={2} style={{ height: "350px", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                {colorKeys.map((route, idx) =>
                    routeGroups[route].map((p, i) => {
                        const isBrunswick =
                            p.from_port_name?.toLowerCase().includes("brunswick") ||
                            p.to_port_name?.toLowerCase().includes("brunswick");
                        return (
                            <CircleMarker
                                key={route + "_" + i}
                                center={[p.lat, p.lon]}
                                radius={isBrunswick ? 2 : 1}
                                pathOptions={{
                                    color: colors[idx % colors.length],
                                    fillColor: colors[idx % colors.length],
                                    fillOpacity: 0.7,
                                }}
                            >
                                <Tooltip direction="top" offset={[0, -5]} opacity={1} permanent={false}>
                                    <div>
                                        <div className="font-semibold">{route}</div>
                                        <div>
                                            Lat: {p.lat}, Lon: {p.lon}
                                        </div>
                                    </div>
                                </Tooltip>
                            </CircleMarker>
                        );
                    })
                )}
            </MapContainer>
        );
    }

    function PortsWorldMap() {
        const center: [number, number] = [40, -30];

        return (
            <MapContainer center={center} zoom={2} style={{ height: "350px", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                {cityPortList.map((port, idx) => (
                    <CircleMarker
                        key={port.name}
                        center={[port.lat, port.lon]}
                        radius={8}
                        pathOptions={{
                            color: "#222",
                            fillColor: "#0074D9",
                            fillOpacity: 0.85,
                        }}
                    >
                        <Tooltip direction="top" offset={[0, -5]} opacity={1} permanent={false}>
                            <div>
                                <div className="font-semibold">{port.name}</div>
                                <div>
                                    Lat: {port.lat}, Lon: {port.lon}
                                </div>
                            </div>
                        </Tooltip>
                    </CircleMarker>
                ))}
            </MapContainer>
        );
    }

    return (
        <div className="font-sans flex flex-col items-center p-2 pb-8 gap-8 sm:p-1 max-w-[2100px] mx-auto">
            {/* Buttons and predictor at the bottom */}
            <footer className="flex flex-col items-center w-full mt-16">
                <div className="flex items-center justify-between w-full gap-4">
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
                </div>
                <div className="flex flex-wrap justify-center gap-16 w-full mt-8">
                    <RingChart value={percentage ?? 0} comment="Potentiell blockierte Fahrzeuge" />
                </div>
                {explanation && (
                    <div className="mt-8 w-full max-w-2xl bg-zinc-100 dark:bg-zinc-800 rounded p-4 text-sm whitespace-pre-line">
                        <strong>Erklärung:</strong>
                        <br />
                        {explanation}
                    </div>
                )}
            </footer>
        </div>
    );
}
