"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { cityPortList } from "@/utils/cityPortList";

// Dynamically import leaflet components
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Tooltip = dynamic(() => import("react-leaflet").then((mod) => mod.Tooltip), { ssr: false });
const CircleMarker = dynamic(() => import("react-leaflet").then((mod) => mod.CircleMarker), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then((mod) => mod.Polyline), { ssr: false });

type CityWeatherResult = {
    current: any;
    hourly_2days: any;
    hourly_7days: any;
    daily_2days: any;
    daily_7days: any;
};

type Port = {
    name: string;
    lat: number;
    lon: number;
    [key: string]: any;
};

type CityAlert = {
    name: string;
    localtime: string;
    alerts: {
        headline: string;
        severity: string;
        urgency: string;
        certainty: string;
        event: string;
        desc: string;
        effective: string;
        expires: string;
    }[];
};

export default function PortsPage() {
    const [selectedPort, setSelectedPort] = useState<Port | null>(null);
    const [portWeather, setPortWeather] = useState<CityWeatherResult | null>(null);
    const [weatherLoading, setWeatherLoading] = useState(false);
    const [cityAlerts, setCityAlerts] = useState<CityAlert[]>([]);
    const [mapData, setMapData] = useState<any[]>([]);

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

    useEffect(() => {
        // Fetch city weather alerts on mount
        fetch("/api/city-alerts")
            .then((res) => res.json())
            .then(setCityAlerts);
    }, []);

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

    const mapCenter: [number, number] = [40, -30];

    // Filter alerts for selected city/port
    const selectedCityAlerts = selectedPort
        ? cityAlerts.find(
              (city) =>
                  city.name.toLowerCase() === selectedPort.name.toLowerCase() ||
                  city.name.toLowerCase().includes(selectedPort.name.toLowerCase())
          )
        : null;

    return (
        <div className="flex flex-row w-full h-screen min-h-0 box-border overflow-hidden">
            {/* Left: Map */}
            <div className="flex-1 flex flex-col h-full min-h-0 justify-center items-center bg-black">
                <MapContainer center={mapCenter} zoom={2} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                    />
                    {/* Historical routes as faded grey polylines */}
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
                    {/* Port markers */}
                    {cityPortList.map((port) => (
                        <CircleMarker
                            key={port.name}
                            center={[port.lat, port.lon]}
                            radius={8}
                            pathOptions={{
                                color: "#222",
                                fillColor: "#0074D9",
                                fillOpacity: 0.85,
                            }}
                            eventHandlers={{
                                click: () => setSelectedPort(port),
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
            </div>
            {/* Right: Weather Info & Alerts */}
            <div className="flex-1 flex flex-col h-full min-h-0 bg-zinc-900 p-8">
                {selectedPort ? (
                    <div className="w-full h-full flex flex-col">
                        <div className="font-bold mb-4 text-lg text-white">{selectedPort.name} Weather</div>
                        <div className="mb-4 text-white">
                            <span className="font-semibold">Coordinates:</span> {selectedPort.lat}, {selectedPort.lon}
                        </div>
                        {weatherLoading && <div className="text-white">Loading weather...</div>}
                        {!weatherLoading && portWeather && (
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 h-1/2">
                                {/* Column 1: Current */}
                                <div>
                                    <div className="mb-2 text-white font-semibold">Current</div>
                                    <pre className="whitespace-pre-wrap text-xs bg-black rounded p-2 text-white h-full">
                                        {JSON.stringify(portWeather.current, null, 2)}
                                    </pre>
                                </div>
                                {/* Column 2: Hourly in 2 days */}
                                <div>
                                    <div className="mb-2 text-white font-semibold">Hourly in 2 days</div>
                                    <pre className="whitespace-pre-wrap text-xs bg-black rounded p-2 text-white h-full">
                                        {JSON.stringify(portWeather.hourly_2days, null, 2)}
                                    </pre>
                                </div>
                                {/* Column 3: Hourly in 7 days */}
                                <div>
                                    <div className="mb-2 text-white font-semibold">Hourly in 7 days</div>
                                    <pre className="whitespace-pre-wrap text-xs bg-black rounded p-2 text-white h-full">
                                        {JSON.stringify(portWeather.hourly_7days, null, 2)}
                                    </pre>
                                </div>
                                {/* Column 4: Daily in 2 days */}
                                <div>
                                    <div className="mb-2 text-white font-semibold">Daily in 2 days</div>
                                    <pre className="whitespace-pre-wrap text-xs bg-black rounded p-2 text-white h-full">
                                        {JSON.stringify(portWeather.daily_2days, null, 2)}
                                    </pre>
                                </div>
                                {/* Column 5: Daily in 7 days */}
                                <div>
                                    <div className="mb-2 text-white font-semibold">Daily in 7 days</div>
                                    <pre className="whitespace-pre-wrap text-xs bg-black rounded p-2 text-white h-full">
                                        {JSON.stringify(portWeather.daily_7days, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        )}
                        {!weatherLoading && !portWeather && (
                            <div className="text-white">No weather data available.</div>
                        )}
                        {/* Weather alerts for selected city/port */}
                        <div className="mt-8 w-full h-1/2">
                            <div className="mb-2 font-semibold text-lg text-white text-center">
                                Weather Alerts for {selectedPort.name}
                            </div>
                            <div className="bg-zinc-900 rounded shadow p-4 max-h-[300px] overflow-y-auto text-sm border border-zinc-700">
                                {!selectedCityAlerts && <div className="text-zinc-300">Loading alerts...</div>}
                                {selectedCityAlerts && selectedCityAlerts.alerts.length === 0 && (
                                    <div className="text-zinc-500 italic">No alerts</div>
                                )}
                                {selectedCityAlerts &&
                                    selectedCityAlerts.alerts.map((alert, idx) => (
                                        <div key={idx} className="mb-4 border-l-4 pl-2 border-yellow-400">
                                            <div className="font-semibold text-white">{alert.headline}</div>
                                            <div className="text-zinc-200">
                                                <span className="font-semibold">Severity:</span> {alert.severity} |{" "}
                                                <span className="font-semibold">Urgency:</span> {alert.urgency} |{" "}
                                                <span className="font-semibold">Certainty:</span> {alert.certainty} |{" "}
                                                <span className="font-semibold">Event:</span> {alert.event}
                                            </div>
                                            <div className="text-xs text-zinc-300 whitespace-pre-line">
                                                {alert.desc}
                                            </div>
                                            <div className="text-xs text-zinc-400">
                                                <span>Effective: {alert.effective}</span> |{" "}
                                                <span>Expires: {alert.expires}</span>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-zinc-400 text-lg">
                        Click a port to see weather info.
                    </div>
                )}
            </div>
        </div>
    );
}
