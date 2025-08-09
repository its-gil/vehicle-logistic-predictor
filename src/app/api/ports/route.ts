import { NextResponse } from "next/server";
import { getAllPorts } from "@/utils/getAllPorts";

export async function GET() {
    try {
        const ports = await getAllPorts();
        return NextResponse.json(ports);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
