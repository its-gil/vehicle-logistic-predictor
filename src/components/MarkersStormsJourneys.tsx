import { useMapIcons } from "@/hooks/useMapIcons";
import { MarkersStormsProps } from "@/types/maps";
import { Marker, Tooltip } from "react-leaflet";

export default function MarkersStormsJourneys(props: MarkersStormsProps) {
    const { storms } = props;
    const { icons } = useMapIcons();

    return (
        <>
            {(storms ?? []).map((storm, idx) => (
                <Marker
                    key={`storm-${idx}`}
                    position={[storm.lat ?? storm.lat, storm.lon ?? storm.lon]}
                    icon={icons?.storm}
                >
                    <Tooltip direction="top" offset={[0, -5]} opacity={1} permanent={false}>
                        <div>
                            <div className="font-bold text-red-600">{storm.name}</div>
                            <div>Wind: {storm.intensity} km/h</div>
                            <div>Time: {storm.datetime}</div>
                        </div>
                    </Tooltip>
                </Marker>
            ))}
        </>
    );
}
