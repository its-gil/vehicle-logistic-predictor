import { NextResponse } from "next/server";
import { getHistoricalRoutesStorms } from "@/utils/getHistoricalRoutesStorms";

export async function GET(req: Request) {
    try {
        // Extract start_date and end_date from the query parameters
        const url = new URL(req.url);
        const start_date = url.searchParams.get("start_date");
        const end_date = url.searchParams.get("end_date");

        if (!start_date || !end_date) {
            return NextResponse.json({ error: "Missing start_date or end_date" }, { status: 400 });
        }

        // Pass the dates to the getHistoricalRoutesStorms function
        const data = getHistoricalRoutesStorms(start_date, end_date);

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching historical routes storms:", error);

        return NextResponse.json({ error: error }, { status: 500 });
    }
}
