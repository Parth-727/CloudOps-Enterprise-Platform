# CloudOps Intelligent Big Data and ML Analytics

## 1. Overview
This module demonstrates a cloud operations analytics pipeline that processes
synthetic infrastructure telemetry using Apache Spark and detects unusual
operational behaviour using a Scikit-learn Isolation Forest model.

## 2. Architecture
Synthetic telemetry -> CSV ingestion -> Apache Spark processing ->
feature scaling -> Isolation Forest -> anomaly results -> visual reports.

## 3. Dataset
- Records: 50,000
- Services: cloudops-api, frontend, auth-service, notification-service
- Metrics: CPU, memory, API latency, requests per minute and error rate
- Source: Reproducibly generated synthetic telemetry
- Synthetic anomaly records: 2,029

## 4. Big Data processing
Apache Spark reads the CSV dataset, removes missing and duplicate records,
calculates service-level aggregates and exports a summary.

Execution mode: local[2] on the development Mac.
This is a local Spark demonstration, not a distributed production cluster.

## 5. Machine Learning
Algorithm: Isolation Forest
Feature scaling: RobustScaler
Estimators: 150
Contamination parameter: 0.04
Random state: 42

## 6. Evaluation results
- Records analysed: 50,000
- Actual synthetic anomalies: 2,029
- ML-detected anomalies: 2,000
- True positives: 2,000
- False positives: 0
- False negatives: 29
- Precision: 1.0000
- Recall: 0.9857
- F1 score: 0.9928

These metrics are evaluated against generated synthetic labels. They do not
represent production incident prediction accuracy.

## 7. Generated evidence
- graphs/anomaly_distribution.png
- graphs/cpu_usage_distribution.png
- graphs/ml_confusion_matrix.png
- output/ml_summary.json
- output/spark_summary.json
- output/anomaly_results.csv
- output/spark_service_summary/

## 8. Run instructions
Create a Python 3.12 virtual environment and install requirements:

    python3.12 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt

Run from the repository root:

    python data-ml/scripts/generate_data.py
    python data-ml/scripts/spark_processing.py
    python data-ml/scripts/anomaly_detection.py
    python data-ml/scripts/visualize_results.py

Java 17 or a compatible Java runtime is required by the tested Spark setup.

## 9. Limitations
- Dataset is synthetic, not collected from live AWS production traffic.
- Spark runs locally using two workers.
- Model is a demonstration and requires real operational data,
  validation and tuning before production use.
- This module does not automatically remediate incidents.

## 10. Conclusion
The module demonstrates ingestion, large-scale batch processing,
service-level aggregation, unsupervised anomaly detection and
visual reporting for a CloudOps platform.
