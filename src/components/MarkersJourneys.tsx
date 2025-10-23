import React, { useMemo } from "react";
import { Polyline, CircleMarker, Tooltip } from "react-leaflet";
import { MarkersJourneysProps } from "@/types/maps";
import { formatDate } from "@/utils/formatTimestamp";

export default function MarkersJourneys(props: MarkersJourneysProps) {
    const { shipPoints, journeysFilterType } = props;

    // Group points by journey_id or mmsi
    const grouped: Record<string, typeof shipPoints> = {};

    shipPoints.forEach((point) => {
        const key = point.journey_id;
        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(point);
    });

    // Generate a consistent color mapping for each key (journey_id or mmsi)
    const colorMapping = useMemo(() => {
        const keys = Object.keys(grouped);
        const colors = [
            "rgba(255,165,0,0.5)",
            "rgba(255,0,0,0.5)",
            "rgba(0,0,255,0.5)",
            "rgba(0,200,0,0.5)",
            "rgba(128,0,128,0.5)",
            "rgba(0,255,255,0.5)",
            "rgba(255,0,255,0.5)",
            "rgba(128,128,0,0.5)",
            "rgba(0,128,128,0.5)",
            "rgba(128,0,0,0.5)",
        ];
        const mapping: Record<string, string> = {};
        keys.forEach((key, idx) => {
            mapping[key] = colors[idx % colors.length];
        });
        return mapping;
    }, [grouped]);

    return (
        <>
            {Object.entries(grouped).map(([key, points]) => (
                <React.Fragment key={key}>
                    {/* Render the polyline for the journey */}
                    <Polyline
                        positions={points.map((p) => [p.lat, p.lon])}
                        color={colorMapping[key]} // Use the color from the mapping
                        weight={1}
                        opacity={0.7}
                    />
                    {/* Render the markers for each point in the journey */}
                    {points.map((p, i) => (
                        <CircleMarker
                            key={`${key}-${i}`}
                            center={[p.lat, p.lon]}
                            radius={1}
                            pathOptions={{
                                color: colorMapping[key], // Use the color from the mapping
                                fillColor: colorMapping[key],
                                fillOpacity: 0.8,
                            }}
                        >
                            <Tooltip direction="top" offset={[0, -5]} opacity={1} permanent={false}>
                                <div>
                                    <div>MMSI: {p.mmsi}</div>
                                    <div>Journey: {p.journey_id}</div>
                                    <div>Timestamp: {formatDate(p.date)}</div>
                                    <div>
                                        Lat: {p.lat}, Lon: {p.lon}
                                    </div>
                                </div>
                            </Tooltip>
                        </CircleMarker>
                    ))}
                </React.Fragment>
            ))}
        </>
    );
}
