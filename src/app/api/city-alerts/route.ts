import { scrapeCityAlerts } from "@/utils/scrapeCityAlerts";

export async function GET() {
    const data = await scrapeCityAlerts();
    return Response.json(data);
}
