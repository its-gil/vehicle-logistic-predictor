import { Polyline, useMap } from "react-leaflet";
import { MarineWeatherResult } from "@/types";
import { getArrowCoords } from "@/utils/drawWindArrows";

export default function MarkersMarineArrows({ data }: { data?: MarineWeatherResult[] }) {
    const map = useMap();
    const zoom = map.getZoom();
    const getArrowWeight = () => Math.max(1, 2 - zoom * 0.1);

    return (
        <>
            {data?.map((mw, idx) => {
                if (!mw) return null;

                const direction = mw.ocean_current_direction ?? 0;
                const speed = mw.ocean_current_velocity ?? 0;

                if (!speed || !direction) return null;

                const arrowLines = getArrowCoords(mw.lat, mw.lon, direction, speed);
                const color = speed > 2 ? "red" : speed > 1 ? "orange" : "green";

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
