import { cp } from "fs";

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
    references?: { "@id": string }[];
};

export async function getAtlanticAlerts(): Promise<AtlanticAlert[]> {
    const res = await fetch(atlanticAlertsUrl);
    if (!res.ok) return [];
    const data = await res.json();

    if (!data.features || !Array.isArray(data.features)) return [];

    // Step 1: Map alerts to the AtlanticAlert type
    const alerts: AtlanticAlert[] = data.features.map((feature: any) => {
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

    // Step 2: Transform IDs and track the first appearing ones
    const mostRecentIds = new Map<string, AtlanticAlert>();

    alerts.forEach((alert) => {
        // Extract the base ID (remove the last two segments)
        const baseId = alert.id.split(".").slice(0, -2).join(".");
        // Only add the first alert for each base ID
        if (!mostRecentIds.has(baseId)) {
            mostRecentIds.set(baseId, { ...alert });
        }
    });

    console.log("Fetched Atlantic alerts:", Array.from(mostRecentIds));

    // Step 3: Return only the first appearing alerts
    return Array.from(mostRecentIds.values()).filter(
        (alert) => alert.urgency !== "Past" && alert.severity !== "Minor" && alert.event !== "Small Craft Advisory"
    );
}
