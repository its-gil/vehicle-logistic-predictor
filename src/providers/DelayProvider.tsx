"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

import { DelayInfo, DelayContextType } from "@/types";

const DelayContext = createContext<DelayContextType | undefined>(undefined);

export const DelayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [delayInfo, setDelayInfo] = useState<DelayInfo>({
        shipCoordinates: { lat: null, lon: null },
        destinationCoordinates: { lat: null, lon: null },
        course: null,
        delay: null,
    });

    const [rotatedShipIcon, setRotatedShipIcon] = useState<L.DivIcon | null>(null);

    // Automatically update the rotated ship icon whenever the course changes, with lazy loading
    useEffect(() => {
        const course = delayInfo.course;
        if (course !== null) {
            import("@/constants/iconConstants").then(({ getRotatedShipIcon }) => {
                const icon = getRotatedShipIcon(parseFloat(course));
                if (icon) {
                    setRotatedShipIcon(icon);
                }
            });
        } else {
            setRotatedShipIcon(null);
        }
    }, [delayInfo.course]);

    return (
        <DelayContext.Provider value={{ delayInfo, setDelayInfo, rotatedShipIcon }}>{children}</DelayContext.Provider>
    );
};

export const useDelay = (): DelayContextType => {
    const context = useContext(DelayContext);
    if (!context) {
        throw new Error("useDelay must be used within a DelayProvider");
    }
    return context;
};
