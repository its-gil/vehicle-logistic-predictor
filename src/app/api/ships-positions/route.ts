import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Papa from "papaparse";

export async function GET() {
    const filePath = path.join(process.cwd(), "public", "arrived_journeys_positions.csv");
    const csv = fs.readFileSync(filePath, "utf-8");
    const { data } = Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
    });
    console.log("Loaded positions data:", data.length, "rows");
    return NextResponse.json(data);
}
