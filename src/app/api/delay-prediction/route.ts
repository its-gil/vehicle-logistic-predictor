import { NextRequest } from "next/server";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";

// List of expected input fields
const INPUT_FIELDS = [
    "max_storm_wind_300nm_24hr",
    "avg_wave_height",
    "avg_wave_direction",
    "avg_wave_period",
    "avg_wind_wave_height",
    "avg_wind_wave_direction",
    "avg_wind_wave_period",
    "avg_swell_wave_height",
    "avg_swell_wave_direction",
    "avg_swell_wave_period",
    "avg_ocean_current_velocity",
    "avg_ocean_current_direction",
    "avg_wind_speed_10m",
    "avg_wind_direction_10m",
];

export async function POST(req: NextRequest) {
    const body = await req.json();

    // Validate input
    for (const field of INPUT_FIELDS) {
        if (!(field in body)) {
            return new Response(JSON.stringify({ error: `Missing field: ${field}` }), { status: 400 });
        }
    }

    // Prepare input for Python script
    const inputValues = INPUT_FIELDS.map((field) => body[field]);

    // Path to your model and script
    const modelPath = path.join(process.cwd(), "public", "random_forest_model.pkl");
    const scriptPath = path.join(process.cwd(), "src", "utils", "predict_delay.py");

    // Check if model and script exist
    if (!fs.existsSync(modelPath) || !fs.existsSync(scriptPath)) {
        return new Response(JSON.stringify({ error: "Model or script not found" }), { status: 500 });
    }

    // Call Python script to get prediction
    return new Promise<Response>((resolve) => {
        const py = spawn("python3", [scriptPath, modelPath, ...inputValues.map(String)]);
        let result = "";
        let error = "";

        py.stdout.on("data", (data) => {
            result += data.toString();
        });

        py.stderr.on("data", (data) => {
            error += data.toString();
        });

        py.on("close", (code) => {
            if (code !== 0 || error) {
                resolve(new Response(JSON.stringify({ error: error || "Prediction failed" }), { status: 500 }));
            } else {
                // Expect the Python script to print the delay value
                resolve(new Response(JSON.stringify({ delay: parseFloat(result.trim()) })));
            }
        });
    });
}
