export type MarineWeatherResult = {
    lat: number;
    lon: number;
    wind_speed_10m: number | null;
    wind_direction_10m: number | null;
    wave_height: number | null;
    wave_direction: number | null;
    wave_period: number | null;
    wind_wave_height: number | null;
    wind_wave_direction: number | null;
    wind_wave_period: number | null;
    swell_wave_height: number | null;
    swell_wave_direction: number | null;
    swell_wave_period: number | null;
    ocean_current_velocity: number | null;
    ocean_current_direction: number | null;
};

export type MarineWeatherContextType = {
    marineWeather: MarineWeatherResult[];
    timestamp: string;
    loading?: boolean;
};
