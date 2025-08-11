export type NOAAFeature = {
    id: number;
    lat: number;
    lon: number;
    prob2day: string;
    risk2day: string;
    prob7day: string;
    risk7day: string;
    idp_source?: string;
};

export async function scrapeNOAATropicalPoints(): Promise<NOAAFeature[]> {
    const url =
        "https://mapservices.weather.noaa.gov/tropical/rest/services/tropical/NHC_tropical_weather_summary/MapServer/2/query?where=1%3D1&outFields=*&returnGeometry=true&f=geojson";
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch NOAA data: ${res.status}`);
    const json = await res.json();

    if (!json.features || !Array.isArray(json.features)) return [];

    return json.features.map((feature: any) => ({
        id: feature.id,
        lat: feature.geometry.coordinates[1],
        lon: feature.geometry.coordinates[0],
        prob2day: feature.properties.prob2day,
        risk2day: feature.properties.risk2day,
        prob7day: feature.properties.prob7day,
        risk7day: feature.properties.risk7day,
        idp_source: feature.properties.idp_source,
    }));
}

// Example usage:
// scrapeNOAATropicalPoints().then(console.log);
