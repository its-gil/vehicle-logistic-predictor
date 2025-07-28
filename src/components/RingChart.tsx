import React from "react";

interface RingChartProps {
    value: number; // 0.0 to 1.0
    size?: number; // px
    strokeWidth?: number; // px
    comment?: string;
}

export default function RingChart({ value, size = 120, strokeWidth = 14, comment }: RingChartProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.max(0, Math.min(1, value)); // clamp between 0 and 1
    const offset = circumference * (1 - progress);

    return (
        <div className="flex flex-col items-center">
            {/* Comment box above the graph */}
            {comment && (
                <div className="mb-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-700 dark:text-zinc-200 text-center shadow">
                    {comment}
                </div>
            )}
            <svg width={size} height={size} className="block">
                {/* Background ring with outline */}
                <circle cx={size / 2} cy={size / 2} r={radius} stroke="#78909C" strokeWidth={strokeWidth} fill="none" />
                {/* Progress ring */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#5E35B1"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.5s" }}
                />
                {/* Center text */}
                <text x="50%" y="50%" textAnchor="middle" dy=".35em" className="text-xl font-bold fill-white">
                    {Math.round(progress * 100)}%
                </text>
            </svg>
        </div>
    );
}
