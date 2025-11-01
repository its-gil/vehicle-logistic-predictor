import { NextResponse } from "next/server";
import { cityPortList } from "@/constants";

export async function GET(req: Request, context: { params: any }) {
    // Await params per Next.js dynamic API requirement
    const params = await context.params;
    const portName = String(params?.portName ?? "");

    if (!portName) {
        return NextResponse.json({ error: "Port not specified" }, { status: 400 });
    }

    const port = cityPortList.find((p) => p.route.toLowerCase() === portName.toLowerCase());

    if (!port) {
        return NextResponse.json({ error: "Port not found" }, { status: 404 });
    }

    console.log("Found port data:", port);
    return NextResponse.json(port);
}
