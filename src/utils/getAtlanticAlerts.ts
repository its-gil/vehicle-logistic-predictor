//const citiesAmericaWeather = "https://api.weather.gov/gridpoints/{office}/{grid}/forecast/hourly";
//const citiesAmericaAlerts = "https://api.weather.gov/zones/forecast/{zone}";

const atlanticAlertsUrl = "https://api.weather.gov/alerts/active/region/AT";

export type AtlanticAlert = {
    id: string;
    areaDesc: string;
    event: string;
    headline: string;
    description: string;
    instruction: string;
    severity: string;
    certainty: string;
    urgency: string;
    onset: string;
    effective: string;
    expires: string;
    ends: string;
    senderName: string;
    status: string;
    web: string;
};

export async function getAtlanticAlerts(): Promise<AtlanticAlert[]> {
    const res = await fetch(atlanticAlertsUrl);
    if (!res.ok) return [];
    const data = await res.json();

    if (!data.features || !Array.isArray(data.features)) return [];

    return data.features.map((feature: any) => {
        const p = feature.properties || {};
        return {
            id: p.id,
            areaDesc: p.areaDesc,
            event: p.event,
            headline: p.headline,
            description: p.description,
            instruction: p.instruction,
            severity: p.severity,
            certainty: p.certainty,
            urgency: p.urgency,
            onset: p.onset,
            effective: p.effective,
            expires: p.expires,
            ends: p.ends,
            senderName: p.senderName,
            status: p.status,
            web: p.web,
        };
    });
}
