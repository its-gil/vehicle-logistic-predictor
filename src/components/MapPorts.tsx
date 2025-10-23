"use client";
import MapWorld from "./MapWorld";
import "leaflet/dist/leaflet.css";
import MarkersPorts from "./MarkersPorts";
import MarkerShip from "./MarkerShip";
import OverlayLegend from "./OverlayLegend";
import { viewLegends } from "@/constants";

export function MapPorts() {
    return (
        <div className="relative w-full h-full">
            <MapWorld center={[50, -40]} zoom={3}>
                <MarkersPorts />
                <MarkerShip />
                <OverlayLegend items={viewLegends.ports} />
            </MapWorld>
        </div>
    );
}
