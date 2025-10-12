import { getMarineWeatherCities } from "@/utils/getMarineWeatherCity";
import { get } from "http";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get("lat") || "");
    const lon = parseFloat(searchParams.get("lon") || "");
    if (isNaN(lat) || isNaN(lon)) {
        return new Response(JSON.stringify({ error: "Invalid coordinates" }), { status: 400 });
    }
    const data = await getMarineWeatherCities(lat, lon);
    return Response.json(data);
}
