import {
    StormMapMode,
    StormPoint,
    NOAAFeature,
    NOAAArrowFeature,
    NOAARegionFeature,
    journeysFilterType,
} from "@/types";
import { MarineWeatherResult } from "@/types";
import { Port } from "@/types";
import { LegendItem } from "@/types";
import { ShipPoint } from "@/types/ships";

export type MapType = {
    stormMapMode?: StormMapMode;
    onStormMapModeChange?: (mode: StormMapMode) => void;
    storms?: StormPoint[];
    noaaPoints?: NOAAFeature[];
    arrows?: NOAAArrowFeature[];
    regions?: NOAARegionFeature[];
    heatmapPoints?: { lat: number; lon: number; intensity?: number }[];
    marineWeather?: MarineWeatherResult[];
    ports?: Port[];
    onPortClick?: (port: Port) => void;
    journeysFilterType?: journeysFilterType;
    setJourneysFilterType?: (type: journeysFilterType) => void;
    selectedJourneyId?: string;
    setSelectedJourneyId?: (id: string) => void;
    legend: LegendItem[];
    timestamp?: string;
    stormsLoading?: boolean;
    loading?: boolean;
};

export type MarkersPotentialStormsProps = {
    noaaPoints?: NOAAFeature[];
    arrows?: NOAAArrowFeature[];
    regions?: NOAARegionFeature[];
};

export type MarkersStormsProps = {
    storms?: StormPoint[];
};

export type MarkersMarineWeatherProps = {
    marineWeather?: MarineWeatherResult[];
};

export type MarkersPortsProps = {
    onPortClick?: (port: Port) => void;
};

export type MarkersJourneysProps = {
    shipPoints: ShipPoint[];
    journeysFilterType?: journeysFilterType;
};

export type MapWorldProps = {
    center?: [number, number];
    zoom?: number;
};
