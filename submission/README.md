# CloudOps Enterprise Platform — Final Submission

**Submitted by:** Parth Chikane  
**Submission date:** 12 November 2026

## 1. Submission Contents

- `CloudOps-Enterprise-Platform-Project-Report.pdf` — Project report and implementation documentation.
- `Grafana-Monitoring-Evidence-Addendum.pdf` — Monitoring dashboard evidence and observations.
- `evidence/` — Application screenshots, Prometheus and Grafana evidence, Jenkins build screenshot, API responses, Kubernetes verification records, and Big Data/ML results.

## 2. Source Code

The complete source code is maintained in the GitHub repository:

[CloudOps Enterprise Platform — GitHub](https://github.com/Parth-727/CloudOps-Enterprise-Platform)

**Branch:** `main`

The latest submission commit should be checked in the repository after the final push.

## 3. Seven Project Deliverables

| Deliverable | Included implementation and evidence |
|---|---|
| 1. Cloud Architecture | Architecture document covering application design, VM setup, VPC, data flow and security |
| 2. Infrastructure as Code | Terraform configuration in `infrastructure/` |
| 3. CI/CD Pipeline | Jenkins pipeline and successful build evidence |
| 4. Docker and Kubernetes | Dockerfiles, Compose configuration and Kubernetes manifests |
| 5. Monitoring | Prometheus configuration, alert rules and Grafana evidence |
| 6. Deployed Cloud Application | Existing AWS EC2 application and application screenshot |
| 7. Big Data and ML | PySpark telemetry processing, Isolation Forest anomaly detection, metrics and graphs |

## 4. Big Data and Machine Learning Results

The project includes a synthetic cloud telemetry dataset containing 50,000 records across four simulated services.

Processing and analysis:
- Apache Spark data processing and service-level aggregation.
- Isolation Forest anomaly detection.
- Python-based data visualization.
- Exported anomaly results and performance summaries.

Experimental metrics:

| Metric | Result |
|---|---:|
| Records processed | 50,000 |
| Actual synthetic anomalies | 2,029 |
| Detected anomalies | 2,000 |
| Precision | 1.0000 |
| Recall | 0.9857 |
| F1 score | 0.9928 |

These results are from a controlled synthetic dataset and do not represent production incident prediction accuracy.

## 5. Microservices and Serverless Components

The repository includes:
- A Python FastAPI alert-processing microservice.
- A Python Lambda-compatible alert handler.
- Shared alert-processing logic.
- Unit tests covering normal telemetry, high-risk telemetry, missing fields and Lambda handler behaviour.

All four unit tests passed locally. These new components have not been deployed as production AWS services.

## 6. Implementation and Verification Notes

- The existing AWS EC2 application is deployed in the ap-south-1 region.
- Kubernetes was verified on a local Docker Desktop cluster, not Amazon EKS.
- The Jenkins pipeline includes frontend build, backend Maven build and backend Docker image build.
- The backend Maven package stage was run with automated tests skipped.
- The Prometheus target was shown as UP in the captured screenshot. Its last-scrape age was approximately 28 minutes at capture time.
- Some Grafana panels displayed "No data"; complete metric coverage has not been established.
- The submitted Jenkins screenshot shows build #3. Build #11 was separately reported as the latest successful pipeline execution.
- Terraform configuration is included as infrastructure-as-code; the configuration is not claimed as the source of the existing AWS deployment.
- Big Data/ML processing and the alert-processing unit tests were successfully executed locally.

## 7. Deployment Information

**Existing AWS application URL:**  
http://3.109.48.131

The AWS application deployment, local Docker Compose environment and local Kubernetes environment are separate deployment configurations.

## 8. Evidence Directory

The `evidence/` directory includes:

- Application dashboard screenshot.
- Prometheus target health screenshot.
- Grafana monitoring screenshots.
- Jenkins successful build screenshot.
- Backend API response files.
- Kubernetes deployment, node, pod and service verification.
- ML anomaly distribution graph.
- CPU usage distribution graph.
- ML confusion matrix.
- ML performance summary.
- Spark processing summary.

## 9. Final Submission Scope

This submission includes the project source code, infrastructure definitions, architecture documentation, CI/CD configuration, monitoring evidence, cloud application deployment information, and locally verified Big Data/ML and alert-processing components.

Implementation and deployment claims are limited to the available source code, test results and captured evidence.