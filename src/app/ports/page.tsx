"use client";

import { useEffect, useState } from "react";
import { useDelay } from "@/providers/DelayProvider";
import { useRouter } from "next/navigation";
import { cityPortList } from "@/constants";

export default function PortsPage() {
    const { delayInfo } = useDelay();
    const router = useRouter();
    const [redirected, setRedirected] = useState(false);

    useEffect(() => {
        if (redirected) return;

        const coords = delayInfo?.destinationCoordinates;
        if (coords) {
            const { lat, lon } = coords;
            const port = cityPortList.find((p) => p.lat === lat && p.lon === lon);
            if (port) {
                router.push(`/ports/${port.route}`);
            } else {
                router.push(`/ports`);
            }
            setRedirected(true);
        }
    }, [delayInfo, redirected, router]);

    return (
        <div className="flex flex-col flex-1 h-full min-h-0 bg-zinc-900 border-zinc-800 p-8">
            <div className="flex items-center justify-center h-full text-zinc-400 text-lg">
                Click a port to see weather info.
            </div>
        </div>
    );
}
