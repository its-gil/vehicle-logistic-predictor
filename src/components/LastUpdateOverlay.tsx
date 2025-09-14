import React from "react";

export default function LastUpdateOverlay({ timestamp }: { timestamp: string }) {
    return (
        <div
            className="fixed bottom-4 right-4 bg-zinc-900 text-zinc-200 px-4 py-2 rounded shadow-lg text-xs opacity-90 z-[2100]"
            style={{ pointerEvents: "none" }}
        >
            Last update: {timestamp}
        </div>
    );
}
