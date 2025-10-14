import { NextResponse } from "next/server";
import { prepareModelData } from "@/utils/prepareModelData";
import { spawn } from "child_process";
import path from "path";

export async function GET(req: Request) {
    try {
        // Parse query parameters
        const { searchParams } = new URL(req.url);
        const lat1 = parseFloat(searchParams.get("lat1") || "");
        const lon1 = parseFloat(searchParams.get("lon1") || "");
        const lat2 = parseFloat(searchParams.get("lat2") || "");
        const lon2 = parseFloat(searchParams.get("lon2") || "");
        const course = parseFloat(searchParams.get("course") || "");

        if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2) || isNaN(course)) {
            return NextResponse.json(
                { error: "Invalid coordinates or course. Please provide valid lat1, lon1, lat2, lon2, and course." },
                { status: 400 }
            );
        }

        // Prepare model data
        const modelData = await prepareModelData({ lat1, lon1, lat2, lon2, course });

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
            parseFloat(modelData.distance_to_destination_nm),
            parseFloat(modelData.distance_to_storm_nm),
        ];

        console.log("Features for model prediction:", features);

        // Path to the AI model
        const modelPath = path.join(process.cwd(), "src", "utils", "random_forest_model.pkl");

        // Call the Python script to make the prediction
        const prediction = await new Promise<string>((resolve, reject) => {
            const pythonProcess = spawn("python3", [
                path.join(process.cwd(), "src", "utils", "predict_delay.py"),
                modelPath,
                ...features.map((f) => f.toString()),
            ]);

            let result = "";
            let error = "";

            pythonProcess.stdout.on("data", (data) => {
                result += data.toString();
            });

            pythonProcess.stderr.on("data", (data) => {
                error += data.toString();
            });

            pythonProcess.on("close", (code) => {
                if (code === 0) {
                    try {
                        const parsedResult = JSON.parse(result.trim());
                        resolve(parsedResult.target_delay.toString());
                    } catch (err) {
                        reject(new Error("Failed to parse Python script output."));
                    }
                } else {
                    reject(new Error(`Python process exited with code ${code}: ${error}`));
                }
            });
        });

        // Return the prediction result
        return NextResponse.json({
            target_delay: parseFloat(prediction),
            features: modelData, // Include the features for debugging or reference
        });
    } catch (error) {
        console.error("Error in delay prediction API:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
