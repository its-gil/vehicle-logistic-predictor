"use client";

import React, { useState } from "react";
import { cityPortList } from "@/constants";
import { useDelay } from "@/providers/DelayProvider";
import { useStorms } from "@/providers/StormsProvider";
import OverlayLoading from "./OverlayLoading";

export default function DelayDashboard() {
    const [localLat, setLocalLat] = useState<string>("");
    const [localLon, setLocalLon] = useState<string>("");
    const [localCourse, setLocalCourse] = useState<string>("");
    const [localDestination, setLocalDestination] = useState<string>(cityPortList[12].name);
    const [localApiError, setLocalApiError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { atlanticStorms } = useStorms();
    const { delayInfo, setDelayInfo } = useDelay();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalApiError(null);
        setIsLoading(true);

        const selectedPort = cityPortList.find((port) => port.name === localDestination);
        if (!selectedPort) {
            setLocalApiError("Invalid destination selected.");
            setIsLoading(false);
            return;
        }

        try {
            // Fetch marine weather for the first coordinate
            const marineWeather = await fetch(`/api/get-marine-features?lat=${localLat}&lon=${localLon}`);
            if (!marineWeather.ok) {
                throw new Error("Failed to fetch marine weather data for the given coordinates.");
            }
            const marineWeatherData = await marineWeather.json();

            // Call delay prediction API
            const response = await fetch(
                `/api/delay-prediction?lat1=${localLat}&lon1=${localLon}&lat2=${selectedPort.lat}&lon2=${selectedPort.lon}&course=${localCourse}` +
                    `&activeStorms=${encodeURIComponent(JSON.stringify(atlanticStorms))}` +
                    `&marineWeather=${encodeURIComponent(JSON.stringify(marineWeatherData))}`
            );
            const data = await response.json();

            if (response.ok) {
                const shipCoordinates = { lat: parseFloat(localLat), lon: parseFloat(localLon) };
                const destinationCoordinates = { lat: selectedPort.lat, lon: selectedPort.lon };
                const course = localCourse;
                const delay = data.target_delay;

                setDelayInfo({
                    shipCoordinates,
                    destinationCoordinates,
                    course,
                    delay,
                });

                setLocalApiError(null);
            } else {
                setLocalApiError(data.error || "Failed to fetch delay prediction.");
            }
        } catch (error) {
            setLocalApiError("An error occurred while calling the API.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 px-12 py-6 bg-zinc-900 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h1 className="sm:text-lg md:text-xl lg:text-2xl font-semibold">Delay Prediction</h1>
                <div className="flex flex-row gap-4">
                    <input
                        id="latitude_input"
                        type="number"
                        step="any"
                        placeholder="Latitude"
                        value={localLat}
                        onChange={(e) => setLocalLat(e.target.value)}
                        className="p-2 rounded bg-zinc-800 border border-zinc-700 text-white"
                        autoComplete="off"
                        required
                    />
                    <input
                        id="longitude_input"
                        type="number"
                        step="any"
                        placeholder="Longitude"
                        value={localLon}
                        onChange={(e) => setLocalLon(e.target.value)}
                        className="p-2 rounded bg-zinc-800 border border-zinc-700 text-white"
                        autoComplete="off"
                        required
                    />
                </div>
                <input
                    id="course_input"
                    type="number"
                    step="any"
                    placeholder="Course"
                    value={localCourse}
                    onChange={(e) => setLocalCourse(e.target.value)}
                    className="p-2 rounded bg-zinc-800 border border-zinc-700 text-white"
                    autoComplete="off"
                    required
                />
                <select
                    id="destination_select"
                    value={localDestination}
                    onChange={(e) => setLocalDestination(e.target.value)}
                    className="p-2 rounded bg-zinc-800 border border-zinc-700 text-white"
                >
                    {cityPortList
                        .slice() // Create a shallow copy to avoid mutating the original array
                        .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically by port name
                        .map((port) => (
                            <option key={port.name} value={port.name}>
                                {port.name}
                            </option>
                        ))}
                </select>
                <button
                    type="submit"
                    className="p-2 bg-yellow-500 hover:bg-yellow-400 text-white font-bold rounded cursor-pointer"
                >
                    Submit
                </button>
            </form>
            {isLoading ? (
                <div>
                    <OverlayLoading />
                </div>
            ) : delayInfo?.delay == null ? null : (
                <div className="flex flex-row rounded justify-center">
                    <p className="sm:text-xl md:text-4xl lg:text-6xl">
                        {delayInfo?.delay ?? "-"}
                        <span className="sm:text-md md:text-2xl lg:text-4xl"> hours</span>
                    </p>
                </div>
            )}
        </div>
    );
}
