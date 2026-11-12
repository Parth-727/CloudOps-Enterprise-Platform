import csv
import json
from pathlib import Path
import matplotlib.pyplot as plt
import numpy as np
from sklearn.metrics import ConfusionMatrixDisplay, confusion_matrix

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "graphs"
OUT.mkdir(parents=True, exist_ok=True)

with (ROOT / "output" / "anomaly_results.csv").open() as f:
    rows = list(csv.DictReader(f))

cpu = np.array([float(r["cpu_usage"]) for r in rows])
pred = np.array([int(r["ml_anomaly"]) for r in rows])
actual = np.array([int(r["actual_synthetic_anomaly"]) for r in rows])

# 1. Normal vs anomaly distribution
plt.figure(figsize=(8, 5))
plt.bar(
    ["Normal", "ML detected anomaly"],
    [int((pred == 0).sum()), int((pred == 1).sum())]
)
plt.title("CloudOps ML Anomaly Distribution")
plt.ylabel("Number of records")
plt.tight_layout()
plt.savefig(OUT / "anomaly_distribution.png", dpi=160)
plt.close()

# 2. CPU usage comparison
plt.figure(figsize=(8, 5))
plt.hist(cpu[actual == 0], bins=35, alpha=0.7, label="Normal")
plt.hist(cpu[actual == 1], bins=35, alpha=0.7, label="Synthetic anomaly")
plt.title("CPU Usage Distribution")
plt.xlabel("CPU usage (%)")
plt.ylabel("Number of records")
plt.legend()
plt.tight_layout()
plt.savefig(OUT / "cpu_usage_distribution.png", dpi=160)
plt.close()

# 3. Confusion matrix
cm = confusion_matrix(actual, pred, labels=[0, 1])
display = ConfusionMatrixDisplay(
    confusion_matrix=cm,
    display_labels=["Normal", "Anomaly"]
)
display.plot(values_format="d")
plt.title("Isolation Forest - Confusion Matrix")
plt.tight_layout()
plt.savefig(OUT / "ml_confusion_matrix.png", dpi=160)
plt.close()

with (ROOT / "output" / "ml_summary.json").open() as f:
    summary = json.load(f)

print("GENERATED GRAPHS:")
for path in sorted(OUT.glob("*.png")):
    print(path.name)

print("\nML PERFORMANCE:")
print("Precision:", summary["precision"])
print("Recall:", summary["recall"])
print("F1 score:", summary["f1_score"])
