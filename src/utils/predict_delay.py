import sys
import joblib
import numpy as np
import json

try:
    # Parse arguments
    model_path = sys.argv[1]
    features = [float(x) for x in sys.argv[2:]]

    # Load the model
    model = joblib.load(model_path)

    # Validate input size
    expected_features = model.n_features_in_
    if len(features) != expected_features:
        raise ValueError(f"Expected {expected_features} features, but got {len(features)}.")

    # Prepare input and make prediction
    X = np.array(features).reshape(1, -1)
    delay = model.predict(X)[0]

    # Output the result as JSON
    print(json.dumps({"target_delay": delay}))

except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)