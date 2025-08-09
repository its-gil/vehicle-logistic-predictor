import open from "open"; // npm install open

const DATALASTIC_API_KEY = process.env.MARITIME_API_KEY; // Set your API key in .env

/**
 * Gets all ships that passed through the given coordinates since 10th August 2021 (max available).
 * Because the API only allows a max 7-day range, this function loops back in 7-day steps.
 * @param lat Latitude
 * @param lon Longitude
 * @param radius Search radius in km
 * @returns Array of ships (raw API response, concatenated)
 */
function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getHistoryAllShips(lat: number, lon: number, radius: number = 10) {
    const earliest = new Date("2021-08-10");
    const now = new Date();
    let currentTo = new Date(now);
    let currentFrom = new Date(now);

    const allShips: any[] = [];
    const reportIds: string[] = [];

    while (currentFrom > earliest) {
        // Calculate 7-day window (inclusive of currentTo date)
        currentFrom = new Date(currentTo.getTime() - 6 * 24 * 60 * 60 * 1000);
        if (currentFrom < earliest) currentFrom = new Date(earliest);

        const from = currentFrom.toISOString().slice(0, 10);
        const to = currentTo.toISOString().slice(0, 10);

        const body = {
            "api-key": DATALASTIC_API_KEY,
            report_type: "inradius_history",
            lat,
            lon,
            radius,
            from,
            to,
        };

        const res = await fetch("https://api.datalastic.com/api/v0/report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`Datalastic API error for ${from} - ${to}: ${res.status} ${errorText}`);
            break;
        } else {
            const data = await res.json();
            let reportId = data?.data?.report_id || data?.report_id;
            if (reportId) {
                console.log(`Report ID for ${from} - ${to}: ${reportId}`);
                reportIds.push(reportId);

                // Wait 30 seconds, then open tab with the report link
                await sleep(30000);
                const statusUrl = `https://api.datalastic.com/api/v0/report?api-key=${DATALASTIC_API_KEY}&report_id=${reportId}`;
                await open(statusUrl);
            }
            if (Array.isArray(data?.data)) {
                allShips.push(...data.data);
            }
        }

        // Move window back by exactly one day (start next block from the same day)
        currentTo = new Date(currentFrom);
    }

    return allShips;
}

async function pollReport(reportId: string): Promise<any> {
    const statusUrl = `https://api.datalastic.com/api/v0/report?api-key=${DATALASTIC_API_KEY}&report_id=${reportId}`;
    for (let i = 0; i < 30; i++) {
        // max 30 tries
        const res = await fetch(statusUrl);
        const statusData = await res.json();
        if (statusData?.data?.status === "_DONE_") {
            return statusData;
        }
        await sleep(2000); // wait 2 seconds before next poll
    }
    throw new Error(`Report ${reportId} not ready after polling`);
}

// Example usage:
// getHistoryAllShips(53.55421532846719, 8.560483906080607).then(console.log);
