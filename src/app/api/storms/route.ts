import { NextRequest } from "next/server";
import { getActiveStorms } from "@/utils/getActiveStorms";

export async function GET(req: NextRequest) {
    try {
        const storms = await getActiveStorms();
        return Response.json(storms);
    } catch (e) {
        return Response.json({ error: "Failed to fetch storms" }, { status: 500 });
    }
}
