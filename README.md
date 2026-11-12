# CloudOps Enterprise Platform

A cloud operations platform featuring a React dashboard, Spring Boot REST API, PostgreSQL database, Docker-based deployment, CI/CD, monitoring and Kubernetes resources.

## Technology Stack

- React 19, TypeScript, Vite
- Java 17, Spring Boot 3.5.7
- PostgreSQL 16
- Docker and Docker Compose
- Jenkins CI/CD
- Kubernetes (Docker Desktop local cluster)
- Prometheus and Grafana
- Spring Boot Actuator

## Project Structure

- `frontend/` — React dashboard
- `backend/cloudops-backend/` — Spring Boot backend
- `documentation/` — Architecture and project documentation
- `infrastructure/` — Infrastructure resources
- `jenkins/` — CI/CD pipeline resources
- `docker/` — Docker resources
- `monitoring/` — Monitoring configuration
- `microservices/` — Microservices resources
- `lambda/` — Serverless resources
- `nocode/` — No-code application resources
- `kubernetes/` — Kubernetes manifests
- `submission/` — Final report and verification evidence

## Run the Backend

From the project root:

```bash
cd backend/cloudops-backend
docker compose up --build -d
docker compose ps
```

Backend health: `http://localhost:8080/actuator/health`

Dashboard API: `http://localhost:8080/api/dashboard/summary`

## Run the Frontend

In another Terminal window:

```bash
cd ~/Desktop/CloudOps-Enterprise-Platform/frontend
npm install
npm run dev
```

Open the local URL printed by Vite.

## Backend API

| Method | Endpoint |
|---|---|
| GET | /api/status |
| GET | /api/dashboard/summary |
| GET | /api/services |
| GET | /api/deployments |
| POST | /api/services |
| POST | /api/deployments |

## Implementation and Verification Status

### Implemented and verified

- React frontend and Spring Boot backend
- PostgreSQL integration
- Docker image and Docker Compose setup
- Backend API endpoint checks
- Jenkins pipeline execution (latest reported successful run: build #11)
- Kubernetes manifests and local Docker Desktop deployment
- Prometheus target health evidence
- Grafana monitoring dashboard evidence
- AWS EC2 application deployment
- Final project report and supporting evidence in `submission/`

### Limitations and pending verification

- Kubernetes deployment is local Docker Desktop, not managed Kubernetes such as EKS.
- Automated Maven tests were skipped during the reported package build.
- Some Grafana panels showed no data; complete metric coverage is not established.
- Prometheus target was UP in the captured screenshot, but its last-scrape age was approximately 28 minutes.
- The Jenkins screenshot in the submission shows build #3; build #11 was separately reported as the latest successful run.
- Terraform deployment has not been verified as completed.
- Big Data/ML pipeline and no-code application requirements remain unverified against the original assignment rubric.

## Deployment

The project has an AWS EC2 deployment.

Application URL: `http://3.109.48.131`

The local Docker Compose and Docker Desktop Kubernetes setups are separate from the AWS deployment.

## Final Submission

See the `submission/` directory for:

- Project report PDF
- Grafana monitoring addendum
- Application and monitoring screenshots
- API verification JSON files
- Kubernetes verification evidence
- Submission README

Source repository:
https://github.com/Parth-727/CloudOps-Enterprise-Platform

Latest submission commit: `48545e1`

## Security Note

Default database credentials are intended for local development only. Never commit production credentials, private keys or secret files.
