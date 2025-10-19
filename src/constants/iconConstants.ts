// src/constants/iconConstants.ts
import L from "leaflet";
import { IconName } from "@/types";

// Icon configuration type
interface IconConfig {
    iconUrl: string;
    iconSize: [number, number];
    iconAnchor: [number, number];
    tooltipAnchor: [number, number];
}

// Centralized icon configurations
const ICON_CONFIGS: Record<IconName, IconConfig> = {
    tornado: {
        iconUrl: "/icon_tornado.png",
        iconSize: [40, 40],
        iconAnchor: [12, 12],
        tooltipAnchor: [0, -12],
    },
    storm: {
        iconUrl: "/icon_storm.png",
        iconSize: [40, 40],
        iconAnchor: [12, 12],
        tooltipAnchor: [0, -12],
    },
    ship: {
        iconUrl: "/icon_ship.png",
        iconSize: [40, 40],
        iconAnchor: [12, 12],
        tooltipAnchor: [0, 0],
    },
    ship_standard: {
        iconUrl: "/icon_ship_standard.png",
        iconSize: [40, 40],
        iconAnchor: [12, 12],
        tooltipAnchor: [0, 0],
    },
    destination: {
        iconUrl: "/icon_destination.png",
        iconSize: [40, 40],
        iconAnchor: [12, 12],
        tooltipAnchor: [0, 0],
    },
};

// Icons cache to avoid recreating them
let iconsCache: Record<IconName, L.Icon> | null = null;

// Factory function to create all icons (call this client-side only)
export const createMapIcons = (): Record<IconName, L.Icon> => {
    // Guard against SSR
    if (typeof window === "undefined") {
        return {} as Record<IconName, L.Icon>;
    }

    if (iconsCache) return iconsCache;

    iconsCache = Object.entries(ICON_CONFIGS).reduce((acc, [name, config]) => {
        acc[name as IconName] = new L.Icon(config);
        return acc;
    }, {} as Record<IconName, L.Icon>);

    return iconsCache;
};

// Get a single icon by name
export const getIcon = (name: IconName): L.Icon | null => {
    if (typeof window === "undefined") return null;
    const icons = createMapIcons();
    return icons[name];
};

// Get icon URL without creating the L.Icon instance
export const getIconUrl = (name: IconName): string => {
    return ICON_CONFIGS[name].iconUrl;
};

// Get icon configuration
export const getIconConfig = (name: IconName): IconConfig => {
    return ICON_CONFIGS[name];
};

// Function to create a rotated ship icon
export const getRotatedShipIcon = (course: number): L.DivIcon | null => {
    if (typeof window === "undefined") return null;

    return L.divIcon({
        className: "rotated-ship-icon",
        html: `
      <div style="transform: rotate(${course}deg);">
        <img src="/icon_ship.png" alt="Ship" style="width: 40px; height: 40px;" />
      </div>
    `,
        iconSize: [40, 40],
        iconAnchor: [12, 12],
    });
};

// Reset cache (useful for testing or if you need to recreate icons)
export const resetIconsCache = (): void => {
    iconsCache = null;
};
