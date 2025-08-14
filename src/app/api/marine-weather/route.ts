import { scrapeMarineWeather } from "@/utils/scrapeMarineWeather";

export async function GET(req: Request) {
    const data = await scrapeMarineWeather();
    return Response.json(data);
}
