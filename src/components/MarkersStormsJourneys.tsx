import { useMapIcons } from "@/hooks/useMapIcons";
import { MarkersStormsProps } from "@/types/maps";
import { Marker, Tooltip } from "react-leaflet";

export default function MarkersStormsJourneys(props: MarkersStormsProps) {
    const { storms } = props;
    const { icons, isLoading } = useMapIcons();

    if (isLoading || !icons) {
        return null;
    }

    return (
        <>
            {(storms ?? []).map((storm, idx) => (
                <Marker key={`storm-${idx}`} position={[storm.lat, storm.lon]} icon={icons.storm}>
                    <Tooltip direction="top" offset={[0, -5]} opacity={1} permanent={false}>
                        <div>
                            <div className="font-bold text-red-600">{storm.name}</div>
                            <div>Storm Name: {storm.storm_name}</div>
                            <div>Time: {storm.datetime}</div>
                            <div>Max Sustained Wind: {storm.max_sustained_wind} km/h</div>
                            <div>Latitude: {storm.lat}</div>
                            <div>Longitude: {storm.lon}</div>
                            <div>System Status: {storm.system_status}</div>
                            <div>System Status Description: {storm.system_status_desc}</div>
                        </div>
                    </Tooltip>
                </Marker>
            ))}
        </>
    );
}
