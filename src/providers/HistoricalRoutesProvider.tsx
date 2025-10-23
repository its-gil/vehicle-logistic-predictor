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
        async function fetchHistoricalRoutes() {
            try {
                setLoadingShipsPositions(true);

                const response = await fetch("/api/historical-routes");
                if (!response.ok) {
                    throw new Error("Failed to fetch historical routes");
                }

                const data: ShipPoint[] = await response.json();

                setShipsPositions(data);
            } catch (error) {
                console.error("Error fetching historical routes:", error);
                setShipsPositions(null);
            } finally {
                setLoadingShipsPositions(false);
            }
        }

        fetchHistoricalRoutes();
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
