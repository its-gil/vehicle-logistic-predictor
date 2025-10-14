"use client";
import { useEffect, useState } from "react";
import { useMarineWeather } from "@/providers/MarineWeatherProvider";
import LoadingOverlay from "@/components/LoadingOverlay";
import { cityPortList } from "@/utils/cityPortList";

const marineFeatureNames = [
    "wind_speed_10m",
    "wind_direction_10m",
    "wave_height",
    "wave_direction",
    "wave_period",
    "wind_wave_height",
    "wind_wave_direction",
    "wind_wave_period",
    "swell_wave_height",
    "swell_wave_direction",
    "swell_wave_period",
    "ocean_current_velocity",
    "ocean_current_direction",
];

export default function Home() {
    const { marineWeather, loading } = useMarineWeather();

    const [averages, setAverages] = useState<any>(null);
    const [lat, setLat] = useState<string>("");
    const [lon, setLon] = useState<string>("");
    const [course, setCourse] = useState<string>("");
    const [destination, setDestination] = useState<string>(cityPortList[0].name);
    const [targetDelay, setTargetDelay] = useState<string | null>(null);
    const [apiError, setApiError] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && marineWeather.length > 0) {
            // Calculate averages for marine weather features
            const calculatedAverages: Record<string, number | null> = {};
            marineFeatureNames.forEach((feature) => {
                const values = marineWeather
                    .map((data: any) => data[feature])
                    .filter((value: any) => value !== null && value !== undefined);
                const average =
                    values.length > 0
                        ? values.reduce((sum: number, value: number) => sum + value, 0) / values.length
                        : null;
                calculatedAverages[feature] = average;
            });
            setAverages(calculatedAverages);
        }
    }, [loading, marineWeather]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTargetDelay(null);
        setApiError(null);

        const selectedPort = cityPortList.find((port) => port.name === destination);
        if (!selectedPort) {
            setApiError("Invalid destination selected.");
            return;
        }

        try {
            const response = await fetch(
                `/api/delay-prediction?lat1=${lat}&lon1=${lon}&lat2=${selectedPort.lat}&lon2=${selectedPort.lon}&course=${course}`
            );
            const data = await response.json();

            if (response.ok) {
                setTargetDelay(data.target_delay);
            } else {
                setApiError(data.error || "Failed to fetch delay prediction.");
            }
        } catch (error) {
            setApiError("An error occurred while calling the API.");
        }
    };

    return (
        <div
            className="flex flex-row w-full min-h-0 box-border overflow-hidden bg-zinc-900"
            style={{ height: "calc(100vh - 64px)" }}
        >
            {/* Left Section: Marine Weather Averages */}
            <div className="flex-1 flex flex-col h-full min-h-0 justify-center items-center">
                <div className="flex flex-col items-start pt-12 pb-8">
                    <h2 className="text-8xl font-extrabold mb-6 text-left text-white">Marine Weather Averages</h2>
                </div>
                {loading ? (
                    <LoadingOverlay className="relative" />
                ) : (
                    <div className="space-y-3 text-xl">
                        {averages &&
                            marineFeatureNames.map((name) => (
                                <div key={name} className="flex justify-between border-b border-zinc-800 pb-1">
                                    <span className="capitalize text-zinc-300">{name.replace(/_/g, " ")}:</span>
                                    <span className="text-white font-semibold">
                                        {averages[name] !== null && averages[name] !== undefined
                                            ? averages[name].toFixed(2)
                                            : "N/A"}
                                    </span>
                                </div>
                            ))}
                    </div>
                )}
            </div>

            {/* Right Section: Submit Form */}
            <div className="w-1/3 bg-zinc-800 p-6">
                <h3 className="text-2xl font-bold text-white mb-4">Delay Prediction</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">Latitude</label>
                        <input
                            type="number"
                            step="any"
                            value={lat}
                            onChange={(e) => setLat(e.target.value)}
                            className="w-full p-2 rounded bg-zinc-700 text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">Longitude</label>
                        <input
                            type="number"
                            step="any"
                            value={lon}
                            onChange={(e) => setLon(e.target.value)}
                            className="w-full p-2 rounded bg-zinc-700 text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">Course</label>
                        <input
                            type="number"
                            step="any"
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                            className="w-full p-2 rounded bg-zinc-700 text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">Destination</label>
                        <select
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="w-full p-2 rounded bg-zinc-700 text-white"
                        >
                            {cityPortList.map((port) => (
                                <option key={port.name} value={port.name}>
                                    {port.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Submit
                    </button>
                </form>

                {/* Display Results */}
                {targetDelay !== null && (
                    <div className="mt-6 p-4 bg-green-700 text-white rounded">
                        <h4 className="text-lg font-bold">Predicted Delay:</h4>
                        <p className="text-2xl">{targetDelay} hours</p>
                    </div>
                )}
                {apiError && (
                    <div className="mt-6 p-4 bg-red-700 text-white rounded">
                        <h4 className="text-lg font-bold">Error:</h4>
                        <p>{apiError}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
