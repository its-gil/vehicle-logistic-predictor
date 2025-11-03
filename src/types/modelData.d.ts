import { MarineWeatherInput } from "./marineWeather";
import { StormPoint } from "./storms";

export type PrepareModelDataInput = {
    lat1: number; // Latitude of the first point
    lon1: number; // Longitude of the first point
    lat2: number; // Latitude of the second point
    lon2: number; // Longitude of the second point
    course: number; // Ship's course in degrees
    activeStorms: StormPoint[]; // Active storms data
    marineWeather: MarineWeatherInput; // Marine weather data
};

export type PrepareModelDataOutput = {
    storm_wind: string;
    wind_wave_effect_forward: string;
    wind_wave_effect_side: string;
    swell_effect_forward: string;
    swell_effect_side: string;
    ocean_current_effect_forward: string;
    ocean_current_effect_side: string;
    swell_impact: string;
    wind_wave_energy: string;
    distance_to_destination_nm: string;
    distance_to_storm_nm: string;
};

export type DelayInfo = {
    shipCoordinates: { lat: number | null; lon: number | null };
    destinationCoordinates: { lat: number | null; lon: number | null };
    course: string;
    delay: string;
};

export type DelayContextType = {
    delayInfo: DelayInfo | null;
    setDelayInfo: (info: DelayInfo) => void;
    rotatedShipIcon: L.DivIcon | null;
};
