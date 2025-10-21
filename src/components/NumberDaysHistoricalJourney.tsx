"use client";
import React from "react";

export default function NumberDaysHistoricalJourney({ days }: { days: number }) {
    const dotColor = days <= 14 ? "bg-green-500" : days <= 21 ? "bg-yellow-500" : "bg-red-500";

    return (
        <div className="flex flex-col flex-1 justify-between p-6 bg-black text-white rounded-lg shadow-lg text-left">
            <h1 className="text-2xl font-semibold mb-4">Journey Duration</h1>
            <div className="flex flex-row items-center justify-between">
                {days === -1 ? (
                    <>
                        <p className="text-sm text-gray-400">-</p>
                        <div className={`w-3 h-3 rounded-full bg-red-500`} />
                    </>
                ) : (
                    <>
                        <p className="text-4xl">
                            {days} <span className="text-sm text-gray-400">days</span>
                        </p>
                        <div className={`w-3 h-3 rounded-full ${dotColor}`} />
                    </>
                )}
            </div>
        </div>
    );
}
