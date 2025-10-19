"use client";

import React from "react";
import { useStorms } from "@/providers/StormsProvider";
import OverlayLoading from "./OverlayLoading";
import { useRouter } from "next/navigation";

export default function NumberStorms() {
    const { atlanticStorms, noaaPoints, loadingStorms } = useStorms();
    const router = useRouter();

    // Calculate the total number of storms
    const totalStorms = (atlanticStorms ? atlanticStorms.length : 0) + (noaaPoints ? noaaPoints.length : 0);

    // Determine the dot color based on the number of storms
    const dotColor =
        totalStorms === 0
            ? "bg-blue-500" // Blue for 0 storms
            : totalStorms === 1
            ? "bg-yellow-500" // Yellow for 1 storm
            : "bg-red-500"; // Red for more than 1 storm

    return (
        <button
            onClick={() => router.push("/storms")}
            className="flex flex-col flex-1 justify-between p-6 bg-black text-white rounded-lg shadow-lg hover:bg-zinc-800 transition cursor-pointer text-left"
        >
            <h1 className="text-2xl font-semibold mb-4">Cyclones and Storms</h1>
            {loadingStorms ? (
                <OverlayLoading />
            ) : (
                <div className="flex flex-row items-center justify-between">
                    <p className="text-4xl">{totalStorms}</p>
                    <div className={`w-3 h-3 rounded-full ${dotColor}`} />
                </div>
            )}
        </button>
    );
}
