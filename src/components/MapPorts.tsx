"use client";
import MapWorld from "./MapWorld";
import { MapType } from "@/types";
import "leaflet/dist/leaflet.css";
import { viewLegends } from "@/constants";
import OverlayLegend from "./OverlayLegend";
import MarkersShipDestination from "./MarkersShipDestination";
import MarkersPorts from "./MarkersPorts";

export function MapPorts(props: MapType) {
    const { ports, onPortClick } = props;

    return (
        <div className="relative w-full h-full">
            <MapWorld>
                <MarkersPorts ports={ports} onPortClick={onPortClick} />
                <MarkersShipDestination />
                <OverlayLegend items={viewLegends.ports} />
            </MapWorld>
        </div>
    );
}
