import { cityPortList } from "./cityPortList";

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
    name: string;
    localtime: string;
    alerts: Alert[];
};

export async function scrapeCityAlerts(): Promise<CityAlertResult[]> {
    const results: CityAlertResult[] = [];

    await Promise.all(
        cityPortList.map(async ({ name, lat, lon }) => {
            try {
                const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHERAPI_ALERTS_API_KEY}&q=${lat},${lon}&days=1&alerts=yes`;
                const res = await fetch(url);
                if (!res.ok) return;
                const data = await res.json();

                const localtime = data.location?.localtime || "";
                const alerts: Alert[] =
                    data.alerts?.alert?.map((a: any) => ({
                        headline: a.headline,
                        severity: a.severity,
                        urgency: a.urgency,
                        certainty: a.certainty,
                        event: a.event,
                        desc: a.desc,
                        effective: a.effective,
                        expires: a.expires,
                    })) || [];

                results.push({ name, localtime, alerts });
            } catch (e) {
                // Ignore errors for individual ports
            }
        })
    );

    return results;
}
