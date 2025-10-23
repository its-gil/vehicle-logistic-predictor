import { NextResponse } from "next/server";
import getHistoricalStorms from "@/utils/getHistoricalStorms";

export async function GET() {
    try {
        // Call the getHistoricalStorms function to fetch and parse the CSV data
        const data = await getHistoricalStorms();

        // Return the parsed data as JSON
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching historical storms:", error);

        // Return an error response
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
