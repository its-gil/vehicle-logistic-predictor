import sys
import joblib
import numpy as np

model_path = sys.argv[1]
features = [float(x) for x in sys.argv[2:]]

model = joblib.load(model_path)

X = np.array(features).reshape(1, -1)
delay = model.predict(X)[0]
print(delay)