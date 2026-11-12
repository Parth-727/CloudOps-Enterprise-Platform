from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from alert_core import process_alert

app = FastAPI(
    title="CloudOps Alert Processing Service",
    version="1.0.0",
    description="Processes cloud telemetry and classifies operational alerts."
)

class Telemetry(BaseModel):
    service: str
    cpu_usage: float
    memory_usage: float
    error_rate: float

@app.get("/health")
def health():
    return {"status": "healthy", "service": "cloudops-alert-service"}

@app.post("/api/alerts/process")
def process_telemetry(data: Telemetry):
    try:
        return process_alert(data.model_dump())
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
