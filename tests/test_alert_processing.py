import importlib.util
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SERVICE = ROOT / "microservices" / "alert-service"

sys.path.insert(0, str(SERVICE))
from alert_core import process_alert

spec = importlib.util.spec_from_file_location(
    "lambda_handler_module", ROOT / "lambda" / "handler.py"
)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class AlertTests(unittest.TestCase):
    def test_normal_telemetry(self):
        result = process_alert({
            "service": "frontend",
            "cpu_usage": 35,
            "memory_usage": 45,
            "error_rate": 1
        })
        self.assertEqual(result["risk_level"], "NORMAL")
        self.assertFalse(result["alert"])

    def test_high_risk_telemetry(self):
        result = process_alert({
            "service": "cloudops-api",
            "cpu_usage": 95,
            "memory_usage": 92,
            "error_rate": 20
        })
        self.assertEqual(result["risk_level"], "HIGH")
        self.assertTrue(result["alert"])

    def test_missing_fields(self):
        with self.assertRaises(ValueError):
            process_alert({"service": "frontend"})

    def test_lambda_handler(self):
        response = module.lambda_handler({
            "service": "cloudops-api",
            "cpu_usage": 95,
            "memory_usage": 90,
            "error_rate": 15
        }, None)
        self.assertEqual(response["statusCode"], 200)
        self.assertEqual(
            json.loads(response["body"])["risk_level"], "HIGH"
        )

if __name__ == "__main__":
    unittest.main(verbosity=2)
