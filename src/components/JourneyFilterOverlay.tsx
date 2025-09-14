"use client";
import React from "react";

type FilterType = "journey_id" | "mmsi";

interface MapFilterOverlayProps {
    filterType: FilterType;
    onFilterTypeChange: (type: FilterType) => void;
    selectedId: string;
    onSelectedIdChange: (id: string) => void;
    journeyIds: string[];
    mmsis: string[];
}

export function JourneyFilterOverlay({
    filterType,
    onFilterTypeChange,
    selectedId,
    onSelectedIdChange,
    journeyIds,
    mmsis,
}: MapFilterOverlayProps) {
    const options = filterType === "journey_id" ? journeyIds : mmsis;

    return (
        <div className="bg-zinc-900 bg-opacity-90 rounded shadow-lg p-4 flex flex-col gap-4" style={{ minWidth: 220 }}>
            <div className="flex gap-2 items-center">
                <span className="font-semibold text-white">Filter by:</span>
                <button
                    className={`px-3 py-1 rounded font-semibold ${
                        filterType === "journey_id"
                            ? "bg-yellow-400 text-black"
                            : "bg-zinc-800 text-white hover:bg-zinc-700"
                    }`}
                    onClick={() => onFilterTypeChange("journey_id")}
                >
                    Journey ID
                </button>
                <button
                    className={`px-3 py-1 rounded font-semibold ${
                        filterType === "mmsi" ? "bg-yellow-400 text-black" : "bg-zinc-800 text-white hover:bg-zinc-700"
                    }`}
                    onClick={() => onFilterTypeChange("mmsi")}
                >
                    MMSI
                </button>
            </div>
            <div>
                <label className="font-semibold text-white">
                    {filterType === "journey_id" ? "Journey ID:" : "MMSI:"}
                    <select
                        className="ml-2 p-1 rounded border"
                        value={selectedId}
                        onChange={(e) => onSelectedIdChange(e.target.value)}
                    >
                        {options.map((id) => (
                            <option key={id} value={id}>
                                {id}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
        </div>
    );
}
