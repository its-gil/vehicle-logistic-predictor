import { haversineDistanceNm } from "@/utils/calculateHaversineDistance";
import { calculateMarineFeatures } from "@/utils/calculateMarineFeatures";
import { PrepareModelDataInput, PrepareModelDataOutput } from "@/types";

export async function prepareModelData({
    lat1,
    lon1,
    lat2,
    lon2,
    course,
    activeStorms,
    marineWeather,
}: PrepareModelDataInput): Promise<PrepareModelDataOutput> {
    try {
        if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2) || isNaN(course)) {
            throw new Error("Invalid input. Please provide valid lat1, lon1, lat2, lon2, and course.");
        }

        // Calculate distance between the two points in nautical miles
        const distanceToDestinationNm = haversineDistanceNm(lat1, lon1, lat2, lon2);

        console.log(`Distance to destination: ${distanceToDestinationNm.toFixed(2)} NM`);

        // Find the closest storm to the first pair of coordinates
        let closestStorm = null;
        let minDistanceToStormNm = 99999;

        for (const storm of activeStorms) {
            const distanceToStormNm = haversineDistanceNm(lat1, lon1, storm.lat, storm.lon);
            if (distanceToStormNm < minDistanceToStormNm) {
                minDistanceToStormNm = distanceToStormNm;
                closestStorm = storm;
            }
        }

        console.log(
            `Closest storm is ${closestStorm?.name || "Unknown"} at a distance of ${minDistanceToStormNm.toFixed(2)} NM`
        );

        // Get the intensity of the closest storm (always a string)
        const stormWind = (closestStorm?.intensity ?? "0").toString();

        // Add the ship's course to the marine weather data
        const marineWeatherWithCourse = { ...marineWeather, course };

        // Calculate composite marine features
        const marineFeatures = calculateMarineFeatures(marineWeatherWithCourse);

        // Extract composite features into variables
        const {
            wind_wave_effect_forward,
            wind_wave_effect_side,
            swell_effect_forward,
            swell_effect_side,
            ocean_current_effect_forward,
            ocean_current_effect_side,
            swell_impact,
            wind_wave_energy,
        } = marineFeatures;

        // Return the results in the requested order
        return {
            storm_wind: stormWind,
            wind_wave_effect_forward: wind_wave_effect_forward.toFixed(2),
            wind_wave_effect_side: wind_wave_effect_side.toFixed(2),
            swell_effect_forward: swell_effect_forward.toFixed(2),
            swell_effect_side: swell_effect_side.toFixed(2),
            ocean_current_effect_forward: ocean_current_effect_forward.toFixed(2),
            ocean_current_effect_side: ocean_current_effect_side.toFixed(2),
            swell_impact: swell_impact.toFixed(2),
            wind_wave_energy: wind_wave_energy.toFixed(2),
            distance_to_destination_nm: distanceToDestinationNm.toFixed(2),
            distance_to_storm_nm: minDistanceToStormNm.toFixed(2),
        };
    } catch (error) {
        console.error("Error in prepareModelData:", error);
        throw new Error("Failed to prepare model data.");
    }
}
