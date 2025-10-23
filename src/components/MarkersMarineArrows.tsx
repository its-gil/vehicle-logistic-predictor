import { Polyline, useMap } from "react-leaflet";
import { MarineWeatherResult } from "@/types";
import { getArrowCoords } from "@/utils/drawWindArrows";

export default function MarkersMarineArrows({ data }: { data?: MarineWeatherResult[] }) {
    const map = useMap();
    const zoom = map.getZoom();
    const getArrowWeight = () => Math.max(1, 2 - zoom * 0.1);

    console.log("Rendering marine arrows with data:", data);

    return (
        <>
            {data?.map((mw, idx) => {
                if (!mw) return null;

                const speed = mw.ocean_current_velocity ?? 0;
                const direction = mw.ocean_current_direction ?? 0;

                // Skip rendering if speed or direction is invalid
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
