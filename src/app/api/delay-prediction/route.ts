import { NextResponse } from "next/server";
import { prepareModelData } from "@/utils/prepareModelData";
import { spawn } from "child_process";
import path from "path";
import { MarineWeatherInput, StormPoint } from "@/types";

export async function GET(req: Request) {
    try {
        // Parse query parameters
        const { searchParams } = new URL(req.url);
        const lat1 = parseFloat(searchParams.get("lat1") || "");
        const lon1 = parseFloat(searchParams.get("lon1") || "");
        const lat2 = parseFloat(searchParams.get("lat2") || "");
        const lon2 = parseFloat(searchParams.get("lon2") || "");
        const course = parseFloat(searchParams.get("course") || "");
        const activeStormsParam = searchParams.get("activeStorms");
        const marineWeatherParam = searchParams.get("marineWeather");

        if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2) || isNaN(course)) {
            return NextResponse.json(
                { error: "Invalid coordinates or course. Please provide valid lat1, lon1, lat2, lon2, and course." },
                { status: 400 }
            );
        }

        let activeStorms: StormPoint[] = [];
        if (activeStormsParam) {
            try {
                activeStorms = JSON.parse(activeStormsParam) as StormPoint[];
            } catch (err) {
                return NextResponse.json({ error: "Invalid activeStorms JSON" }, { status: 400 });
            }
        }

        console.log("Marine weather param:", marineWeatherParam);

        let marineWeather: MarineWeatherInput | null = null;
        if (marineWeatherParam) {
            try {
                marineWeather = JSON.parse(marineWeatherParam) as MarineWeatherInput;
            } catch (err) {
                return NextResponse.json({ error: "Invalid marineWeather JSON" }, { status: 400 });
            }
        }

        const marineWeatherInput: MarineWeatherInput = marineWeather || ({} as MarineWeatherInput);

        const modelData = await prepareModelData({
            lat1,
            lon1,
            lat2,
            lon2,
            course,
            activeStorms,
            marineWeather: marineWeatherInput,
        });

        console.log("Prepared model data:", modelData);

        // Extract features in the required order for the model
        const features = [
            parseFloat(modelData.storm_wind), // Storm wind intensity
            parseFloat(modelData.wind_wave_effect_forward),
            parseFloat(modelData.wind_wave_effect_side),
            parseFloat(modelData.swell_effect_forward),
            parseFloat(modelData.swell_effect_side),
            parseFloat(modelData.ocean_current_effect_forward),
            parseFloat(modelData.ocean_current_effect_side),
            parseFloat(modelData.swell_impact),
            parseFloat(modelData.wind_wave_energy),
            // parseFloat(modelData.distance_to_destination_nm),
            parseFloat(modelData.distance_to_storm_nm),
        ];

        // Validate features before calling Python
        const invalidIdx = features.findIndex((f) => !Number.isFinite(f));
        if (invalidIdx !== -1) {
            console.error("Invalid feature detected at index", invalidIdx, "value:", features[invalidIdx]);
            return NextResponse.json(
                { error: "Invalid model features (NaN/Infinity)", features, modelData },
                { status: 400 }
            );
        }

        // Path to the AI model
        const modelPath = path.join(process.cwd(), "src", "utils", "best_model.pkl");
        const scalerPath = path.join(process.cwd(), "src", "utils", "model_scaler.pkl");

        // Call the Python script to make the prediction
        // Use 'python' on Windows, 'python3' on Unix-like systems
        const pythonCommand = process.platform === "win32" ? "python" : "python3";
        const prediction = await new Promise<string>((resolve, reject) => {
            const pythonProcess = spawn(
                pythonCommand,
                [
                    path.join(process.cwd(), "src", "utils", "predict_delay.py"),
                    modelPath,
                    scalerPath,
                    ...features.map((f) => String(f)),
                ],
                {
                    env: { ...process.env, PYTHONUNBUFFERED: "1" },
                    stdio: ["ignore", "pipe", "pipe"],
                }
            );

            let result = "";
            let error = "";

            pythonProcess.stdout.on("data", (data) => {
                result += data.toString();
                // also log progressively for debugging
                console.log("python stdout chunk:", data.toString());
            });

            pythonProcess.stderr.on("data", (data) => {
                error += data.toString();
                console.error("python stderr chunk:", data.toString());
            });

            pythonProcess.on("close", (code) => {
                if (code === 0) {
                    try {
                        const parsedResult = JSON.parse(result.trim());
                        if (parsedResult && typeof parsedResult.target_delay !== "undefined") {
                            resolve(parsedResult.target_delay.toString());
                        } else {
                            reject(new Error("Python output missing target_delay: " + result));
                        }
                    } catch (err) {
                        reject(
                            new Error(
                                "Failed to parse Python script output. raw stdout: " + result + " stderr: " + error
                            )
                        );
                    }
                } else {
                    reject(new Error(`Python process exited with code ${code}. stdout: ${result} stderr: ${error}`));
                }
            });
        });

        console.log("Predicted delay:", prediction);

        // Return the prediction result
        const rawPrediction = parseFloat(prediction);
        if (isNaN(rawPrediction)) {
            return NextResponse.json({ error: "Invalid prediction from model" }, { status: 500 });
        }
        // Round up to 2 decimal places
        const target_delay = Math.ceil(rawPrediction * 100) / 100;

        return NextResponse.json({
            target_delay,
            features: modelData, // Include the features for debugging or reference
        });
    } catch (error) {
        console.error("Error in delay prediction API:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
