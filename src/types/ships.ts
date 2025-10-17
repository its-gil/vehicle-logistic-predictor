export type ShipPoint = { mmsi: string; journey_id: string; lat: number; lon: number; date: string };

export type ShipsPositionsContextType = {
    shipsPositions: ShipPoint[] | null;
    loadingShipsPositions?: boolean;
};
