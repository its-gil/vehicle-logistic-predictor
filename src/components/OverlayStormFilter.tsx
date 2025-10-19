"use client";
import React from "react";
import { StormMapMode } from "@/types";

interface StormFilterOverlayProps {
    mapMode: StormMapMode;
    onMapModeChange: (mode: StormMapMode) => void;
}

export default function OverlayStormFilter({ mapMode, onMapModeChange }: StormFilterOverlayProps) {
    return (
        <div className="bg-zinc-900 bg-opacity-10 rounded shadow-lg p-4 flex flex-col gap-4" style={{ minWidth: 220 }}>
            <div className="flex gap-2 items-center">
                <button
                    className={`px-3 py-1 rounded font-semibold ${
                        mapMode === "active_storms"
                            ? "bg-yellow-400 text-black"
                            : "bg-zinc-800 text-white hover:bg-zinc-700"
                    }`}
                    onClick={() => onMapModeChange("active_storms")}
                >
                    Active Storms
                </button>
                <button
                    className={`px-3 py-1 rounded font-semibold ${
                        mapMode === "cyclone_disturbances"
                            ? "bg-yellow-400 text-black"
                            : "bg-zinc-800 text-white hover:bg-zinc-700"
                    }`}
                    onClick={() => onMapModeChange("cyclone_disturbances")}
                >
                    Potential Cyclone Areas
                </button>
            </div>
        </div>
    );
}
