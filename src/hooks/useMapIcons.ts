import { useEffect, useState } from "react";
import type L from "leaflet";
import { IconName } from "@/types";

export function useMapIcons() {
    const [icons, setIcons] = useState<Record<IconName, L.Icon> | null>(null); // Add null initial value
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Dynamically import the constants file only on client
        import("@/constants/iconConstants").then(({ createMapIcons }) => {
            setIcons(createMapIcons());
            setIsLoading(false);
        });
    }, []);

    return { icons, isLoading };
}
