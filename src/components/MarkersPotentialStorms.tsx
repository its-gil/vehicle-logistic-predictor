import { Marker, Polyline, Polygon, Tooltip } from "react-leaflet";
import { useMapIcons } from "@/hooks/useMapIcons";
import { MarkersPotentialStormsProps } from "@/types/maps";

export default function MarkersPotentialStorms(props: MarkersPotentialStormsProps) {
    const { icons, isLoading } = useMapIcons();
    const { noaaPoints, arrows, regions } = props;

    if (isLoading || !icons || !noaaPoints || !Array.isArray(noaaPoints)) {
        return null;
    }

    function getColor(prob2day: number, prob7day: number): string {
        if (prob2day >= 75) return "red";
        if (prob2day >= 50) return "orange";
        if (prob2day >= 25) return "yellow";
        if (prob7day >= 75) return "purple";
        if (prob7day >= 50) return "blue";
        if (prob7day >= 25) return "green";
        return "gray";
    }

    return (
        <>
            {/* Potential Storms */}
            {regions?.map((region) => (
                <Polygon
                    key={region.id}
                    positions={region.coordinates}
                    pathOptions={{
                        color: getColor(parseFloat(region.prob2day), parseFloat(region.prob7day)),
                        fillColor: getColor(parseFloat(region.prob2day), parseFloat(region.prob7day)),
                        fillOpacity: 0.2,
                    }}
                >
                    <Tooltip sticky>
                        <div>
                            <div>2-day: {region.prob2day}</div>
                            <div>7-day: {region.prob7day}</div>
                        </div>
                    </Tooltip>
                </Polygon>
            ))}
            {arrows?.map((arrow) => (
                <Polyline
                    key={arrow.id}
                    positions={arrow.coordinates}
                    color={getColor(parseFloat(arrow.prob2day), parseFloat(arrow.prob7day))}
                    weight={2}
                >
                    <Tooltip sticky>
                        <div>
                            <div>Basin: {arrow.basin}</div>
                            <div>2-day: {arrow.prob2day}</div>
                            <div>7-day: {arrow.prob7day}</div>
                        </div>
                    </Tooltip>
                </Polyline>
            ))}
            {!isLoading &&
                icons &&
                noaaPoints?.map((p) => (
                    <Marker key={p.id} position={[p.lat, p.lon]} icon={icons.tornado}>
                        <Tooltip direction="top" offset={[0, -5]} opacity={1} permanent={false}>
                            <div>
                                <div>
                                    Lat: {p.lat}, Lon: {p.lon}
                                </div>
                                <div>2-day: {p.prob2day}</div>
                                <div>7-day: {p.prob7day}</div>
                            </div>
                        </Tooltip>
                    </Marker>
                ))}
        </>
        /*
            <HeatmapLayer
                points={(heatmapPoints ?? []).map((p: { lat: number; lon: number; intensity?: number }) => [
                    p.lat,
                    p.lon,
                    p.intensity ?? 1,
                ])}
                max={95}
                radius={5}
                blur={8}
                opacity={0.8}
                */
    );
}
