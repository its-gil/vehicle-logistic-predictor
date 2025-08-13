"use client";
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type ShipPoint = {
    mmsi: string;
    journey_id: string;
    lat: number;
    lon: number;
    timestamp: string;
};

type Props = {
    data: ShipPoint[];
    groupBy?: "journey_id" | "mmsi";
    showJourneyInTooltip?: boolean;
    showTooltips?: boolean;
};

export function WorldMap({ data, groupBy = "journey_id", showJourneyInTooltip = false, showTooltips = true }: Props) {
    // Group points by journey_id (default) or mmsi
    const grouped = data.reduce<Record<string, ShipPoint[]>>((acc, point) => {
        const key = groupBy === "mmsi" ? point.mmsi : point.journey_id;
        acc[key] = acc[key] || [];
        acc[key].push(point);
        return acc;
    }, {});

    const center: [number, number] = [30, -30];
    const colors = [
        "rgba(255,0,0,0.5)",
        "rgba(0,0,255,0.5)",
        "rgba(0,200,0,0.5)",
        "rgba(255,165,0,0.5)",
        "rgba(128,0,128,0.5)",
        "rgba(0,255,255,0.5)",
        "rgba(255,0,255,0.5)",
        "rgba(128,128,0,0.5)",
        "rgba(0,128,128,0.5)",
        "rgba(128,0,0,0.5)",
    ];

    return (
        <MapContainer center={center} zoom={2} style={{ height: "95%", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            {Object.entries(grouped).map(([key, points], idx) => (
                <>
                    <Polyline
                        key={key}
                        positions={points.map((p) => [p.lat, p.lon])}
                        color={colors[idx % colors.length]}
                        weight={2}
                        opacity={0.7}
                    />
                    {points.map((p, i) => (
                        <CircleMarker
                            key={key + i}
                            center={[p.lat, p.lon]}
                            radius={2}
                            pathOptions={{
                                color: colors[idx % colors.length],
                                fillColor: colors[idx % colors.length],
                                fillOpacity: 0.8,
                            }}
                        >
                            {showTooltips && (
                                <Tooltip direction="top" offset={[0, -5]} opacity={1} permanent={false}>
                                    <div>
                                        <div>Timestamp: {p.timestamp}</div>
                                        <div>
                                            Lat: {p.lat}, Lon: {p.lon}
                                        </div>
                                        <div>MMSI: {p.mmsi}</div>
                                        {showJourneyInTooltip && <div>Journey: {p.journey_id}</div>}
                                    </div>
                                </Tooltip>
                            )}
                        </CircleMarker>
                    ))}
                </>
            ))}
        </MapContainer>
    );
}
