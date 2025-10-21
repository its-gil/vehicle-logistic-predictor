"use client";
import MapWorld from "./MapWorld";
import { MapType } from "@/types";
import "leaflet/dist/leaflet.css";
import MarkersPorts from "./MarkersPorts";
import MarkerShip from "./MarkerShip";
import OverlayLegend from "./OverlayLegend";

export function MapPorts(props: MapType) {
    const { legend } = props;

    return (
        <div className="relative w-full h-full">
            <MapWorld center={[50, -40]} zoom={3}>
                <MarkersPorts />
                <MarkerShip />
                <OverlayLegend items={legend} />
            </MapWorld>
        </div>
    );
}
