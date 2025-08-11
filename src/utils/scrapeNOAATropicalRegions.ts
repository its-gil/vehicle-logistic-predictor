export type NOAARegionFeature = {
    id: number;
    coordinates: [number, number][]; // [lat, lon]
    prob2day: string;
    prob7day: string;
};

export async function scrapeNOAATropicalRegions(): Promise<NOAARegionFeature[]> {
    const url =
        "https://mapservices.weather.noaa.gov/tropical/rest/services/tropical/NHC_tropical_weather_summary/MapServer/3/query?where=1%3D1&outFields=*&returnGeometry=true&f=geojson";
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch NOAA region data: ${res.status}`);
    const json = await res.json();

    if (!json.features || !Array.isArray(json.features)) return [];

    return json.features.map((feature: any) => ({
        id: feature.id,
        coordinates: feature.geometry.coordinates[0].map((c: [number, number]) => [c[1], c[0]]), // [lat, lon]
        prob2day: feature.properties.prob2day,
        prob7day: feature.properties.prob7day,
    }));
}
