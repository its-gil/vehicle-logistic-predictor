import { useMap, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { WorldMap } from "./WorldMap";
import LoadingOverlay from "./LoadingOverlay";
import LastUpdateOverlay from "./LastUpdateOverlay";
import { MarineWeatherResult } from "@/types";

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
            <WorldMap center={[40, -30]} zoom={4}>
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

// Helper to draw wind arrows with arrowhead
function getArrowCoords(lat: number, lon: number, direction: number, speed: number): [number, number][][] {
    const length = Math.min(2 + speed * 0.5, 10);
    const rad = (direction * Math.PI) / 180;
    const lat2 = lat + length * Math.cos(rad) * 0.1;
    const lon2 = lon + length * Math.sin(rad) * 0.1;

    const arrowHeadLength = 0.4;
    const arrowAngle = 30 * (Math.PI / 180);

    const leftRad = rad + arrowAngle;
    const rightRad = rad - arrowAngle;

    const leftLat = lat2 - arrowHeadLength * Math.cos(leftRad);
    const leftLon = lon2 - arrowHeadLength * Math.sin(leftRad);

    const rightLat = lat2 - arrowHeadLength * Math.cos(rightRad);
    const rightLon = lon2 - arrowHeadLength * Math.sin(rightRad);

    return [
        [
            [lat, lon],
            [lat2, lon2],
        ],
        [
            [lat2, lon2],
            [leftLat, leftLon],
        ],
        [
            [lat2, lon2],
            [rightLat, rightLon],
        ],
    ];
}
