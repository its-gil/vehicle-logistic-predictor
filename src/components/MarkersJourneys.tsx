import React from "react";
import { Polyline, CircleMarker, Tooltip } from "react-leaflet";
import { MarkersJourneysProps } from "@/types/maps";

export default function MarkersJourneys(props: MarkersJourneysProps) {
    const { shipPoints, journeysFilterType } = props;

    const grouped: Record<string, typeof shipPoints> = {};

    shipPoints.forEach((point) => {
        const key = journeysFilterType === "journey_id" ? point.journey_id : point.mmsi;
        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(point);
    });

    return (
        <>
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
        </>
    );
}
