"use client";
import { useState } from "react";
import BarChart from "@/components/BarChart";
import RingChart from "@/components/RingChart";

export default function Home() {
    const [percentage, setPercentage] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    async function refreshBlockedPercentage() {
        setLoading(true);
        try {
            const res = await fetch("/api/dashboard");
            const data = await res.json();
            console.log("API response:", data);
            const match = typeof data.percentage === "string" ? data.percentage.match(/(\d+(\.\d+)?)/) : null;
            console.log("Matched percentage:", match);
            setPercentage(match ? parseFloat(match[1]) / 100 : null);
        } catch {
            setPercentage(null);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="font-sans grid grid-rows-[10px_1fr_10px] items-center justify-items-center p-8 pb-8 gap-8 sm:p-4">
            <header className="flex items-center justify-between w-full">
                <button
                    onClick={refreshBlockedPercentage}
                    className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
                    disabled={loading}
                >
                    {loading ? "Refreshing..." : "Refresh"}
                </button>
            </header>
            <main className="flex flex-col items-center w-full">
                <div className="flex flex-wrap justify-center gap-16 w-full">
                    <RingChart value={percentage ?? 0.75} comment="Potentially blocked vehicles" />
                    <RingChart value={percentage ?? 0.75} comment="Potentially blocked vehicles" />
                    <RingChart value={percentage ?? 0.75} comment="Potentially blocked vehicles" />
                    <RingChart value={percentage ?? 0.75} comment="Potentially blocked vehicles" />
                    <RingChart value={percentage ?? 0.75} comment="Potentially blocked vehicles" />
                    <RingChart value={percentage ?? 0.75} comment="Potentially blocked vehicles" />
                    <BarChart labels={["A", "B", "C", "D"]} values={[12, 4, 13, 2]} />
                </div>
            </main>
        </div>
    );
}
