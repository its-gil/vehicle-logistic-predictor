"use client";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type ShipPoint = {
    uuid: string;
    journey_id: string;
    lat: number;
    lon: number;
    timestamp: string;
};

type Props = {
    data: ShipPoint[];
    showJourneyTooltip?: boolean;
};

export function WorldMap({ data, showJourneyTooltip = false }: Props) {
    // Group points by journey_id
    const grouped = data.reduce<Record<string, ShipPoint[]>>((acc, point) => {
        const journeyId = point.journey_id;
        acc[journeyId] = acc[journeyId] || [];
        acc[journeyId].push(point);
        return acc;
    }, {});

    // Center on Atlantic
    const center: [number, number] = [30, -30];

    // Color palette for journeys
    const colors = ["red", "blue", "green", "orange", "purple"];

    return (
        <MapContainer center={center} zoom={2} style={{ height: "600px", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            {Object.entries(grouped).map(([journeyId, points], idx) =>
                points.map((p, i) => (
                    <CircleMarker
                        key={journeyId + i}
                        center={[p.lat, p.lon]}
                        radius={3}
                        pathOptions={{
                            color: colors[idx % colors.length],
                            fillColor: colors[idx % colors.length],
                            fillOpacity: 0.8,
                        }}
                    >
                        <Tooltip direction="top" offset={[0, -5]} opacity={1} permanent={false}>
                            {showJourneyTooltip ? (
                                <div>
                                    <div>Journey ID: {journeyId}</div>
                                    <div>
                                        Lat: {p.lat}, Lon: {p.lon}
                                    </div>
                                    <div>Time: {p.timestamp}</div>
                                </div>
                            ) : (
                                <div>
                                    Lat: {p.lat}, Lon: {p.lon}
                                    <br />
                                    Time: {p.timestamp}
                                </div>
                            )}
                        </Tooltip>
                    </CircleMarker>
                ))
            )}
        </MapContainer>
    );
}
