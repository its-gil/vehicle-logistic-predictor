import { NextResponse } from "next/server";
import { scrapeAdacVollsperrungen } from "@/utils/scrapeAdacVollsperrungen";

export async function GET() {
    try {
        const vollsperrungen = await scrapeAdacVollsperrungen("vollsperrungen.csv");
        return NextResponse.json({ vollsperrungen });
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}
