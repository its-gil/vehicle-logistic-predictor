"use client";
import "leaflet/dist/leaflet.css";
import WorldMap from "./MapWorld";
import { MapType } from "@/types";

import OverlayLoading from "./OverlayLoading";
import OverlayLastUpdate from "./OverlayLastUpdate";
import DelayDashboard from "./DelayComponent";
import OverlayLegend from "./OverlayLegend";
import NumberStorms from "./NumberStorms";
import NumberOceanAlerts from "./NumberOceanAlerts";
import NumberCityAlerts from "./NumberCityAlerts";

import { useDelay } from "@/providers/DelayProvider";
import MarkersShipDestination from "./MarkersShipDestination";
import MarkersPotentialStorms from "./MarkersPotentialStorms";
import MarkersStorms from "./MarkersStorms";

export function MapDashboard(props: MapType) {
    const { storms, noaaPoints, arrows, regions, legend, timestamp, loading } = props;

    const { delayInfo, rotatedShipIcon } = useDelay();
    const submittedShipCoordinates = delayInfo?.shipCoordinates;
    const submittedDestinationCoordinates = delayInfo?.destinationCoordinates;
    const submittedCourse = delayInfo?.course;

    return (
        <div className="relative h-full">
            <div className="flex flex-col absolute top-3 left-6 z-502 pointer-events-auto">
                <DelayDashboard />
            </div>
            <div className="flex flex-row gap-4 absolute top-3 right-6 z-502 pointer-events-auto">
                <NumberStorms />
                <NumberOceanAlerts />
                <NumberCityAlerts
                    lat={submittedDestinationCoordinates ? submittedDestinationCoordinates.lat : null}
                    lon={submittedDestinationCoordinates ? submittedDestinationCoordinates.lon : null}
                />
            </div>

            <WorldMap>
                {loading && <OverlayLoading />}
                <OverlayLegend items={legend} />
                <OverlayLastUpdate timestamp={timestamp} />
                <MarkersStorms storms={storms} />
                <MarkersPotentialStorms noaaPoints={noaaPoints} arrows={arrows} regions={regions} />
                <MarkersShipDestination />
            </WorldMap>
        </div>
    );
}
