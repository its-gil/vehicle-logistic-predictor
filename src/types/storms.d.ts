export type StormMapMode = "active_storms" | "cyclone_disturbances";

export type StormsContextType = {
    atlanticStorms: StormPoint[] | null;
    noaaPoints: NOAAFeature[];
    arrows: NOAAArrowFeature[];
    regions: NOAARegionFeature[];
    timestamp: Date;
    loadingStorms?: boolean;
};

export type StormPoint = {
    id?: string;
    lat: number;
    lon: number;
    latitudeNumeric?: number;
    longitudeNumeric?: number;
    name?: string;
    classification?: string;
    intensity?: number;
    movementSpeed?: number;
    movementDir?: number;
    lastUpdate?: string;
    system_status?: string;
    system_status_desc?: string;
    storm_id?: string;
    storm_name?: string;
    datetime?: string;
    max_sustained_wind?: number | null;
};

export type NOAAFeature = { id: string; lat: number; lon: number; prob2day: string; prob7day: string };

export type NOAAArrowFeature = {
    id: string;
    coordinates: [number, number][];
    basin: string;
    prob2day: string;
    prob7day: string;
};

export type NOAARegionFeature = { id: string; coordinates: [number, number][]; prob2day: string; prob7day: string };
