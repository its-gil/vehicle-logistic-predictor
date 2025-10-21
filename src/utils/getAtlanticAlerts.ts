const atlanticAlertsUrl = "https://api.weather.gov/alerts/active/region/AT";

import { AlertsResponse } from "@/types";
import { formatDate } from "./formatDate";

export async function getAtlanticAlerts(): Promise<AlertsResponse> {
    try {
        const fetchTimestamp = new Date().toISOString();

        const res = await fetch(atlanticAlertsUrl);
        if (!res.ok) {
            return { localtime: fetchTimestamp, alerts: [] };
        }

        const data = await res.json();
        if (!data.features || !Array.isArray(data.features)) {
            return { localtime: fetchTimestamp, alerts: [] };
        }

        // Step 1: Map alerts to the AtlanticAlert type
        const alerts: AlertsResponse["alerts"] = data.features.map((feature: any) => {
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
                onset: formatDate(p.onset),
                effective: formatDate(p.effective),
                expires: formatDate(p.expires),
                ends: formatDate(p.ends),
                senderName: p.senderName,
                status: p.status,
                web: p.web,
            };
        });

        // Step 2: Transform IDs and track the first appearing ones
        const mostRecentIds = new Map<string, AlertsResponse["alerts"][number]>();

        alerts.forEach((alert) => {
            // Extract the base ID (remove the last two segments)
            const baseId = (alert.id ?? "").split(".").slice(0, -2).join(".");
            // Only add the first alert for each base ID
            if (!mostRecentIds.has(baseId)) {
                mostRecentIds.set(baseId, { ...alert });
            }
        });

        // Step 3: Return only the first appearing alerts
        const filteredAlerts = Array.from(mostRecentIds.values()).filter(
            (alert) => alert.urgency !== "Past" && alert.event !== "Small Craft Advisory"
        );

        return { localtime: fetchTimestamp, alerts: filteredAlerts };
    } catch (e) {
        return { localtime: "", alerts: [] };
    }
}
