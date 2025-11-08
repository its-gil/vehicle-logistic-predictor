import "leaflet/dist/leaflet.css";

import MapWorld from "./MapWorld";
import OverlayLoading from "./OverlayLoading";
import OverlayLastUpdate from "./OverlayLastUpdate";
import OverlayLegend from "./OverlayLegend";
import MarkersMarineArrows from "./MarkersMarineArrows";

import { MapType } from "@/types";
import { viewLegends } from "@/constants/legendConstants";
import MarkerDestination from "./MarkerDestination";
import MarkerShip from "./MarkerShip";
import ButtonFetchMarineWeather from "./ButtonFetchMarineWeather";

export function MapMarineWeather(props: MapType) {
    const { marineWeather, timestamp, loading: isInitialLoading } = props;

    return (
        <div className="relative w-full h-full">
            <MapWorld center={[40, -30]} zoom={3}>
                {isInitialLoading && <OverlayLoading />}
                <ButtonFetchMarineWeather />
                <MarkersMarineArrows data={marineWeather} />
                <MarkerShip />
                <MarkerDestination />
                <OverlayLastUpdate timestamp={timestamp} />
                <OverlayLegend items={viewLegends.marineWeather} />
            </MapWorld>
        </div>
    );
}
