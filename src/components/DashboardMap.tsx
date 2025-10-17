"use client";
import { useState } from "react";
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import LastUpdateOverlay from "./LastUpdateOverlay";
import { StormFilterOverlay } from "./StormFilterOverlay";
import { HeatmapLayer } from "./HeatmapLayer";
import { WorldMap } from "./WorldMap";
import LoadingOverlay from "./LoadingOverlay";
import DelayDashboard from "@/components/DelayComponent";
import { formatTimestamp } from "@/utils/formatTimestamp";
import { StormPoint, NOAAFeature, NOAAArrowFeature, NOAARegionFeature, MarineWeatherResult } from "@/types";

import { getArrowCoords } from "@/utils/drawWindArrows";
import NumberStormsDashboard from "./NumberStormsComponent";
import NumberOceanAlerts from "./NumberOceanAlerts";
import NumberCityAlerts from "./NumberCityAlerts";

type DashboardMapProps = {
    storms: StormPoint[];
    heatmapPoints?: { lat: number; lon: number; intensity: number }[];
    noaaPoints: NOAAFeature[];
    arrows: NOAAArrowFeature[];
    regions: NOAARegionFeature[];
    marineWeather: MarineWeatherResult[];
    loading?: boolean;
};

function getColor(prob2day: string, prob7day: string) {
    const p2 = parseInt(prob2day.replace("%", ""), 10) || 0;
    const p7 = parseInt(prob7day.replace("%", ""), 10) || 0;
    return p2 > 60 || p7 > 60 ? "red" : "yellow";
}

export function DashboardMap(props: DashboardMapProps) {
    const { storms, heatmapPoints, noaaPoints, arrows, regions, marineWeather, loading } = props;

    // State to hold the submitted data
    const [submittedShipCoordinates, setSubmittedShipCoordinates] = useState<{ lat: number; lon: number } | null>(null);
    const [submittedDestinationCoordinates, setSubmittedDestinationCoordinates] = useState<{
        lat: number;
        lon: number;
    } | null>(null);
    const [submittedCourse, setSubmittedCourse] = useState<string | null>(null);

    // Logic moved from page.tsx
    const handleDelaySubmit = (
        shipCoordinates: { lat: number; lon: number } | null,
        destinationCoordinates: { lat: number; lon: number } | null,
        course: string | null
    ) => {
        setSubmittedShipCoordinates(shipCoordinates);
        setSubmittedDestinationCoordinates(destinationCoordinates);
        setSubmittedCourse(course);
    };

    return (
        <div className="relative h-full">
            {/* Overlay for DelayDashboard */}
            <div className="flex flex-col absolute top-3 left-6 z-502 pointer-events-auto">
                <DelayDashboard onSubmit={handleDelaySubmit} />
            </div>
            <div className="flex flex-row gap-4 absolute top-3 right-6 z-502 pointer-events-auto">
                <NumberStormsDashboard />
                <NumberOceanAlerts />
                <NumberCityAlerts
                    lat={submittedDestinationCoordinates ? submittedDestinationCoordinates.lat : null}
                    lon={submittedDestinationCoordinates ? submittedDestinationCoordinates.lon : null}
                />
            </div>
            <LastUpdateOverlay timestamp={formatTimestamp(new Date())} />
            <WorldMap>
                {/* Loading Overlays */}
                {loading && <LoadingOverlay />}
                {/* Ship and Destination Markers */}
                {submittedShipCoordinates && submittedShipCoordinates.lat && submittedShipCoordinates.lon && (
                    <CircleMarker
                        center={[submittedShipCoordinates.lat, submittedShipCoordinates.lon]}
                        radius={10}
                        pathOptions={{
                            color: "blue",
                            fillColor: "blue",
                            fillOpacity: 0.8,
                        }}
                    >
                        <Tooltip direction="top" offset={[0, -5]} opacity={1} permanent={false}>
                            <div>
                                <div className="font-bold">Ship</div>
                                <div>
                                    <span className="font-semibold">Location:</span> {submittedShipCoordinates.lat},{" "}
                                    {submittedShipCoordinates.lon}
                                </div>
                            </div>
                        </Tooltip>
                    </CircleMarker>
                )}
                {submittedDestinationCoordinates &&
                    submittedDestinationCoordinates.lat !== null &&
                    submittedDestinationCoordinates.lon !== null && (
                        <CircleMarker
                            center={[submittedDestinationCoordinates.lat, submittedDestinationCoordinates.lon]}
                            radius={10}
                            pathOptions={{
                                color: "green",
                                fillColor: "green",
                                fillOpacity: 0.8,
                            }}
                        >
                            <Tooltip direction="top" offset={[0, -5]} opacity={1} permanent={false}>
                                <div>
                                    <div className="font-bold">Destination</div>
                                    <div>
                                        <span className="font-semibold">Location:</span>{" "}
                                        {submittedDestinationCoordinates?.lat}, {submittedDestinationCoordinates?.lon}
                                    </div>
                                </div>
                            </Tooltip>
                        </CircleMarker>
                    )}
                {submittedShipCoordinates && submittedDestinationCoordinates && (
                    <Polyline
                        positions={[
                            [submittedShipCoordinates.lat, submittedShipCoordinates.lon],
                            [submittedDestinationCoordinates.lat, submittedDestinationCoordinates.lon],
                        ]}
                        color="blue"
                        weight={3}
                        opacity={0.7}
                    />
                )}
                {/* Active Storms */}
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
                                    <span className="font-semibold">Classification:</span> {storm.classification}
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
                                    <span className="font-semibold">Direction:</span> {storm.movementDir}&deg;
                                </div>
                                <div>
                                    <span className="font-semibold">Last Update:</span> {storm.lastUpdate}
                                </div>
                            </div>
                        </Tooltip>
                    </CircleMarker>
                ))}
                {/* Potential Storms */}
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
                {/* Marine Weather */}
                {marineWeather?.map((mw, idx) => {
                    const speed = mw.wind_speed_10m ?? 0;
                    const direction = mw.wind_direction_10m ?? 0;
                    if (!speed || !direction) return null;
                    const arrowLines = getArrowCoords(mw.lat, mw.lon, direction, speed);
                    const color = speed > 30 ? "red" : speed > 15 ? "orange" : "green";
                    return arrowLines.map((line, i) => (
                        <Polyline key={`marine-${idx}-${i}`} positions={line} color={color} weight={2} opacity={0.8} />
                    ));
                })}
            </WorldMap>
        </div>
    );
}
