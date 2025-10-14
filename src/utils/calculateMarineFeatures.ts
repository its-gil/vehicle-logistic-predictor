import { MarineWeatherInput, MarineFeaturesOutput } from "@/types/";

export function calculateMarineFeatures(data: MarineWeatherInput): MarineFeaturesOutput {
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

    // Ensure all directions are valid and calculate relative directions
    const relativeWaveDirection = data.wave_direction !== null ? (data.wave_direction - data.course + 360) % 360 : 0;
    const relativeWindWaveDirection =
        data.wind_wave_direction !== null ? (data.wind_wave_direction - data.course + 360) % 360 : 0;
    const relativeSwellWaveDirection =
        data.swell_wave_direction !== null ? (data.swell_wave_direction - data.course + 360) % 360 : 0;
    const relativeWindDirection10m =
        data.wind_direction_10m !== null ? (data.wind_direction_10m - data.course + 360) % 360 : 0;
    const relativeOceanCurrentDirection =
        data.ocean_current_direction !== null ? (data.ocean_current_direction - data.course + 360) % 360 : 0;

    // Convert relative angles to radians
    const relAngleRadWindWave = toRadians(relativeWindWaveDirection);
    const relAngleRadSwellWave = toRadians(relativeSwellWaveDirection);
    const relAngleRadCurrent = toRadians(relativeOceanCurrentDirection);

    // Calculate forward and side effects for wind waves
    const windWaveEffectForward = (data.wind_wave_height || 0) * Math.cos(relAngleRadWindWave); // Forward effect of wind waves
    const windWaveEffectSide = (data.wind_wave_height || 0) * Math.sin(relAngleRadWindWave); // Side effect of wind waves

    // Calculate forward and side effects for swell waves
    const swellEffectForward = (data.swell_wave_height || 0) * Math.cos(relAngleRadSwellWave); // Forward effect of swell waves
    const swellEffectSide = (data.swell_wave_height || 0) * Math.sin(relAngleRadSwellWave); // Side effect of swell waves

    // Calculate forward and side effects for ocean currents
    const oceanCurrentEffectForward = (data.ocean_current_velocity || 0) * Math.cos(relAngleRadCurrent); // Forward effect of ocean currents
    const oceanCurrentEffectSide = (data.ocean_current_velocity || 0) * Math.sin(relAngleRadCurrent); // Side effect of ocean currents

    // Calculate swell impact and wind wave energy
    const swellImpact = (data.swell_wave_height || 0) ** 2 * (data.swell_wave_period || 0); // Swell impact
    const windWaveEnergy = (data.wind_wave_height || 0) ** 2 * (data.wind_wave_period || 0); // Wind wave energy

    return {
        wind_wave_effect_forward: windWaveEffectForward,
        wind_wave_effect_side: windWaveEffectSide,
        swell_effect_forward: swellEffectForward,
        swell_effect_side: swellEffectSide,
        ocean_current_effect_forward: oceanCurrentEffectForward,
        ocean_current_effect_side: oceanCurrentEffectSide,
        swell_impact: swellImpact,
        wind_wave_energy: windWaveEnergy,
    };
}
