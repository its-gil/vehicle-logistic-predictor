"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { WorldMap } from "./WorldMap";

type Port = {
    name: string;
    lat: number;
    lon: number;
    [key: string]: any;
};

type Props = {
    ports: Port[];
    onPortClick: (port: Port) => void;
};

export function PortsMap(props: Props) {
    const { ports, onPortClick } = props;

    return (
        <div className="relative w-full h-full">
            <WorldMap>
                {ports?.map((port) => (
                    <CircleMarker
                        key={port.name}
                        center={[port.lat, port.lon]}
                        radius={6}
                        pathOptions={{ color: "#FFD56B", fillColor: "#FFD56B", fillOpacity: 0.8 }}
                        eventHandlers={{
                            click: () => onPortClick && onPortClick(port),
                        }}
                    >
                        <Tooltip>{port.name}</Tooltip>
                    </CircleMarker>
                ))}
            </WorldMap>
        </div>
    );
}
