def process_alert(event):
    required = ["service", "cpu_usage", "memory_usage", "error_rate"]

    missing = [key for key in required if key not in event]
    if missing:
        raise ValueError("Missing fields: " + ", ".join(missing))

    cpu = float(event["cpu_usage"])
    memory = float(event["memory_usage"])
    errors = float(event["error_rate"])

    reasons = []
    if cpu >= 85:
        reasons.append("High CPU usage")
    if memory >= 85:
        reasons.append("High memory usage")
    if errors >= 10:
        reasons.append("High error rate")

    risk = "HIGH" if len(reasons) >= 2 else (
        "MEDIUM" if reasons else "NORMAL"
    )

    return {
        "service": str(event["service"]),
        "risk_level": risk,
        "alert": bool(reasons),
        "reasons": reasons,
        "recommended_action": (
            "Investigate service resource usage and error logs"
            if reasons else "Continue monitoring"
        )
    }
