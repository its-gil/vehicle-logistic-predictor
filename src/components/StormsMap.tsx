"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import LastUpdateOverlay from "./LastUpdateOverlay";
import { StormFilterOverlay } from "./StormFilterOverlay";
import { HeatmapLayer } from "./HeatmapLayer";
import { WorldMap } from "./WorldMap";
import LoadingOverlay from "./LoadingOverlay";
import { formatTimestamp } from "@/utils/formatTimestamp";

type StormMapMode = "active_storms" | "cyclone_disturbances";

type StormPoint = {
    id?: string;
    lat: number;
    lon: number;
    latitudeNumeric?: number;
    longitudeNumeric?: number;
    name?: string;
    classification?: string;
    intensity?: number;
    movementSpeed?: number;
    movementDir?: number;
    lastUpdate?: string;
    system_status?: string;
    system_status_desc?: string;
    storm_id?: string;
    storm_name?: string;
    datetime?: string;
    max_sustained_wind?: number | null;
};

type NOAAFeature = { id: string; lat: number; lon: number; prob2day: string; prob7day: string };
type NOAAArrowFeature = {
    id: string;
    coordinates: [number, number][];
    basin: string;
    prob2day: string;
    prob7day: string;
};
type NOAARegionFeature = { id: string; coordinates: [number, number][]; prob2day: string; prob7day: string };

type Props = {
    mapMode?: StormMapMode;
    onMapModeChange?: (mode: StormMapMode) => void;
    storms?: StormPoint[];
    heatmapPoints?: any[];
    noaaPoints?: NOAAFeature[];
    arrows?: NOAAArrowFeature[];
    regions?: NOAARegionFeature[];
    stormsLoading?: boolean;
};

function getColor(prob2day: string, prob7day: string) {
    const p2 = parseInt(prob2day.replace("%", ""), 10) || 0;
    const p7 = parseInt(prob7day.replace("%", ""), 10) || 0;
    return p2 > 60 || p7 > 60 ? "red" : "yellow";
}

export function StormsMap(props: Props) {
    const { mapMode, onMapModeChange, storms, heatmapPoints, noaaPoints, arrows, regions, stormsLoading } = props;

    return (
        <div className="relative w-full h-full">
            <LastUpdateOverlay timestamp={formatTimestamp(new Date())} />
            <div className="absolute top-3 right-6 z-502 pointer-events-auto">
                <StormFilterOverlay mapMode={mapMode ?? "active_storms"} onMapModeChange={onMapModeChange!} />
            </div>
            <WorldMap>
                {stormsLoading && <LoadingOverlay />}
                {mapMode === "active_storms" && !stormsLoading && (
                    <>
                        {(!storms || storms.length === 0) && (
                            <div className="absolute top-1/2 left-1/2 z-501 bg-black bg-opacity-10 px-12 py-8 rounded-xl text-white text-2xl font-bold text-center pointer-events-none transform -translate-x-1/2 -translate-y-1/2">
                                No active storms at the moment
                            </div>
                        )}
                        {storms?.map((storm) => (
                            <CircleMarker
                                key={storm.id}
                                center={[storm.latitudeNumeric ?? storm.lat, storm.longitudeNumeric ?? storm.lon]}
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
                                            <span className="font-semibold">Classification:</span>{" "}
                                            {storm.classification}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Location:</span>{" "}
                                            {storm.latitudeNumeric ?? storm.lat}, {storm.longitudeNumeric ?? storm.lon}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Intensity:</span> {storm.intensity}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Speed:</span> {storm.movementSpeed} kt
                                        </div>
                                        <div>
                                            <span className="font-semibold">Direction:</span> {storm.movementDir}
                                            &deg;
                                        </div>
                                        <div>
                                            <span className="font-semibold">Last Update:</span> {storm.lastUpdate}
                                        </div>
                                    </div>
                                </Tooltip>
                            </CircleMarker>
                        ))}
                    </>
                )}
                {mapMode === "cyclone_disturbances" && !stormsLoading && (
                    <>
                        <HeatmapLayer
                            points={(heatmapPoints ?? []).map((p: { lat: number; lng: number; intensity?: number }) => [
                                p.lat,
                                p.lng,
                                p.intensity ?? 1,
                            ])}
                            max={95}
                            radius={5}
                            blur={8}
                            opacity={0.8}
                        />

                        {regions?.map((region) => (
                            <Polygon
                                key={region.id}
                                positions={region.coordinates}
                                pathOptions={{
                                    color: getColor(region.prob2day, region.prob7day),
                                    fillColor: getColor(region.prob2day, region.prob7day),
                                    fillOpacity: 0.3,
                                }}
                            >
                                <Tooltip sticky>
                                    <div>
                                        <div>2-day: {region.prob2day}</div>
                                        <div>7-day: {region.prob7day}</div>
                                    </div>
                                </Tooltip>
                            </Polygon>
                        ))}
                        {arrows?.map((arrow) => (
                            <Polyline
                                key={arrow.id}
                                positions={arrow.coordinates}
                                color={getColor(arrow.prob2day, arrow.prob7day)}
                                weight={4}
                            >
                                <Tooltip sticky>
                                    <div>
                                        <div>Basin: {arrow.basin}</div>
                                        <div>2-day: {arrow.prob2day}</div>
                                        <div>7-day: {arrow.prob7day}</div>
                                    </div>
                                </Tooltip>
                            </Polyline>
                        ))}
                        {noaaPoints?.map((p) => (
                            <CircleMarker
                                key={p.id}
                                center={[p.lat, p.lon]}
                                radius={7}
                                pathOptions={{
                                    color: getColor(p.prob2day, p.prob7day),
                                    fillColor: getColor(p.prob2day, p.prob7day),
                                    fillOpacity: 0.9,
                                }}
                            >
                                <Tooltip direction="top" offset={[0, -5]} opacity={1} permanent={false}>
                                    <div>
                                        <div>
                                            Lat: {p.lat}, Lon: {p.lon}
                                        </div>
                                        <div>2-day: {p.prob2day}</div>
                                        <div>7-day: {p.prob7day}</div>
                                    </div>
                                </Tooltip>
                            </CircleMarker>
                        ))}
                    </>
                )}
            </WorldMap>
        </div>
    );
}
