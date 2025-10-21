import { DashboardMode } from "@/types";

export default function FilterAlertsWeather({
    mode: portsDashboardMode,
    setMode: setPortsDashboardMode,
}: {
    mode: DashboardMode;
    setMode: (mode: DashboardMode) => void;
}) {
    return (
        <div className="flex items-center gap-4">
            <button
                onClick={() => setPortsDashboardMode("alerts")}
                aria-pressed={portsDashboardMode === "alerts"}
                className={`bg-transparent border-none outline-none px-0 py-0 text-lg font-semibold cursor-pointer ${
                    portsDashboardMode === "alerts"
                        ? "text-yellow-400 underline underline-offset-4"
                        : "text-white hover:text-yellow-400 hover:underline hover:underline-offset-4"
                }`}
            >
                Alerts
            </button>
            <button
                onClick={() => setPortsDashboardMode("weather")}
                aria-pressed={portsDashboardMode === "weather"}
                className={`bg-transparent border-none outline-none px-0 py-0 text-lg font-semibold cursor-pointer ${
                    portsDashboardMode === "weather"
                        ? "text-yellow-400 underline underline-offset-4"
                        : "text-white hover:text-yellow-400 hover:underline hover:underline-offset-4"
                }`}
            >
                Weather
            </button>
        </div>
    );
}
