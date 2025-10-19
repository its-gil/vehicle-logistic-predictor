import { CircleMarker, Tooltip } from "react-leaflet";
import { MarkersPortsProps } from "@/types/maps";

export default function MarkersPorts(props: MarkersPortsProps) {
    const { ports, onPortClick } = props;

    return (
        <>
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
        </>
    );
}
