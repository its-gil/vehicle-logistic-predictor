import { NextRequest } from "next/server";
import { scrapeNOAAActiveStorms } from "@/utils/scrapeNOAAActiveStorms";

export async function GET(req: NextRequest) {
    try {
        const storms = await scrapeNOAAActiveStorms();
        return Response.json(storms);
    } catch (e) {
        return Response.json({ error: "Failed to fetch storms" }, { status: 500 });
    }
}
