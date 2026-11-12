# CloudOps Enterprise Platform — Final Submission

**Submitted by:** Parth Chikane
**Submission date:** 12 November 2026

## Contents

- `CloudOps-Enterprise-Platform-Project-Report.pdf` — Final project report with architecture, implementation details and visual evidence.
- `Grafana-Monitoring-Evidence-Addendum.pdf` — Additional monitoring dashboard evidence and observations.
- `evidence/` — Application screenshots, Prometheus and Grafana evidence, Jenkins screenshot, API responses and Kubernetes verification records.

## Source Code

The complete source code is maintained in the GitHub repository:

https://github.com/Parth-727/CloudOps-Enterprise-Platform

**Branch:** `main`
**Latest submission commit:** `48545e1`

This submission folder contains the final report and supporting evidence. The complete source code is maintained separately in the GitHub repository.

## Implementation and Verification Notes

- Kubernetes deployment was performed on a local Docker Desktop Kubernetes cluster, not managed cloud Kubernetes such as Amazon EKS.
- The backend Maven package stage completed with automated tests skipped.
- Some Grafana panels displayed "No data"; complete metric coverage has not been established.
- The Prometheus target was shown as UP in the captured screenshot. The last-scrape age was approximately 28 minutes at capture time.
- The included Jenkins screenshot shows build #3. Build #11 was separately reported as the latest successful pipeline execution.
- Big Data/ML pipeline and no-code application requirements remain unverified because the original assignment rubric was not available.

## Deployment Information

The project also has an AWS EC2 application deployment.

**Application URL:** http://3.109.48.131

The AWS application deployment, local Docker Compose environment and local Kubernetes environment are separate deployment configurations.

## Submission Scope

This folder provides the final project documentation and available verification evidence. Claims about implementation and deployment are limited to the features and results documented in the report and evidence files.
