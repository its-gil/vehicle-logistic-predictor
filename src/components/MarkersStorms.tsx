import { MarkersStormsProps } from "@/types/maps";
import { useMapIcons } from "@/hooks/useMapIcons";
import { Marker, Tooltip } from "react-leaflet";
import { formatDate } from "@/utils/formatTimestamp";

export default function MarkersStorms(props: MarkersStormsProps) {
    const { storms } = props;
    const { icons, isLoading } = useMapIcons();

    if (isLoading || !icons || !storms || !Array.isArray(storms)) {
        return null;
    }

    return (
        <>
            {storms.map((storm) => (
                <Marker
                    key={storm.id}
                    position={[storm.latitudeNumeric ?? storm.lat, storm.longitudeNumeric ?? storm.lon]}
                    icon={icons.storm}
                >
                    <Tooltip direction="top" offset={[0, -5]} opacity={1} permanent={false}>
                        <div>
                            <div className="font-bold">{storm.name}</div>
                            <div>
                                <span className="font-semibold">Classification:</span> {storm.classification}
                            </div>
                            <div>
                                <span className="font-semibold">Location:</span> {storm.latitudeNumeric ?? storm.lat},{" "}
                                {storm.longitudeNumeric ?? storm.lon}
                            </div>
                            <div>
                                <span className="font-semibold">Intensity:</span> {storm.intensity}
                            </div>
                            <div>
                                <span className="font-semibold">Speed:</span> {storm.movementSpeed} kt
                            </div>
                            <div>
                                <span className="font-semibold">Direction:</span> {storm.movementDir}&deg;
                            </div>
                            <div>
                                <span className="font-semibold">Last Update:</span> {formatDate(storm.lastUpdate)}
                            </div>
                        </div>
                    </Tooltip>
                </Marker>
            ))}
        </>
    );
}
