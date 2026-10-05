import os
import joblib
import numpy as np
import pandas as pd
import datetime

try:
    from config import MODEL_CONFIG
except ImportError:
    from backend.config import MODEL_CONFIG

_RF_MODEL_INSTANCE = None
_RF_FEATURE_NAMES = [
    "source_port", "destination_port", "protocol", "duration",
    "packet_count", "bytes_sent", "bytes_received", "bytes_per_packet"
]


def get_rf_model():
    global _RF_MODEL_INSTANCE, _RF_FEATURE_NAMES
    if _RF_MODEL_INSTANCE is None:
        model_path = MODEL_CONFIG["ml_model_path"]
        if os.path.exists(model_path):
            try:
                _RF_MODEL_INSTANCE = joblib.load(model_path)
                _RF_FEATURE_NAMES = list(
                    getattr(_RF_MODEL_INSTANCE, "feature_names_in_", _RF_FEATURE_NAMES)
                )
                print(f"[ThreatDetectionAgent] Loaded Random Forest model from {model_path}")
            except Exception as e:
                print(f"[ThreatDetectionAgent] Error loading Random Forest model: {e}")
        else:
            print(f"[ThreatDetectionAgent] Warning: ML model file not found at {model_path}")
    return _RF_MODEL_INSTANCE, _RF_FEATURE_NAMES


class ThreatDetectionAgent:
    def __init__(self):
        self.agent_name = "threat_detection_agent"

    def analyze(self, traffic=None):
        timestamp = datetime.datetime.utcnow().isoformat() + "Z"
        traffic = traffic or {}

        rf_model, feature_names = get_rf_model()

        if rf_model is None:
            return {
                "agent": self.agent_name,
                "status": "FAILED",
                "timestamp": timestamp,
                "input_summary": traffic,
                "prediction": "Model Offline",
                "confidence": 0.0,
                "risk_level": "UNKNOWN",
                "score": 50,
                "findings": ["Random Forest model is not loaded."],
                "recommendations": ["Ensure backend/ml/network_traffic_model.joblib is present."],
                "metadata": {}
            }

        feature_values = {
            "source_port": float(traffic.get("source_port", 50000)),
            "destination_port": float(traffic.get("destination_port", 443)),
            "protocol": float(traffic.get("protocol", 6)),
            "duration": float(traffic.get("duration", 2)),
            "packet_count": float(traffic.get("packet_count", 50)),
            "bytes_sent": float(traffic.get("bytes_sent", 5000)),
            "bytes_received": float(traffic.get("bytes_received", 7000)),
            "bytes_per_packet": float(traffic.get("bytes_per_packet", 150))
        }

        ml_row = {}
        for feature in feature_names:
            ml_row[feature] = feature_values.get(feature, 0.0)

        df = pd.DataFrame([ml_row], columns=feature_names)

        try:
            predicted_class = rf_model.predict(df)[0]
            probabilities = rf_model.predict_proba(df)[0]
            confidence = float(np.max(probabilities))
            class_probs = {
                str(cls): float(prob)
                for cls, prob in zip(rf_model.classes_, probabilities)
            }
        except Exception as e:
            return {
                "agent": self.agent_name,
                "status": "FAILED",
                "timestamp": timestamp,
                "error": f"Prediction failed: {str(e)}",
                "risk_level": "UNKNOWN",
                "score": 0
            }

        model_params = {
            "model_type": "RandomForestClassifier",
            "n_estimators": getattr(rf_model, "n_estimators", None),
            "max_depth": getattr(rf_model, "max_depth", None),
            "classes": [str(c) for c in getattr(rf_model, "classes_", [])],
            "feature_importances": {
                name: float(imp) for name, imp in zip(feature_names, getattr(rf_model, "feature_importances_", []))
            } if hasattr(rf_model, "feature_importances_") else {}
        }

        pred_str = str(predicted_class)
        risk_level = "LOW"
        if pred_str not in ["0", "normal", "benign"] and confidence > 0.6:
            risk_level = "HIGH"

        return {
            "agent": self.agent_name,
            "status": "COMPLETED",
            "timestamp": timestamp,
            "input_summary": feature_values,
            "prediction": pred_str,
            "confidence": confidence,
            "class_probabilities": class_probs,
            "risk_level": risk_level,
            "score": int(confidence * 100),
            "model": "Random Forest",
            "findings": [
                f"Traffic flow classified as Class '{pred_str}' with {confidence * 100:.1f}% confidence."
            ],
            "recommendations": [
                "Monitor for anomalous flow volumes if class prediction deviates from baseline."
            ],
            "metadata": model_params
        }
