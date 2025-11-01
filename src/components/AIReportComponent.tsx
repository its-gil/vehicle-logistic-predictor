import { useStorms } from "@/providers/StormsProvider";
import { AlertsResponse } from "@/types/alerts";
import { useEffect, useState } from "react";

export default function AIReportComponent() {
    const { atlanticStorms, noaaPoints, arrows, regions, timestamp, loadingStorms } = useStorms();

    const [alerts, setAlerts] = useState<AlertsResponse["alerts"]>([]); // Use the correct type for alerts
    const [loadingAlerts, setLoadingAlerts] = useState<boolean>(true);

    useEffect(() => {
        async function fetchAlerts() {
            setLoadingAlerts(true);
            try {
                const res = await fetch("/api/marine-alerts");
                if (!res.ok) throw new Error(`Failed to fetch marine alerts: ${res.status}`);
                const fetchedAlerts: AlertsResponse = await res.json();
                setAlerts(fetchedAlerts.alerts || []);
            } catch (err) {
                console.error("Error fetching marine alerts:", err);
                setAlerts([]);
            } finally {
                setLoadingAlerts(false);
            }
        }

        fetchAlerts();
    }, []);

    return <div>AI Report Component</div>;
}
