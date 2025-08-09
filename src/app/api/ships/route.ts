import { NextRequest, NextResponse } from "next/server";
import { getHistoryAllShips } from "@/utils/getHistoryAllShips";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get("lat") || "");
    const lon = parseFloat(searchParams.get("lon") || "");
    const radius = parseFloat(searchParams.get("radius") || "10");

    if (isNaN(lat) || isNaN(lon)) {
        return NextResponse.json({ error: "Missing or invalid coordinates" }, { status: 400 });
    }

    try {
        const ships = await getHistoryAllShips(lat, lon, radius);
        return NextResponse.json(ships);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
