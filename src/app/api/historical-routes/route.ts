import { NextResponse } from "next/server";
import { getHistoricalRoutes } from "@/utils/getHistoricalRoutes";

export async function GET() {
    try {
        const data = getHistoricalRoutes();

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching historical routes:", error);

        return NextResponse.json({ error: error }, { status: 500 });
    }
}
