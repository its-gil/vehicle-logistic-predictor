import { scrapeAtlanticAlerts } from "@/utils/scrapeAtlanticAlerts";

export async function GET() {
    const data = await scrapeAtlanticAlerts();
    return Response.json(data);
}
