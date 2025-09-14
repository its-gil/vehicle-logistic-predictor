import { scrapeMarineWeatherAverage } from "@/utils/scrapeMarineWeatherAverage";

export async function GET(req: Request) {
    const data = await scrapeMarineWeatherAverage();
    return Response.json(data);
}
