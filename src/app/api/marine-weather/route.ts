import { NextRequest } from "next/server";
import { scrapeMarineWeather } from "@/utils/scrapeMarineWeather";

export async function GET(req: NextRequest) {
    const results = await scrapeMarineWeather();
    return Response.json(results);
}
