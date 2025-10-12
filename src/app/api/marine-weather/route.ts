import { NextRequest } from "next/server";
import { getMarineWeather } from "@/utils/getMarineWeather";

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const lat = parseFloat(searchParams.get("lat") || "");
    const lon = parseFloat(searchParams.get("lon") || "");

    if (isNaN(lat) || isNaN(lon)) {
        return Response.json({ error: "Invalid latitude or longitude" }, { status: 400 });
    }

    const results = await getMarineWeather(lat, lon);
    return Response.json(results);
}
