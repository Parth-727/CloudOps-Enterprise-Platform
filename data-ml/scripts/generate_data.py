import csv
import random
from datetime import datetime, timedelta
from pathlib import Path

random.seed(42)

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "cloud_telemetry.csv"
OUT.parent.mkdir(parents=True, exist_ok=True)

services = ["cloudops-api", "frontend", "auth-service", "notification-service"]
start = datetime(2026, 11, 1, 0, 0, 0)

fields = [
    "timestamp", "service", "cpu_usage", "memory_usage",
    "api_latency_ms", "requests_per_minute", "error_rate",
    "is_synthetic_anomaly"
]

with OUT.open("w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=fields)
    writer.writeheader()

    for i in range(50000):
        anomaly = 1 if random.random() < 0.04 else 0

        if anomaly:
            cpu = random.uniform(82, 100)
            memory = random.uniform(80, 99)
            latency = random.uniform(1200, 4000)
            requests = random.uniform(900, 2000)
            error = random.uniform(10, 35)
        else:
            cpu = random.uniform(12, 68)
            memory = random.uniform(25, 75)
            latency = random.uniform(30, 450)
            requests = random.uniform(30, 800)
            error = random.uniform(0, 4)

        writer.writerow({
            "timestamp": (start + timedelta(minutes=i)).isoformat(),
            "service": random.choice(services),
            "cpu_usage": round(cpu, 2),
            "memory_usage": round(memory, 2),
            "api_latency_ms": round(latency, 2),
            "requests_per_minute": round(requests, 2),
            "error_rate": round(error, 2),
            "is_synthetic_anomaly": anomaly
        })

print(f"Generated 50,000 records: {OUT}")
