import { time } from "console";
import React from "react";

export default function OverlayLastUpdate({ timestamp }: { timestamp?: string }) {
    return (
        timestamp && (
            <div
                className="fixed bottom-6 right-3 bg-zinc-900 text-zinc-200 px-4 py-2 rounded shadow-lg text-xs opacity-90 z-[2100]"
                style={{ pointerEvents: "none" }}
            >
                Last update: {timestamp}
            </div>
        )
    );
}
