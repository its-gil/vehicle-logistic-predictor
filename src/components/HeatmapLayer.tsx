import { useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet.heat";

type HeatmapPoint = [number, number, number?];

type Props = {
    points: HeatmapPoint[];
    max?: number;
    radius?: number;
    blur?: number;
    opacity?: number;
};

export default function HeatmapLayer({ points, max = 1.0, radius = 25, blur = 15, opacity = 0.6 }: Props) {
    const map = useMap();

    useEffect(() => {
        if (!map || !points?.length) return;

        // @ts-ignore
        const heatLayer = window.L.heatLayer(points, { max, radius, blur, opacity }).addTo(map);

        return () => {
            map.removeLayer(heatLayer);
        };
    }, [map, points, max, radius, blur, opacity]);

    return null;
}
