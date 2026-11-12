
# CloudOps Enterprise Platform

A cloud operations platform project featuring a React dashboard, Spring Boot REST API, PostgreSQL database, and Docker-based deployment.

## Technology Stack

- React 19, TypeScript, Vite
- Java 17, Spring Boot 3.5.7
- PostgreSQL 16
- Docker and Docker Compose
- Spring Boot Actuator

## Project Structure

- `frontend/` — React dashboard
- `backend/cloudops-backend/` — Spring Boot backend
- `documentation/` — Architecture and project documentation
- `infrastructure/` — Infrastructure as Code
- `jenkins/` — CI/CD pipeline
- `docker/` — Docker resources
- `monitoring/` — Monitoring configuration
- `microservices/` — Microservices resources
- `lambda/` — Serverless resources
- `nocode/` — No-code application resources
- `screenshots/` — Project evidence

## Run the Backend

Open Terminal in the project root and execute:

    cd backend/cloudops-backend
    docker compose up --build -d

Check containers:

    docker compose ps

Backend health:

    http://localhost:8080/actuator/health

Dashboard API:

    http://localhost:8080/api/dashboard/summary

## Run the Frontend

Open another Terminal window:

    cd ~/Desktop/CloudOps-Enterprise-Platform/frontend
    npm install
    npm run dev

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

## Implementation Status

Completed:
- Frontend production build
- Spring Boot backend
- PostgreSQL database integration
- Docker image and Compose deployment
- API and health endpoint verification
- Architecture documentation

Remaining:
- Terraform infrastructure
- CI/CD pipeline
- Kubernetes manifests
- Monitoring evidence
- Big Data and ML pipeline summary
- No-code application
- Final deployment evidence

## Notes

The current Docker Compose setup is a local deployment. A public cloud deployment must be completed and verified separately before claiming a live cloud URL.

Default database credentials are for local development only. Never commit production credentials or secret files.
