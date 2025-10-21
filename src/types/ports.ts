import { CityAlerts } from "./alerts";

export type Port = {
    name: string;
    lat: number;
    lon: number;
    [key: string]: any;
};

export type CityWeatherResult = {
    now: Record<string, any>;
    tomorrow: Record<string, any>;
    week: Record<string, any>;
};

export type PortConditions = {
    port: Port | null;
    portWeather?: CityWeatherResult | null;
    cityAlerts?: CityAlerts | null;
    loading?: boolean;
};

export type DashboardMode = "alerts" | "weather";
