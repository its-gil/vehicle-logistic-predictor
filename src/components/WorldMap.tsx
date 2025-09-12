"use client";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useShipsPositions } from "@/providers/ShipsPositionsProvider";
import LoadingOverlay from "./LoadingOverlay";

type ShipPoint = { mmsi: string; journey_id: string; lat: number; lon: number; date: string };

type Props = {
    center?: [number, number];
    zoom?: number;
};

export function WorldMap({ center = [30, -30], zoom = 3, children }: Props & { children?: React.ReactNode }) {
    const { shipsPositions, loading } = useShipsPositions();

    const grouped = (shipsPositions ?? []).reduce<Record<string, ShipPoint[]>>((acc, point) => {
        acc[point.journey_id] = acc[point.journey_id] || [];
        acc[point.journey_id].push(point);
        return acc;
    }, {});

    if (loading) {
        return <LoadingOverlay />;
    }

    return (
        <div className="relative w-full h-full">
            <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution="&copy; <a href='https://carto.com/attributions'>CARTO</a>"
                />
                {Object.values(grouped).map((points, idx) => (
                    <Polyline
                        key={`faded-${idx}`}
                        positions={points.map((p) => [p.lat, p.lon])}
                        color="rgba(100,100,100,0.1)"
                        weight={2}
                        opacity={0.5}
                    />
                ))}
                {children}
            </MapContainer>
        </div>
    );
}
