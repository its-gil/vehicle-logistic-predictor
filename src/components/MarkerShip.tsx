import { Marker, Polyline, Tooltip } from "react-leaflet";

import { useDelay } from "@/providers/DelayProvider";
import { useMapIcons } from "@/hooks/useMapIcons";
import drawArcHaversine from "@/utils/drawArcHaversine";

export default function MarkerShip() {
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
            {submittedShipCoordinates &&
                submittedShipCoordinates.lat &&
                submittedShipCoordinates.lon &&
                submittedCourse &&
                rotatedShipIcon &&
                !isLoading &&
                icons && (
                    <Marker
                        position={[submittedShipCoordinates.lat, submittedShipCoordinates.lon]}
                        icon={rotatedShipIcon}
                    >
                        <Tooltip direction="top" offset={[0, -5]} opacity={1} permanent={false}>
                            <div>
                                <div className="font-bold">Ship</div>
                                <div>
                                    <span className="font-semibold">Location:</span> {submittedShipCoordinates.lat},{" "}
                                    {submittedShipCoordinates.lon}
                                </div>
                                <div>
                                    <span className="font-semibold">Course:</span> {submittedCourse}&deg;
                                </div>
                            </div>
                        </Tooltip>
                    </Marker>
                )}
            ;
            {submittedShipCoordinates &&
                submittedDestinationCoordinates &&
                submittedShipCoordinates.lat != null &&
                submittedShipCoordinates.lon != null &&
                submittedDestinationCoordinates.lat != null &&
                submittedDestinationCoordinates.lon != null && (
                    <Polyline
                        positions={drawArcHaversine(
                            [submittedShipCoordinates.lat, submittedShipCoordinates.lon],
                            [submittedDestinationCoordinates.lat, submittedDestinationCoordinates.lon],
                            100 // number of points along the arc
                        )}
                        color="white"
                        weight={1}
                        opacity={0.3}
                    />
                )}
            ;
        </>
    );
}
