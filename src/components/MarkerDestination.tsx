import { Marker, Polyline, Tooltip } from "react-leaflet";

import { useDelay } from "@/providers/DelayProvider";
import { useMapIcons } from "@/hooks/useMapIcons";
import drawArcHaversine from "@/utils/drawArcHaversine";

export default function MarkerDestination() {
    const { icons, isLoading } = useMapIcons();
    const { delayInfo, rotatedShipIcon } = useDelay();
    const submittedShipCoordinates = delayInfo?.shipCoordinates;
    const submittedDestinationCoordinates = delayInfo?.destinationCoordinates;
    const submittedCourse = delayInfo?.course;

    if (isLoading || !icons) {
        return null;
    }

    return (
        <>
            {submittedDestinationCoordinates &&
                submittedDestinationCoordinates.lat !== null &&
                submittedDestinationCoordinates.lon !== null &&
                !isLoading &&
                icons?.destination && (
                    <Marker
                        position={[submittedDestinationCoordinates.lat, submittedDestinationCoordinates.lon]}
                        icon={icons.destination}
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
                    </Marker>
                )}
        </>
    );
}
