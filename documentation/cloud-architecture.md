
# CloudOps Enterprise Platform

## Project Overview
A cloud operations dashboard for monitoring services, deployments, and application health.

## Technology Stack
- Frontend: React 19, TypeScript, Vite
- Backend: Java 17, Spring Boot 3.5.7
- API: REST
- Database: PostgreSQL 16
- ORM: Spring Data JPA and Hibernate
- Containers: Docker
- Orchestration: Docker Compose
- Health monitoring: Spring Boot Actuator

## Architecture

User / Browser
    |
    v
React Frontend
    |
    | HTTP REST API
    v
Spring Boot Backend
    |
    | Spring Data JPA
    v
PostgreSQL Database

Spring Boot Actuator provides application and database health information.
Docker Compose manages the backend and PostgreSQL containers.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/dashboard/summary | Dashboard metrics |
| GET | /api/services | List services |
| GET | /api/deployments | List deployments |
| POST | /api/services | Add service |
| POST | /api/deployments | Add deployment |
| GET | /actuator/health | Health status |

## Deployment
The backend and PostgreSQL are currently running locally through Docker Compose.

Backend port: 8080
Database port: 5432
Persistent volume: cloudops_postgres_data

## Security
- Credentials are supplied using environment variables.
- Default credentials are for local development only.
- Production deployment requires secure secrets and restricted network access.

## Completed Work
- React frontend production build verified.
- Spring Boot backend implemented.
- PostgreSQL connection verified.
- Docker image built successfully.
- Docker Compose containers running.
- API endpoints tested successfully.

## Pending Work
- Cloud infrastructure provisioning.
- CI/CD pipeline.
- Kubernetes manifests.
- Monitoring dashboard.
- Big Data and ML pipeline summary.
- No-code application.
- Cloud deployment evidence.
