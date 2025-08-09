const DATALASTIC_API_KEY = process.env.MARITIME_API_KEY;

export async function getAllPorts() {
    const body = {
        "api-key": DATALASTIC_API_KEY,
        report_type: "port_list",
    };

    const res = await fetch("https://api.datalastic.com/api/v0/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Datalastic API error: ${res.status} ${errorText}`);
    }

    const data = await res.json();
    return data;
}

// Example usage:
// getAllPorts().then(console.log);
