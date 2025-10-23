import { AlertsResponse } from "@/types";

const WEATHERAPI_ALERTS_API_KEY = process.env.WEATHERAPI_ALERTS_API_KEY;

import { formatDate } from "./formatTimestamp";

export async function getCityAlerts(lat: number, lon: number): Promise<AlertsResponse> {
    try {
        const fetchTimestamp = new Date().toISOString();

        const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHERAPI_ALERTS_API_KEY}&q=${lat},${lon}&days=1&alerts=yes`;

        const res = await fetch(url);
        if (!res.ok) return { localtime: fetchTimestamp, alerts: [] };

        const data = await res.json();
        if (!data.alerts || !Array.isArray(data.alerts.alert)) {
            return { localtime: fetchTimestamp, alerts: [] };
        }

        // const localtime = formatDate(data.location?.localtime || "");

        const rawAlerts: AlertsResponse["alerts"] =
            data.alerts?.alert?.map((a: any) => ({
                identifier: a.identifier,
                headline: a.headline,
                severity: a.severity,
                urgency: a.urgency,
                certainty: a.certainty,
                event: a.event,
                description: a.desc,
                effective: formatDate(a.effective),
                expires: formatDate(a.expires),
            })) || [];

        // Step 1: Extract base IDs and keep only the last entries
        const lastAlertsByBaseId = new Map<string, AlertsResponse["alerts"][number]>();

        rawAlerts.forEach((alert) => {
            // Extract the base ID (last three groups delimited by "-")
            const baseId = typeof alert.id === "string" ? alert.id.split("-").slice(-3).join("-") : "";
            // Always overwrite to keep the last entry for each base ID
            lastAlertsByBaseId.set(baseId, alert);
        });

        // Step 2: Return the filtered alerts
        const alerts = Array.from(lastAlertsByBaseId.values());

        return { localtime: fetchTimestamp, alerts: alerts };
    } catch (e) {
        return { localtime: "", alerts: [] };
    }
}
