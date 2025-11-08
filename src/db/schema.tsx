import { pgTable, real, timestamp, primaryKey } from "drizzle-orm/pg-core";

export const marineWeatherData = pgTable(
    "marine_weather_data",
    {
        lat: real("lat").notNull(),
        lon: real("lon").notNull(),
        oceanCurrentVelocity: real("ocean_current_velocity"),
        oceanCurrentDirection: real("ocean_current_direction"),
        windSpeed10m: real("wind_speed_10m"),
        windDirection10m: real("wind_direction_10m"),
        waveHeight: real("wave_height"),
        waveDirection: real("wave_direction"),
        wavePeriod: real("wave_period"),
        windWaveHeight: real("wind_wave_height"),
        windWaveDirection: real("wind_wave_direction"),
        windWavePeriod: real("wind_wave_period"),
        swellWaveHeight: real("swell_wave_height"),
        swellWaveDirection: real("swell_wave_direction"),
        swellWavePeriod: real("swell_wave_period"),
        timestamp: timestamp("timestamp").defaultNow().notNull(),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.lat, table.lon] }),
    })
);
