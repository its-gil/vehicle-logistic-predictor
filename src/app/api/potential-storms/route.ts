import { NextResponse } from "next/server";
import { getPotentialPoints } from "@/utils/getPotentialPoints";
import { getPotentialArrows } from "@/utils/getPotentialArrows";
import { getPotentialRegions } from "@/utils/getPotentialRegions";

export async function GET() {
    try {
        const [points, arrows, regions] = await Promise.all([
            getPotentialPoints(),
            getPotentialArrows(),
            getPotentialRegions(),
        ]);

        // Return the combined data
        return NextResponse.json({
            points,
            arrows,
            regions,
        });
    } catch (error) {
        console.error("Error fetching potential storm data:", error);
        return NextResponse.json({ error: "Failed to fetch potential storm data" }, { status: 500 });
    }
}
