import React from "react";

interface BarChartProps {
    labels: string[];
    values: number[];
    maxValue?: number;
}

export default function BarChart({ labels, values, maxValue }: BarChartProps) {
    const max = maxValue ?? Math.max(...values, 1);

    return (
        <div className="w-full flex flex-col items-center">
            <div className="flex w-full items-end">
                <div className="flex flex-col justify-between h-48 mr-2 text-xs text-zinc-400">
                    <span>{max}</span>
                    <span>0</span>
                </div>
                <div className="flex gap-4 items-end h-48 w-full">
                    {values.map((v, i) => (
                        <div key={i} className="flex flex-col items-center flex-1">
                            <div
                                className="bg-purple-600 w-8 rounded-t"
                                style={{
                                    height: v / max * 100,
                                    transition: "height 0.3s",
                                }}
                                title={labels[i]}
                            />
                            <span className="mt-2 text-xs text-zinc-700 dark:text-zinc-200 text-center break-words">
                                {labels[i]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
