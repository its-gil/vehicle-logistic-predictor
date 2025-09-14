import { useMemo, useEffect, useState } from "react";
import { Polyline, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { JourneyFilterOverlay } from "./JourneyFilterOverlay";
import { WorldMap } from "./WorldMap";
import { useShipsPositions } from "@/providers/ShipsPositionsProvider";
import React from "react";
import LoadingOverlay from "./LoadingOverlay";
import { CloudLightning } from "lucide-react";

type ShipPoint = { mmsi: string; journey_id: string; lat: number; lon: number; date: string };

type Props = {
    filterType: "journey_id" | "mmsi";
    selectedId: string;
    setFilterType: (type: "journey_id" | "mmsi") => void;
    setSelectedId: (id: string) => void;
};

export function JourneysMap(props: Props) {
    const { filterType, selectedId, setFilterType, setSelectedId } = props;
    const { shipsPositions, loading } = useShipsPositions();

    const journeyIds = useMemo(
        () => Array.from(new Set((shipsPositions ?? []).map((d) => d.journey_id))),
        [shipsPositions]
    );
    const mmsis = useMemo(() => Array.from(new Set((shipsPositions ?? []).map((d) => d.mmsi))), [shipsPositions]);

    const filteredData = useMemo(() => {
        if (filterType === "journey_id") {
            return (shipsPositions ?? []).filter((d) => d.journey_id === selectedId);
        } else {
            return (shipsPositions ?? []).filter((d) => d.mmsi === selectedId);
        }
    }, [shipsPositions, filterType, selectedId]);

    const handleOverlayFilterChange = (type: "journey_id" | "mmsi") => {
        setFilterType(type);
        if (type === "journey_id") {
            setSelectedId(journeyIds[0] ?? "");
        } else {
            setSelectedId(mmsis[0] ?? "");
        }
    };

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
            <div className="absolute top-3 right-6 z-502 pointer-events-auto">
                <JourneyFilterOverlay
                    filterType={filterType}
                    onFilterTypeChange={handleOverlayFilterChange}
                    selectedId={selectedId}
                    onSelectedIdChange={setSelectedId}
                    journeyIds={journeyIds}
                    mmsis={mmsis}
                />
            </div>
            <WorldMap>
                {(loading || !grouped) && <LoadingOverlay />}
                {Object.entries(grouped).map(([key, points], idx) => (
                    <React.Fragment key={key}>
                        <Polyline
                            positions={points.map((p) => [p.lat, p.lon])}
                            color={
                                [
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
                                ][idx % 10]
                            }
                            weight={1}
                            opacity={0.7}
                        />
                        {points.map((p, i) => (
                            <CircleMarker
                                key={key + "-" + i}
                                center={[p.lat, p.lon]}
                                radius={1}
                                pathOptions={{
                                    color: [
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
                                    ][idx % 10],
                                    fillColor: [
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
                                    ][idx % 10],
                                    fillOpacity: 0.8,
                                }}
                            >
                                <Tooltip direction="top" offset={[0, -5]} opacity={1} permanent={false}>
                                    <div>
                                        <div>Timestamp: {p.date}</div>
                                        <div>
                                            Lat: {p.lat}, Lon: {p.lon}
                                        </div>
                                        <div>MMSI: {p.mmsi}</div>
                                        <div>Journey: {p.journey_id}</div>
                                    </div>
                                </Tooltip>
                            </CircleMarker>
                        ))}
                    </React.Fragment>
                ))}
                {/* Storm icons for storms in journey timeframe */}
                {filterType === "journey_id" &&
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
            </WorldMap>
        </div>
    );
}
