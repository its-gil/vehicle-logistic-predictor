import React, { useEffect, useState } from "react";
import OverlayLoading from "./OverlayLoading";
import { marineWeatherFeatureNames, marineWeatherUnits } from "@/constants/weatherConstants";
import { MarineWeatherAverages } from "@/types/marineWeather";

export default function MarineWeatherComponent(props: MarineWeatherAverages) {
    const { marineWeatherAverages, loadingMarineWeather } = props;

    return (
        <div className="flex flex-col flex-1 h-full w-full min-h-0 my-6">
            {loadingMarineWeather ? (
                <div className="flex-1">
                    <OverlayLoading className="relative" />
                </div>
            ) : (
                <div className="flex-1 h-full min-h-0">
                    {marineWeatherAverages &&
                        marineWeatherFeatureNames.map((name) => (
                            <div key={name} className="flex justify-between border-b border-zinc-800 pb-1">
                                <span className="capitalize text-zinc-300">{name.replace(/_/g, " ")}:</span>
                                <span className="text-white font-semibold">
                                    {marineWeatherAverages[name] !== null && marineWeatherAverages[name] !== undefined
                                        ? `${marineWeatherAverages[name]?.toFixed(2)} ${marineWeatherUnits[name] || ""}`
                                        : "N/A"}
                                </span>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}
