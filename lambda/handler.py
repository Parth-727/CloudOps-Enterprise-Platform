import json
from alert_core import process_alert

def lambda_handler(event, context):
    try:
        body = event.get("body", event)
        if isinstance(body, str):
            body = json.loads(body)

        result = process_alert(body)

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(result)
        }
    except (ValueError, TypeError, json.JSONDecodeError) as exc:
        return {
            "statusCode": 400,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": str(exc)})
        }
