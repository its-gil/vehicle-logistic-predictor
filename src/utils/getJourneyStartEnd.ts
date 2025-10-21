export function getJourneyStartEnd(currentJourneyPoints: { journey_id: string; date: string }[]): {
    journeyStart: Date | null;
    journeyEnd: Date | null;
    durationInDays: number | null;
} {
    if (currentJourneyPoints.length === 0) {
        return { journeyStart: null, journeyEnd: null, durationInDays: null };
    }

    const groupedByJourneyId: Record<string, { date: string }[]> = currentJourneyPoints.reduce((acc, point) => {
        if (!acc[point.journey_id]) {
            acc[point.journey_id] = [];
        }
        acc[point.journey_id].push(point);
        return acc;
    }, {} as Record<string, { date: string }[]>);

    // Calculate the duration for each journey_id
    let totalDurationInDays = 0;
    let totalJourneys = 0;
    let overallJourneyStart: Date | null = null;
    let overallJourneyEnd: Date | null = null;

    Object.values(groupedByJourneyId).forEach((points) => {
        // Sort points by date
        const sortedPoints = points.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const journeyStart = new Date(sortedPoints[0].date);
        const journeyEnd = new Date(sortedPoints[sortedPoints.length - 1].date);

        // Calculate duration for this journey
        const durationInMilliseconds = journeyEnd.getTime() - journeyStart.getTime();
        const durationInDays = Math.ceil(durationInMilliseconds / (1000 * 60 * 60 * 24));
        totalDurationInDays += durationInDays;
        totalJourneys++;

        // Update overall journey start and end
        if (!overallJourneyStart || journeyStart < overallJourneyStart) {
            overallJourneyStart = journeyStart;
        }
        if (!overallJourneyEnd || journeyEnd > overallJourneyEnd) {
            overallJourneyEnd = journeyEnd;
        }
    });

    // Calculate the average duration
    const averageDurationInDays = totalJourneys > 0 ? totalDurationInDays / totalJourneys : null;

    return {
        journeyStart: overallJourneyStart,
        journeyEnd: overallJourneyEnd,
        durationInDays: averageDurationInDays,
    };
}
