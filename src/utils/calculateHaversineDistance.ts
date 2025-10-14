/**
 * Calculates the Haversine distance between two points on the Earth in nautical miles.
 * @param lat1 Latitude of the first point in degrees.
 * @param lon1 Longitude of the first point in degrees.
 * @param lat2 Latitude of the second point in degrees.
 * @param lon2 Longitude of the second point in degrees.
 * @returns The distance between the two points in nautical miles.
 */
export function haversineDistanceNm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

    const R = 3440.065; // Earth's radius in nautical miles
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in nautical miles
}
