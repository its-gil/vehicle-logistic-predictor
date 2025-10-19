import React from "react";
import { useMemo, useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

import MapWorld from "./MapWorld";
import OverlayLoading from "./OverlayLoading";
import OverlayLegend from "./OverlayLegend";
import OverlayJourneyFilter from "./OverlayJourneyFilter";

import { useShipsPositions } from "@/providers/ShipsPositionsProvider";
import { MapType, ShipPoint } from "@/types";
import { viewLegends } from "@/constants";
import MarkersJourneys from "./MarkersJourneys";

export function MapJourneys(props: MapType) {
    const { journeysFilterType, setJourneysFilterType, selectedJourneyId, setSelectedJourneyId } = props;
    const { shipsPositions, loadingShipsPositions } = useShipsPositions();

    const journeyIds = useMemo(
        () => Array.from(new Set((shipsPositions ?? []).map((d) => d.journey_id))),
        [shipsPositions]
    );
    const mmsis = useMemo(() => Array.from(new Set((shipsPositions ?? []).map((d) => d.mmsi))), [shipsPositions]);

    const filteredData = useMemo(() => {
        if (journeysFilterType === "journey_id") {
            return (shipsPositions ?? []).filter((d) => d.journey_id === selectedJourneyId);
        } else {
            return (shipsPositions ?? []).filter((d) => d.mmsi === selectedJourneyId);
        }
    }, [shipsPositions, journeysFilterType, selectedJourneyId]);

    const grouped = filteredData.reduce<Record<string, ShipPoint[]>>((acc, point) => {
        const key = point.journey_id;
        acc[key] = acc[key] || [];
        acc[key].push(point);
        return acc;
    }, {});

    const [storms, setStorms] = useState<
        { name: string; lat: number; lng: number; intensity: number; timestamp: string }[]
    >([]);

    useEffect(() => {
        fetch("/hurdat2_storm_data_1851_2025.csv")
            .then((res) => res.text())
            .then((csvText) => {
                const lines = csvText.split("\n").filter((l) => l.trim());
                const header = lines[0].split(",");
                const nameIdx = header.findIndex((h) => h.toLowerCase().includes("name"));
                const latIdx = header.findIndex((h) => h.toLowerCase().includes("lat"));
                const lonIdx = header.findIndex((h) => h.toLowerCase().includes("lon"));
                const windIdx = header.findIndex((h) => h.toLowerCase().includes("wind"));
                const timeIdx = header.findIndex((h) => h.toLowerCase().includes("time"));
                const points = lines
                    .slice(1)
                    .map((line) => {
                        const cols = line.split(",");
                        return {
                            name: cols[nameIdx] || "",
                            lat: parseFloat(cols[latIdx]),
                            lng: parseFloat(cols[lonIdx]),
                            intensity: parseInt(cols[windIdx], 10) || 0,
                            timestamp: cols[timeIdx] || "",
                        };
                    })
                    .filter((p) => !isNaN(p.lat) && !isNaN(p.lng) && p.timestamp);
                setStorms(points);
            });
    }, []);

    const currentJourneyPoints = filteredData;
    let journeyStart = null,
        journeyEnd = null;
    if (currentJourneyPoints.length > 0) {
        journeyStart = new Date(currentJourneyPoints[0].date);
        journeyEnd = new Date(currentJourneyPoints[currentJourneyPoints.length - 1].date);
    }

    const stormsInJourney = useMemo(() => {
        if (!journeyStart || !journeyEnd) return [];
        return storms.filter((storm) => {
            const stormTime = new Date(storm.timestamp);
            return stormTime >= journeyStart && stormTime <= journeyEnd;
        });
    }, [storms, journeyStart, journeyEnd]);

    return (
        <div className="relative w-full h-full">
            <MapWorld>
                {(loadingShipsPositions || !grouped) && <OverlayLoading />}
                <div className="absolute top-3 right-6 z-502 pointer-events-auto">
                    <OverlayJourneyFilter
                        filterType={journeysFilterType ?? "journey_id"}
                        onFilterTypeChange={setJourneysFilterType!}
                        selectedId={selectedJourneyId ?? mmsis[0]}
                        onSelectedIdChange={setSelectedJourneyId!}
                        journeyIds={journeyIds}
                        mmsis={mmsis}
                    />
                </div>
                <MarkersJourneys shipPoints={currentJourneyPoints} journeysFilterType={journeysFilterType} />
                <OverlayLegend items={viewLegends.historical} />
            </MapWorld>
        </div>
    );
}
/*
                {journeysFilterType === "journey_id" &&
                    stormsInJourney.map((storm, idx) => (
                        <CircleMarker
                            key={`storm-${idx}`}
                            center={[storm.lat, storm.lng]}
                            radius={10}
                            pathOptions={{ color: "red", fillColor: "red", fillOpacity: 0.7 }}
                        >
                            <Tooltip direction="top" offset={[0, -5]} opacity={1} permanent={false}>
                                <div>
                                    <div className="font-bold text-red-600">{storm.name}</div>
                                    <div>Wind: {storm.intensity} km/h</div>
                                    <div>Time: {storm.timestamp}</div>
                                </div>
                            </Tooltip>
                            <div
                                style={{
                                    position: "absolute",
                                    left: "-8px",
                                    top: "-8px",
                                    pointerEvents: "none",
                                }}
                            >
                                <CloudLightning color="white" size={16} />
                            </div>
                        </CircleMarker>
                    ))}
                    */
