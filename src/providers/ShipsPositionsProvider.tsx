import React, { createContext, useContext, useEffect, useState } from "react";
import { ShipPoint, ShipsPositionsContextType } from "@/types";

const ShipsPositionsContext = createContext<ShipsPositionsContextType>({
    shipsPositions: null,
    loadingShipsPositions: true,
});

export function ShipsPositionsProvider({ children }: { children: React.ReactNode }) {
    const [shipsPositions, setShipsPositions] = useState<ShipPoint[] | null>(null);
    const [loadingShipsPositions, setLoadingShipsPositions] = useState(true);

    console.log("Looking for ships positions");
    useEffect(() => {
        fetch("/api/ships-positions")
            .then((res) => res.json())
            .then((data) => {
                const points = data.map((row: any) => ({
                    mmsi: row.mmsi,
                    journey_id: row.journey_id,
                    lat: parseFloat(row.lat),
                    lon: parseFloat(row.lon),
                    date: row.date,
                }));
                setShipsPositions(points);
                setLoadingShipsPositions(false);
            })
            .catch(() => setLoadingShipsPositions(false));
    }, []);

    return (
        <ShipsPositionsContext.Provider value={{ shipsPositions, loadingShipsPositions }}>
            {children}
        </ShipsPositionsContext.Provider>
    );
}

export function useShipsPositions() {
    return useContext(ShipsPositionsContext);
}
