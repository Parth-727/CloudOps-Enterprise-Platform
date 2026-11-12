import csv
import json
from pathlib import Path
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import RobustScaler
from sklearn.metrics import classification_report, confusion_matrix

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "data" / "cloud_telemetry.csv"
OUTPUT = ROOT / "output"
OUTPUT.mkdir(parents=True, exist_ok=True)

features = [
    "cpu_usage", "memory_usage", "api_latency_ms",
    "requests_per_minute", "error_rate"
]

with SOURCE.open() as f:
    rows = list(csv.DictReader(f))

X = np.array([[float(row[k]) for k in features] for row in rows])
y_true = np.array([int(row["is_synthetic_anomaly"]) for row in rows])

scaler = RobustScaler()
X_scaled = scaler.fit_transform(X)

model = IsolationForest(
    n_estimators=150,
    contamination=0.04,
    random_state=42
)
model.fit(X_scaled)

predictions = model.predict(X_scaled)
y_pred = (predictions == -1).astype(int)
scores = model.decision_function(X_scaled)

result_path = OUTPUT / "anomaly_results.csv"
with result_path.open("w", newline="") as f:
    writer = csv.DictWriter(
        f, fieldnames=[
            "timestamp", "service", *features,
            "actual_synthetic_anomaly", "ml_anomaly",
            "anomaly_score", "status"
        ]
    )
    writer.writeheader()

    for row, pred, score in zip(rows, y_pred, scores):
        writer.writerow({
            **{k: row[k] for k in ["timestamp", "service", *features]},
            "actual_synthetic_anomaly": row["is_synthetic_anomaly"],
            "ml_anomaly": int(pred),
            "anomaly_score": round(float(score), 6),
            "status": "ANOMALY" if pred else "NORMAL"
        })

report = classification_report(
    y_true, y_pred, output_dict=True, zero_division=0
)
tn, fp, fn, tp = confusion_matrix(y_true, y_pred, labels=[0, 1]).ravel()

summary = {
    "model": "Isolation Forest",
    "records_analysed": len(rows),
    "actual_synthetic_anomalies": int(y_true.sum()),
    "ml_detected_anomalies": int(y_pred.sum()),
    "true_positives": int(tp),
    "false_positives": int(fp),
    "false_negatives": int(fn),
    "precision": round(report["1"]["precision"], 4),
    "recall": round(report["1"]["recall"], 4),
    "f1_score": round(report["1"]["f1-score"], 4),
    "note": "Evaluation uses synthetic labels; not production incident prediction."
}

with (OUTPUT / "ml_summary.json").open("w") as f:
    json.dump(summary, f, indent=2)

print(json.dumps(summary, indent=2))
print("ML ANOMALY DETECTION COMPLETED")
