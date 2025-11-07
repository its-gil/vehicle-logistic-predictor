"use client";

import React, { useState } from "react";
import { CircleQuestionMark } from "lucide-react";
import { LegendItem } from "@/types";
import { getIconUrl } from "@/constants/iconConstants";

export default function OverlayLegend({ items }: { items: LegendItem[] }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="flex flex-col absolute bottom-6 left-6 z-503 pointer-events-auto"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Legend content */}
            {isHovered && (
                <div className="p-4 mb-4 rounded-xl shadow-lg w-96 z-50 bg-black text-white">
                    <h3 className="text-lg font-bold mb-4">Map Legend</h3>
                    <div className="flex flex-row">
                        <div className="flex flex-col items-center justify-center space-y-3 text-sm">
                            {items.includes("ship_legend") && (
                                <div className="flex items-center h-8">
                                    <img src={getIconUrl("ship_standard")} alt="Ship Icon" className="w-6 h-6 mr-4" />
                                </div>
                            )}
                            {items.includes("destination_legend") && (
                                <div className="flex items-center h-8">
                                    <img
                                        src={getIconUrl("destination")}
                                        alt="Destination Icon"
                                        className="w-6 h-6 mr-4"
                                    />
                                </div>
                            )}
                            {items.includes("storm_legend") && (
                                <div className="flex items-center h-8">
                                    <img src={getIconUrl("storm")} alt="Storm Icon" className="w-6 h-6 mr-4" />
                                </div>
                            )}
                            {items.includes("tornado_legend") && (
                                <div className="flex items-center h-8">
                                    <img src={getIconUrl("tornado")} alt="Tornado Icon" className="w-6 h-6 mr-4" />
                                </div>
                            )}
                            {items.includes("tornado_development_legend") && (
                                <div className="flex items-center h-8">
                                    <div className="w-3 h-3 bg-yellow-400 mr-4 rounded-full"></div>
                                </div>
                            )}
                            {items.includes("route_arc_legend") && (
                                <div className="flex items-center h-8">
                                    <div className="w-3 h-3 bg-blue-400 mr-4 rounded-full"></div>
                                </div>
                            )}
                            {items.includes("weak_current_legend") && (
                                <div className="flex items-center h-8">
                                    <div className="w-3 h-3 bg-green-400 mr-4 rounded-full"></div>
                                </div>
                            )}
                            {items.includes("medium_current_legend") && (
                                <div className="flex items-center h-8">
                                    <div className="w-3 h-3 bg-orange-400 mr-4 rounded-full"></div>
                                </div>
                            )}
                            {items.includes("strong_current_legend") && (
                                <div className="flex items-center h-8">
                                    <div className="w-3 h-3 bg-red-400 mr-4 rounded-full"></div>
                                </div>
                            )}
                            {items.includes("ports_legend") && (
                                <div className="flex items-center h-8">
                                    <div className="w-3 h-3 bg-yellow-400 mr-4 rounded-full"></div>
                                </div>
                            )}
                            {items.includes("coordinates_route_legend") && (
                                <div className="flex items-center h-8">
                                    <div className="w-3 h-3 bg-yellow-400 mr-4 rounded-full"></div>
                                </div>
                            )}
                            {items.includes("historical_routes_legend") && (
                                <div className="flex items-center h-8">
                                    <div className="w-3 h-3 bg-gray-400 mr-4 rounded-full"></div>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col justify-center space-y-3 text-sm">
                            {items.includes("ship_legend") && (
                                <div className="flex items-center h-8">
                                    <span>Current ship location</span>
                                </div>
                            )}
                            {items.includes("destination_legend") && (
                                <div className="flex items-center h-8">
                                    <span>Selected destination</span>
                                </div>
                            )}
                            {items.includes("storm_legend") && (
                                <div className="flex items-center h-8">
                                    <span>Active storms</span>
                                </div>
                            )}
                            {items.includes("tornado_legend") && (
                                <div className="flex items-center h-8">
                                    <span>Potential storms</span>
                                </div>
                            )}
                            {items.includes("tornado_development_legend") && (
                                <div className="flex items-center h-8">
                                    <span>Potential development areas of potential storm</span>
                                </div>
                            )}
                            {items.includes("route_arc_legend") && (
                                <div className="flex items-center h-8">
                                    <span>Great-circle arc between the ship and destination</span>
                                </div>
                            )}
                            {items.includes("weak_current_legend") && (
                                <div className="flex items-center h-8">
                                    <span>Weak current</span>
                                </div>
                            )}
                            {items.includes("medium_current_legend") && (
                                <div className="flex items-center h-8">
                                    <span>Medium current</span>
                                </div>
                            )}
                            {items.includes("strong_current_legend") && (
                                <div className="flex items-center h-8">
                                    <span>Strong current</span>
                                </div>
                            )}
                            {items.includes("ports_legend") && (
                                <div className="flex items-center h-8">
                                    <span>Ports for the historical routes</span>
                                </div>
                            )}
                            {items.includes("coordinates_route_legend") && (
                                <div className="flex items-center h-8">
                                    <span>Coordinates of historical route</span>
                                </div>
                            )}
                            {items.includes("historical_routes_legend") && (
                                <div className="flex items-center h-8">
                                    <span>All historical routes over the last 5 years</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* Icon to trigger the legend */}
            <CircleQuestionMark className="w-6 h-6 text-white cursor-pointer hover:text-gray-300" aria-label="Legend" />
        </div>
    );
}
