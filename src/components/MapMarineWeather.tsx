import "leaflet/dist/leaflet.css";

import MapWorld from "./MapWorld";
import OverlayLoading from "./OverlayLoading";
import OverlayLastUpdate from "./OverlayLastUpdate";
import OverlayLegend from "./OverlayLegend";
import MarkersMarineArrows from "./MarkersMarineArrows";
import MarkersShipDestination from "./MarkerShip";

import { MapType } from "@/types";
import MarkerDestination from "./MarkerDestination";
import MarkerShip from "./MarkerShip";

export function MapMarineWeather(props: MapType) {
    const { marineWeather, legend, timestamp, loading } = props;

    return (
        <div className="relative w-full h-full">
            <MapWorld center={[40, -30]} zoom={3}>
                {loading && <OverlayLoading />}
                <MarkersMarineArrows data={marineWeather} />
                <MarkerShip />
                <MarkerDestination />
                <OverlayLastUpdate timestamp={timestamp} />
                <OverlayLegend items={legend} />
            </MapWorld>
        </div>
    );
}
