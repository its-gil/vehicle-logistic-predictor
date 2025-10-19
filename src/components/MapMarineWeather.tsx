import "leaflet/dist/leaflet.css";

import MapWorld from "./MapWorld";
import OverlayLoading from "./OverlayLoading";
import OverlayLastUpdate from "./OverlayLastUpdate";
import OverlayLegend from "./OverlayLegend";
import MarkersMarineArrows from "./MarkersMarineArrows";
import MarkersShipDestination from "./MarkersShipDestination";

import { MapType } from "@/types";
import { viewLegends } from "@/constants/legendConstants";

export function MapMarineWeather(props: MapType) {
    const { marineWeather, timestamp, loading } = props;

    return (
        <div className="relative w-full h-full">
            <MapWorld center={[40, -30]} zoom={3}>
                {loading && <OverlayLoading />}
                <MarkersMarineArrows data={marineWeather} />
                <MarkersShipDestination />
                <OverlayLastUpdate timestamp={timestamp} />
                <OverlayLegend items={viewLegends.marineWeather} />
            </MapWorld>
        </div>
    );
}
