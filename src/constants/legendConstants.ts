import { LegendItem } from "@/types";

export const viewLegends: Record<string, LegendItem[]> = {
    dashboard: [
        "ship_legend",
        "destination_legend",
        "route_arc_legend",
        "storm_legend",
        "tornado_legend",
        "tornado_development_legend",
        "historical_routes_legend",
    ],
    storms: [
        "ship_legend",
        "destination_legend",
        "route_arc_legend",
        "storm_legend",
        "tornado_legend",
        "tornado_development_legend",
        "historical_routes_legend",
    ],
    marineWeather: [
        "ship_legend",
        "destination_legend",
        "route_arc_legend",
        "weak_current_legend",
        "medium_current_legend",
        "strong_current_legend",
        "historical_routes_legend",
    ],
    ports: ["ship_legend", "ports_legend", "route_arc_legend", "historical_routes_legend"],
    historical: ["storm_legend", "historical_routes_legend", "coordinates_route_legend"],
};
