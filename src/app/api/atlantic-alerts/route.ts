import { getAtlanticAlerts } from "@/utils/getAtlanticAlerts";

export async function GET() {
    const data = await getAtlanticAlerts();
    return Response.json(data);
}
