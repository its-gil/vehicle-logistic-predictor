export type NOAAStorm = {
    id: string;
    name: string;
    classification: string;
    intensity: string;
    pressure: string;
    latitude: string;
    longitude: string;
    latitudeNumeric: number;
    longitudeNumeric: number;
    movementDir: number;
    movementSpeed: number;
    lastUpdate: string;
};

export async function scrapeNOAAActiveStorms(): Promise<NOAAStorm[]> {
    const url = "https://www.nhc.noaa.gov/CurrentStorms.json";
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch NOAA storms: ${res.status}`);
    const json = await res.json();

    // North Atlantic: longitude between -100 and 20, latitude between 0 and 60
    return (json.activeStorms as any[])
        .filter(
            (storm) =>
                storm.longitudeNumeric > -100 &&
                storm.longitudeNumeric < 20 &&
                storm.latitudeNumeric > 0 &&
                storm.latitudeNumeric < 60
        )
        .map((storm) => ({
            id: storm.id,
            name: storm.name,
            classification: storm.classification,
            intensity: storm.intensity,
            pressure: storm.pressure,
            latitude: storm.latitude,
            longitude: storm.longitude,
            latitudeNumeric: storm.latitudeNumeric,
            longitudeNumeric: storm.longitudeNumeric,
            movementDir: storm.movementDir,
            movementSpeed: storm.movementSpeed,
            lastUpdate: storm.lastUpdate,
        }));
}
