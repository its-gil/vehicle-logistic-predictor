import React, { createContext, useContext, useEffect, useState } from "react";
import { ShipPoint, ShipsPositionsContextType } from "@/types";

const ShipsPositionsContext = createContext<ShipsPositionsContextType>({
    shipsPositions: null,
    loading: true,
});

export function ShipsPositionsProvider({ children }: { children: React.ReactNode }) {
    const [shipsPositions, setShipsPositions] = useState<ShipPoint[] | null>(null);
    const [loading, setLoading] = useState(true);

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
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <ShipsPositionsContext.Provider value={{ shipsPositions, loading }}>{children}</ShipsPositionsContext.Provider>
    );
}

export function useShipsPositions() {
    return useContext(ShipsPositionsContext);
}
