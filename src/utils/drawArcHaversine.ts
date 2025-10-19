"use client";

// Returns an array of LatLng points representing the great-circle arc between two coordinates
export default function drawArcHaversine(
    start: number[],
    end: number[],
    numPoints: number
): import("leaflet").LatLngExpression[] {
    const [lat1, lon1] = start.map((v) => (v * Math.PI) / 180);
    const [lat2, lon2] = end.map((v) => (v * Math.PI) / 180);

    const points: import("leaflet").LatLngExpression[] = [];
    for (let i = 0; i <= numPoints; i++) {
        const f = i / numPoints;
        // Spherical linear interpolation
        const sinTotal =
            Math.sin((1 - f) * getCentralAngle(lat1, lon1, lat2, lon2)) +
            Math.sin(f * getCentralAngle(lat1, lon1, lat2, lon2));
        const A = Math.sin((1 - f) * getCentralAngle(lat1, lon1, lat2, lon2)) / sinTotal;
        const B = Math.sin(f * getCentralAngle(lat1, lon1, lat2, lon2)) / sinTotal;

        const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
        const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
        const z = A * Math.sin(lat1) + B * Math.sin(lat2);

        const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
        const lon = Math.atan2(y, x);

        points.push([(lat * 180) / Math.PI, (lon * 180) / Math.PI]);
    }
    return points;
}

function getCentralAngle(lat1: number, lon1: number, lat2: number, lon2: number) {
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
