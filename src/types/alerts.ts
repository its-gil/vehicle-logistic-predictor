export type AlertsResponse = {
    localtime: string;
    alerts: {
        headline: string;
        severity: string;
        urgency: string;
        certainty: string;
        event: string;
        description: string;
        effective: string;
        expires: string;
        id?: string;
        areaDesc?: string;
        instruction?: string;
        onset?: string;
        ends?: string;
        senderName?: string;
        status?: string;
        web?: string;
        references?: { "@id": string }[];
    }[];
    loading?: boolean;
};
