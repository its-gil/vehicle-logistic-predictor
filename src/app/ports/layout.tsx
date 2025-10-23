"use client";
import React from "react";
import { MapPorts } from "@/components/MapPorts";

export default function PortsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="flex flex-row w-full min-h-0 box-border overflow-hidden"
            style={{ height: "calc(100vh - 64px)" }}
        >
            <div className="w-1/2 bg-zinc-900 border-zinc-800 box-border overflow-hidden">
                <div className="flex flex-col flex-1 h-full min-h-0 bg-zinc-900 border-r border-zinc-800 p-8">
                    {children}
                </div>
            </div>
            <div className="w-1/2 flex-1 flex flex-col h-full min-h-0 justify-center items-center bg-black">
                <MapPorts />
            </div>
        </div>
    );
}
