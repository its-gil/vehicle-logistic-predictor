"use client";
import { useState, useEffect } from "react";
import BarChart from "@/components/BarChart";
import RingChart from "@/components/RingChart";

export default function Home() {
    const [percentage, setPercentage] = useState<number | null>(null);
    const [explanation, setExplanation] = useState<string>("");
    const [loading, setLoading] = useState(false);

    async function refreshBlockedPercentage() {
        setLoading(true);
        try {
            const res = await fetch("/api/dashboard");
            const data = await res.json();
            // Extract numeric value from string like "23%"
            const match = typeof data.percentage === "string" ? data.percentage.match(/(\d+(\.\d+)?)/) : null;
            setPercentage(match ? parseFloat(match[1]) / 100 : null);
            setExplanation(data.explanation || "");
        } catch {
            setPercentage(null);
            setExplanation("");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="font-sans grid grid-rows-[10px_1fr_10px] items-center justify-items-center p-8 pb-8 gap-8 sm:p-4">
            <header className="flex items-center justify-between w-full gap-4">
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
                    <RingChart value={percentage ?? 0} comment="Potentiell blockierte Fahrzeuge" />
                </div>
                {explanation && (
                    <div className="mt-8 w-full max-w-2xl bg-zinc-100 dark:bg-zinc-800 rounded p-4 text-sm whitespace-pre-line">
                        <strong>Erklärung:</strong>
                        <br />
                        {explanation}
                    </div>
                )}
            </main>
        </div>
    );
}
