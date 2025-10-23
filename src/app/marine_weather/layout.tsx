"use client";
import React from "react";
import { MarineWeatherProvider } from "@/providers/MarineWeatherProvider";

export default function MarineWeatherLayout({ children }: { children: React.ReactNode }) {
    return <MarineWeatherProvider>{children}</MarineWeatherProvider>;
}
