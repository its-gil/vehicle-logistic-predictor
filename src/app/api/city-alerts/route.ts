import { getCityAlerts } from "@/utils/getCityAlerts";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
        return new Response(JSON.stringify({ error: "Missing required parameters: lat, lon" }), { status: 400 });
    }

    const result = await getCityAlerts(Number(lat), Number(lon));
    return new Response(JSON.stringify(result), { status: 200 });
}
