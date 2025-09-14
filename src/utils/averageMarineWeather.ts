type MarineWeatherResult = {
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
    [key: string]: number | null | undefined;
};

type MarineWeatherAverages = {
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

export function averageMarineWeather(data: MarineWeatherResult[]): MarineWeatherAverages {
    const keys: (keyof MarineWeatherAverages)[] = [
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

    const averages: Partial<MarineWeatherAverages> = {};

    keys.forEach((key) => {
        const values = data.map((item) => item[key]).filter((v): v is number => typeof v === "number");
        averages[key] = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : null;
    });

    return averages as MarineWeatherAverages;
}
