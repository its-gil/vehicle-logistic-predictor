import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

import MapWorld from "./MapWorld";
import OverlayLoading from "./OverlayLoading";
import OverlayLegend from "./OverlayLegend";
import OverlayJourneyFilter from "./OverlayJourneyFilter";

import { useShipsPositions } from "@/providers/HistoricalRoutesProvider";
import { useMapIcons } from "@/hooks/useMapIcons";
import { MapType, ShipPoint, StormPoint } from "@/types";
import { viewLegends } from "@/constants";
import MarkersJourneys from "./MarkersJourneys";
import { getJourneyStartEnd } from "@/utils/getJourneyStartEnd";
import MarkersStormsJourneys from "./MarkersStormsJourneys";
import NumberDaysHistoricalJourney from "./NumberDaysHistoricalJourney";

export function MapJourneys(props: MapType) {
    const { journeysFilterType, setJourneysFilterType, selectedJourneyId, setSelectedJourneyId } = props;
    const { shipsPositions, loadingShipsPositions } = useShipsPositions();
    const { icons, isLoading: iconsLoading } = useMapIcons();

    const [stormsInJourney, setStormsInJourney] = useState<StormPoint[]>([]);
    const [loadingStormsInJourney, setLoadingStormsInJourney] = useState<boolean>(true);

    const [journeyIds, setJourneyIds] = useState<string[]>([]);
    const [mmsis, setMmsis] = useState<string[]>([]);
    const [currentJourneyPoints, setCurrentJourneyPoints] = useState<ShipPoint[]>([]);

    useEffect(() => {
        if (!loadingShipsPositions && shipsPositions) {
            const uniqueJourneyIds = Array.from(new Set(shipsPositions.map((d) => d.journey_id)));
            setJourneyIds(uniqueJourneyIds);

            const uniqueMmsis = Array.from(new Set(shipsPositions.map((d) => d.mmsi)));
            setMmsis(uniqueMmsis);
        }
    }, [loadingShipsPositions, shipsPositions]);

    useEffect(() => {
        if (!loadingShipsPositions && shipsPositions) {
            const filteredPoints =
                journeysFilterType === "mmsi"
                    ? shipsPositions.filter((d) => d.mmsi === selectedJourneyId)
                    : shipsPositions.filter((d) => d.journey_id === selectedJourneyId);
            setCurrentJourneyPoints(filteredPoints);
        }
    }, [loadingShipsPositions, journeysFilterType, selectedJourneyId, shipsPositions]);

    const { journeyStart, journeyEnd, durationInDays } = getJourneyStartEnd(currentJourneyPoints);
    let formattedJourneyStart = journeyStart?.toISOString().split("T")[0] || "";
    let formattedJourneyEnd = journeyEnd?.toISOString().split("T")[0] || "";

    useEffect(() => {
        async function fetchStorms() {
            if (journeysFilterType === "journey_id") {
                if (!formattedJourneyStart || !formattedJourneyEnd) {
                    setStormsInJourney([]);
                    setLoadingStormsInJourney(false);
                    return;
                }
                try {
                    setLoadingStormsInJourney(true);
                    const response = await fetch(
                        `/api/historical-routes-storms?start_date=${formattedJourneyStart}&end_date=${formattedJourneyEnd}`
                    );
                    if (!response.ok) {
                        throw new Error("Failed to fetch storms");
                    }
                    const filteredStorms: StormPoint[] = await response.json();
                    setStormsInJourney(filteredStorms);
                } catch (error) {
                    console.error("Error fetching storms:", error);
                    setStormsInJourney([]);
                } finally {
                    setLoadingStormsInJourney(false);
                }
            } else {
                setStormsInJourney([]);
                setLoadingStormsInJourney(false);
            }
        }

        fetchStorms();
    }, [journeysFilterType, selectedJourneyId, formattedJourneyStart, formattedJourneyEnd]);

    // Combine all loading states
    const isLoading = loadingShipsPositions || loadingStormsInJourney || iconsLoading;

    return (
        <div className="relative w-full h-full">
            <MapWorld zoom={4} center={[30, -30]}>
                {isLoading && <OverlayLoading />}
                <div className="absolute top-3 left-12 z-502 pointer-events-auto">
                    <OverlayJourneyFilter
                        journeyIds={journeyIds}
                        mmsis={mmsis}
                        filterType={journeysFilterType ?? "mmsi"}
                        onFilterTypeChange={setJourneysFilterType!}
                        selectedId={selectedJourneyId ?? mmsis[0]}
                        onSelectedIdChange={setSelectedJourneyId!}
                    />
                </div>
                <div className="absolute top-3 right-6 z-502 pointer-events-auto">
                    <NumberDaysHistoricalJourney days={durationInDays ?? -1} />
                </div>

                {/* Only render markers when icons are loaded */}
                {!iconsLoading && icons && (
                    <>
                        <MarkersJourneys shipPoints={currentJourneyPoints} journeysFilterType={journeysFilterType} />
                        {journeysFilterType === "journey_id" && (
                            <MarkersStormsJourneys storms={stormsInJourney} icons={icons} />
                        )}
                    </>
                )}

                <OverlayLegend items={viewLegends.historical} />
            </MapWorld>
        </div>
    );
}
