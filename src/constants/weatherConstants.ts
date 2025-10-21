export const portsWeatherUnits: Record<string, string> = {
    visibility: "m",
    surface_pressure: "hPa",
    temperature_2m: "°C",
    precipitation: "mm",
    weathercode: "wmo code",
    wind_speed_10m: "km/h",
    wind_gusts_10m: "km/h",
    wind_direction_10m: "°",
    snowfall: "cm",
    snow_depth: "m",
    temperature_2m_max: "°C",
    temperature_2m_min: "°C",
    precipitation_probability_max: "%",
    wind_speed_10m_max: "km/h",
    wind_gusts_10m_max: "km/h",
    wind_direction_10m_dominant: "°",
    snowfall_sum: "cm",
    snow_depth_max: "m",
};

export const marineWeatherFeatureNames = [
    "wind_speed_10m",
    "wind_direction_10m",
    "wave_height",
    "wave_direction",
    "wave_period",
    "wind_wave_height",
    "wind_wave_direction",
    "wind_wave_period",
    "swell_wave_height",
    "swell_wave_direction",
    "swell_wave_period",
    "ocean_current_velocity",
    "ocean_current_direction",
];

export const marineWeatherUnits: Record<string, string> = {
    wind_speed_10m: "km/h",
    wind_direction_10m: "°",
    wave_height: "m",
    wave_direction: "°",
    wave_period: "s",
    wind_wave_height: "m",
    wind_wave_direction: "°",
    wind_wave_period: "s",
    swell_wave_height: "m",
    swell_wave_direction: "°",
    swell_wave_period: "s",
    ocean_current_velocity: "km/h",
    ocean_current_direction: "°",
};

export const WEATHER_MODES = [
    { key: "now", label: "Current" },
    { key: "tomorrow", label: "Tomorrow" },
    { key: "week", label: "Next week" },
] as const;
