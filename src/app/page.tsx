"use client";
import { useMarineWeather } from "@/providers/MarineWeatherProvider";
import { useStorms } from "@/providers/StormsProvider";
import dynamic from "next/dynamic"; // Import dynamic for client-side rendering

const DashboardMap = dynamic(() => import("@/components/DashboardMap").then((mod) => mod.DashboardMap), { ssr: false });

export default function Home() {
    const { marineWeather, loadingMarineWeather } = useMarineWeather();
    const { atlanticStorms, noaaPoints, arrows, regions, loadingStorms } = useStorms();

    return (
        <div className="relative w-full min-h-0 box-border overflow-hidden" style={{ height: "calc(100vh - 64px)" }}>
            <DashboardMap
                storms={atlanticStorms || []}
                heatmapPoints={[]}
                noaaPoints={noaaPoints || []}
                arrows={arrows || []}
                regions={regions || []}
                marineWeather={marineWeather || []}
                loading={loadingMarineWeather || loadingStorms}
            />
        </div>
    );
}
