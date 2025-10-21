import { NextResponse } from "next/server";
import { cityPortList } from "@/constants";

export async function GET(req: Request, { params }: { params: { portName: string } }) {
    const { portName } = params;

    const port = cityPortList.find((p) => {
        return p.route.toLowerCase() === portName.toLowerCase();
    });

    if (!port) {
        return NextResponse.json({ error: "Port not found" }, { status: 404 });
    }
    console.log("Found port data:", port);

    return NextResponse.json(port);
}
