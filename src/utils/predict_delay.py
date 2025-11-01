import sys
import joblib
import numpy as np
import json
import os
import xgboost
import warnings

# Try using pandas to preserve feature names for scaler.transform
try:
    import pandas as pd  # type: ignore
    _has_pandas = True
except Exception:
    _has_pandas = False

# Expected feature names (must match the order the scaler/model was fitted on)
EXPECTED_FEATURE_NAMES = [
    "storm_wind",
    "wind_wave_effect_forward",
    "wind_wave_effect_side",
    "swell_effect_forward",
    "swell_effect_side",
    "ocean_current_effect_forward",
    "ocean_current_effect_side",
    "swell_impact",
    "wind_wave_energy",
    "distance_to_storm_nm",
]

try:
    # Parse arguments
    model_path = sys.argv[1]
    scaler_path = sys.argv[2]
    features = [float(x) for x in sys.argv[3:]]

    # Load the model
    model = joblib.load(model_path)

    # Validate input size (if model exposes n_features_in_)
    expected_features = getattr(model, "n_features_in_", len(EXPECTED_FEATURE_NAMES))
    if expected_features is not None and len(features) != expected_features:
        raise ValueError(f"Expected {expected_features} features, but got {len(features)}.")

    # Prepare input and make prediction
    X = np.array(features).reshape(1, -1)

    # --- Conditionally scale
    scaler = joblib.load(scaler_path) if os.path.exists(scaler_path) else None
    if scaler is not None:
        # If scaler was fitted with feature names, try to provide a DataFrame with the same columns
        feature_names_in = getattr(scaler, "feature_names_in_", None)

        # Build a DataFrame using the expected feature names (preferred)
        if _has_pandas:
            if len(features) == len(EXPECTED_FEATURE_NAMES):
                X_df = pd.DataFrame([features], columns=EXPECTED_FEATURE_NAMES)
            else:
                # fallback: unnamed columns
                X_df = pd.DataFrame([features])

            # If scaler has feature_names_in_ and they differ, try to reorder or map if possible
            if feature_names_in is not None:
                feature_names_in = list(feature_names_in)
                # If names match exactly, use them
                if feature_names_in == EXPECTED_FEATURE_NAMES:
                    X_for_scaler = X_df[feature_names_in]
                else:
                    # Try to align using EXPECTED_FEATURE_NAMES -> feature_names_in mapping
                    # If feature count matches, just set columns to scaler's names (trust order)
                    if len(feature_names_in) == X_df.shape[1]:
                        X_df.columns = feature_names_in
                        X_for_scaler = X_df
                    else:
                        # final fallback: use numpy array and suppress warning about feature names
                        warnings.filterwarnings("ignore", message="X does not have valid feature names")
                        X_for_scaler = X_df.values
            else:
                X_for_scaler = X_df
        else:
            # pandas not available, use numpy array and suppress warning
            warnings.filterwarnings("ignore", message="X does not have valid feature names")
            X_for_scaler = X

        try:
            X_scaled = scaler.transform(X_for_scaler)
            X = X_scaled
        except Exception as e:
            # fallback: try transforming the numpy array directly
            try:
                warnings.filterwarnings("ignore", message="X does not have valid feature names")
                X = scaler.transform(np.array(features).reshape(1, -1))
            except Exception as e2:
                raise RuntimeError(f"Scaler transform failed: {e}; fallback failed: {e2}")
    else:
        X = X

    # Predict and ensure native python types for JSON
    delay = model.predict(X)[0]
    delay_native = float(delay)

    # Output the result as JSON
    print(json.dumps({"target_delay": delay_native}))

except Exception as e:
    # ensure exception message is serializable
    print(json.dumps({"error": str(e)}))
    sys.exit(1)

