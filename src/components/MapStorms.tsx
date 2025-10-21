"use client";

import "leaflet/dist/leaflet.css";

import { MapType } from "@/types";

import MapWorld from "./MapWorld";
import LoadingOverlay from "./OverlayLoading";
import StormFilterOverlay from "./OverlayStormFilter";
import MarkersPotentialStorms from "./MarkersPotentialStorms";
import MarkersStorms from "./MarkersStorms";
import HeatmapLayer from "./HeatmapLayer";
import LegendOverlay from "./OverlayLegend";
import LastUpdateOverlay from "./OverlayLastUpdate";

import { viewLegends } from "@/constants";
import MarkerDestination from "./MarkerDestination";
import MarkerShip from "./MarkerShip";

export function MapStorms(props: MapType) {
    const { stormMapMode, onStormMapModeChange, storms, noaaPoints, arrows, regions, timestamp, stormsLoading } = props;

    return (
        <div className="relative w-full h-full">
            <MapWorld>
                <div className="absolute top-3 right-6 z-502 pointer-events-auto">
                    <StormFilterOverlay
                        mapMode={stormMapMode ?? "active_storms"}
                        onMapModeChange={onStormMapModeChange!}
                    />
                </div>
                {stormsLoading && <LoadingOverlay />}
                {stormMapMode === "active_storms" && !stormsLoading && (!storms || storms.length === 0) && (
                    <div className="absolute top-1/2 left-1/2 z-501 bg-black bg-opacity-10 px-12 py-8 rounded-xl text-white text-2xl font-bold text-center pointer-events-none transform -translate-x-1/2 -translate-y-1/2">
                        No active storms at the moment
                    </div>
                )}
                {stormMapMode === "active_storms" && !stormsLoading && <MarkersStorms storms={storms} />}
                {stormMapMode === "cyclone_disturbances" && !stormsLoading && (
                    <MarkersPotentialStorms noaaPoints={noaaPoints} arrows={arrows} regions={regions} />
                )}
                <MarkerShip />
                <MarkerDestination />
                <LastUpdateOverlay timestamp={timestamp} />
                <LegendOverlay items={viewLegends.storms} />
            </MapWorld>
        </div>
    );
}
