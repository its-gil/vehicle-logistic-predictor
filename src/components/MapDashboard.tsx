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
import MarkersPotentialStorms from "./MarkersPotentialStorms";
import MarkersStorms from "./MarkersStorms";
import MarkerDestination from "./MarkerDestination";
import MarkerShip from "./MarkerShip";
import { viewLegends } from "@/constants/legendConstants";

export function MapDashboard(props: MapType) {
    const { storms, noaaPoints, arrows, regions, timestamp, loading } = props;

    const { delayInfo } = useDelay();
    const submittedDestinationCoordinates = delayInfo?.destinationCoordinates;

    return (
        <div className="relative h-full">
            <WorldMap>
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
                {loading && <OverlayLoading />}
                <OverlayLegend items={viewLegends.dashboard} />
                <OverlayLastUpdate timestamp={timestamp} />
                <MarkersPotentialStorms noaaPoints={noaaPoints} arrows={arrows} regions={regions} />
                <MarkersStorms storms={storms} />
                <MarkerShip />
                <MarkerDestination />
            </WorldMap>
        </div>
    );
}
