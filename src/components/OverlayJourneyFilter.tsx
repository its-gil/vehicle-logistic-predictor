"use client";
import React from "react";

type FilterType = "journey_id" | "mmsi";

interface MapFilterOverlayProps {
    journeyIds: string[];
    mmsis: string[];
    filterType: FilterType;
    onFilterTypeChange: (type: FilterType) => void;
    selectedId: string;
    onSelectedIdChange: (id: string) => void;
}

export default function OverlayJourneyFilter({
    journeyIds,
    mmsis,
    filterType,
    onFilterTypeChange,
    selectedId,
    onSelectedIdChange,
}: MapFilterOverlayProps) {
    const sortedMmsis = [...mmsis].sort((a, b) => a.localeCompare(b));

    const options = filterType === "journey_id" ? journeyIds : sortedMmsis;

    const handleFilterTypeChange = (type: FilterType) => {
        onFilterTypeChange(type);

        const firstId = type === "journey_id" ? journeyIds[0] : sortedMmsis[0];
        if (firstId) {
            onSelectedIdChange(firstId);
        }
    };

    return (
        <div className="flex flex-col gap-6 px-4 py-6 bg-zinc-900 rounded-lg shadow-lg" style={{ minWidth: 220 }}>
            <div className="flex gap-4 items-center">
                <span className="text-sm font-semibold text-white">Filter by</span>
                <button
                    className={`px-3 py-2 rounded font-semibold cursor-pointer ${
                        filterType === "mmsi" ? "bg-yellow-400 text-black" : "bg-zinc-800 text-white hover:bg-zinc-700"
                    }`}
                    onClick={() => handleFilterTypeChange("mmsi")}
                >
                    MMSI
                </button>
                <button
                    className={`px-3 py-2 rounded font-semibold cursor-pointer ${
                        filterType === "journey_id"
                            ? "bg-yellow-400 text-black"
                            : "bg-zinc-800 text-white hover:bg-zinc-700"
                    }`}
                    onClick={() => handleFilterTypeChange("journey_id")}
                >
                    Single Journey
                </button>
            </div>
            <div>
                <label className="text-sm font-semibold text-white">
                    {filterType === "journey_id" ? "Journey ID" : "MMSI"}
                    <select
                        className="ml-2 p-1 rounded border cursor-pointer bg-black text-white"
                        value={selectedId}
                        onChange={(e) => onSelectedIdChange(e.target.value)}
                    >
                        {options.map((id) => (
                            <option key={id} value={id} className="bg-black text-white">
                                {id}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
        </div>
    );
}
