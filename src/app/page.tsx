"use client";

import { useStorms } from "@/providers/StormsProvider";
import dynamic from "next/dynamic"; // Import dynamic for client-side rendering
import { formatTimestamp } from "@/utils/formatTimestamp";

const MapDashboard = dynamic(() => import("@/components/MapDashboard").then((mod) => mod.MapDashboard), { ssr: false });

export default function Home() {
    const { atlanticStorms, noaaPoints, arrows, regions, timestamp, loadingStorms } = useStorms();

    return (
        <div className="relative w-full min-h-0 box-border overflow-hidden" style={{ height: "calc(100vh - 64px)" }}>
            <MapDashboard
                storms={atlanticStorms || []}
                heatmapPoints={[]}
                noaaPoints={noaaPoints || []}
                arrows={arrows || []}
                regions={regions || []}
                timestamp={formatTimestamp(timestamp)}
                loading={loadingStorms}
            />
        </div>
    );
}
