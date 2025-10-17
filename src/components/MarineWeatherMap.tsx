import { useMap, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { WorldMap } from "./WorldMap";
import LoadingOverlay from "./LoadingOverlay";
import LastUpdateOverlay from "./LastUpdateOverlay";
import { MarineWeatherResult } from "@/types";
import { getArrowCoords } from "@/utils/drawWindArrows";

type Props = {
    data: MarineWeatherResult[];
    timestamp: string;
    loading?: boolean;
};

export function MarineWeatherMap(props: Props) {
    const { data, timestamp, loading } = props;

    console.log("loading:", loading);

    return (
        <div className="relative w-full h-full">
            <WorldMap center={[40, -30]} zoom={3}>
                {loading && <LoadingOverlay />}
                <LastUpdateOverlay timestamp={timestamp} />
                <MarineWeatherArrows data={data} />
            </WorldMap>
        </div>
    );
}

function MarineWeatherArrows({ data }: { data: MarineWeatherResult[] }) {
    const map = useMap();
    const zoom = map.getZoom();
    const getArrowWeight = () => Math.max(1, 2 - zoom * 0.1);

    return (
        <>
            {data?.map((mw, idx) => {
                const speed = mw.wind_speed_10m ?? 0;
                const direction = mw.wind_direction_10m ?? 0;
                if (!speed || !direction) return null;
                const arrowLines = getArrowCoords(mw.lat, mw.lon, direction, speed);
                const color = speed > 30 ? "red" : speed > 15 ? "orange" : "green";
                return arrowLines.map((line, i) => (
                    <Polyline
                        key={`marine-${idx}-${i}`}
                        positions={line}
                        color={color}
                        weight={getArrowWeight()}
                        opacity={0.8}
                    />
                ));
            })}
        </>
    );
}
