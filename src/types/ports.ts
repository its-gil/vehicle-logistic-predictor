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

export type CityAlerts = {
    localtime: string;
    alerts: {
        headline: string;
        severity: string;
        urgency: string;
        certainty: string;
        event: string;
        desc: string;
        effective: string;
        expires: string;
    }[];
};
