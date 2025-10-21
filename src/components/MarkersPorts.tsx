import { CircleMarker, Tooltip } from "react-leaflet";
import { useDelay } from "@/providers/DelayProvider";
import { cityPortList } from "@/constants";
import { useRouter } from "next/navigation";

export default function MarkersPorts() {
    const { delayInfo } = useDelay();
    const router = useRouter();

    let destination = null;
    const destinationCoordinates = delayInfo?.destinationCoordinates;
    if (destinationCoordinates) {
        destination = cityPortList.find(
            (port) => port.lat === destinationCoordinates.lat && port.lon === destinationCoordinates.lon
        );
    }

    return (
        <>
            {cityPortList?.map((port) => {
                const isDestination = destination && port.lat === destination.lat && port.lon === destination.lon;

                return (
                    <CircleMarker
                        key={port.name}
                        center={[port.lat, port.lon]}
                        radius={6}
                        pathOptions={{
                            color: isDestination ? "#0000FF" : "#FFD56B",
                            fillColor: isDestination ? "#0000FF" : "#FFD56B",
                            fillOpacity: 0.8,
                        }}
                        eventHandlers={{
                            click: () => {
                                router.push(`/ports/${port.route.toLowerCase().replace(/\s+/g, "-")}`);
                            },
                        }}
                    >
                        <Tooltip>{port.name}</Tooltip>
                    </CircleMarker>
                );
            })}
        </>
    );
}
