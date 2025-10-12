const WEATHERAPI_ALERTS_API_KEY = process.env.WEATHERAPI_ALERTS_API_KEY;

type Alert = {
    headline: string;
    severity: string;
    urgency: string;
    certainty: string;
    event: string;
    desc: string;
    effective: string;
    expires: string;
};
type CityAlertResult = {
    localtime: string;
    alerts: Alert[];
};

function formatDate(dateStr: string): string {
    // Handles formats like "2024-09-01 15:00" or "2024-09-01T15:00"
    if (!dateStr) return "";
    let [date, time] = dateStr.split(/[T ]/);
    if (!time) time = "";
    const [year, month, day] = date.split("-");
    const [hour = "", minute = ""] = time.split(":");
    return `${day}.${month}.${year} ${hour}:${minute}`;
}

export async function getCityAlerts(lat: number, lon: number): Promise<CityAlertResult> {
    try {
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHERAPI_ALERTS_API_KEY}&q=${lat},${lon}&days=1&alerts=yes`;
        const res = await fetch(url);
        if (!res.ok) return { localtime: "", alerts: [] };
        const data = await res.json();

        const localtime = formatDate(data.location?.localtime || "");
        const alerts: Alert[] =
            data.alerts?.alert?.map((a: any) => ({
                headline: a.headline,
                severity: a.severity,
                urgency: a.urgency,
                certainty: a.certainty,
                event: a.event,
                desc: a.desc,
                effective: formatDate(a.effective),
                expires: formatDate(a.expires),
            })) || [];

        return { localtime, alerts };
    } catch (e) {
        return { localtime: "", alerts: [] };
    }
}
