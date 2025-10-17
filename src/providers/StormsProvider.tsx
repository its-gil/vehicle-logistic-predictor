import React, { createContext, useContext, useEffect, useState } from "react";
import { StormsContextType } from "@/types";

const StormsContext = createContext<StormsContextType>({
    atlanticStorms: [],
    noaaPoints: [],
    arrows: [],
    regions: [],
    timestamp: "",
    loadingStorms: true,
});

export function StormsProvider({ children }: { children: React.ReactNode }) {
    const [atlanticStorms, setAtlanticStorms] = useState<any[] | null>(null);
    const [noaaPoints, setNoaaPoints] = useState<any[]>([]);
    const [arrows, setArrows] = useState<any[]>([]);
    const [regions, setRegions] = useState<any[]>([]);
    const [loadingStorms, setLoadingStorms] = useState(true);

    useEffect(() => {
        async function fetchStormsGeneral() {
            setLoadingStorms(true);
            try {
                const stormsRes = await fetch("/api/storms");
                const stormsData = await stormsRes.json();
                setAtlanticStorms(stormsData);

                const potentialRes = await fetch("/api/potential-storms");
                const potentialData = await potentialRes.json();
                setNoaaPoints(potentialData.points || []);
                setArrows(potentialData.arrows || []);
                setRegions(potentialData.regions || []);
            } catch (error) {
                console.error("Error fetching storms data:", error);
            }
            setLoadingStorms(false);
        }
        fetchStormsGeneral();
    }, []);

    return (
        <StormsContext.Provider
            value={{
                atlanticStorms,
                noaaPoints,
                arrows,
                regions,
                timestamp: new Date().toISOString(),
                loadingStorms,
            }}
        >
            {children}
        </StormsContext.Provider>
    );
}

export function useStorms() {
    return useContext(StormsContext);
}
