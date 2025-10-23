// Helper to draw wind arrows with arrowhead
export function getArrowCoords(lat: number, lon: number, direction: number, speed: number): [number, number][][] {
    const length = Math.min(2 + speed * 5, 5);
    const rad = (direction * Math.PI) / 180;
    const lat2 = lat + length * Math.cos(rad) * 0.2;
    const lon2 = lon + length * Math.sin(rad) * 0.2;

    const arrowHeadLength = 0.4;
    const arrowAngle = 30 * (Math.PI / 180);

    const leftRad = rad + arrowAngle;
    const rightRad = rad - arrowAngle;

    const leftLat = lat2 - arrowHeadLength * Math.cos(leftRad);
    const leftLon = lon2 - arrowHeadLength * Math.sin(leftRad);

    const rightLat = lat2 - arrowHeadLength * Math.cos(rightRad);
    const rightLon = lon2 - arrowHeadLength * Math.sin(rightRad);

    return [
        [
            [lat, lon],
            [lat2, lon2],
        ],
        [
            [lat2, lon2],
            [leftLat, leftLon],
        ],
        [
            [lat2, lon2],
            [rightLat, rightLon],
        ],
    ];
}
