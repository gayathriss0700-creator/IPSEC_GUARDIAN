import json
import os
import datetime

try:
    from config import MODEL_CONFIG
except ImportError:
    from backend.config import MODEL_CONFIG


class ComplianceAgent:
    def __init__(self, rules_path=None):
        self.agent_name = "compliance_agent"
        self.rules_path = rules_path or MODEL_CONFIG["compliance_rules_path"]
        self.standards = self._load_rules()

    def _load_rules(self):
        if os.path.exists(self.rules_path):
            try:
                with open(self.rules_path, "r", encoding="utf-8") as f:
                    return json.load(f).get("standards", {})
            except Exception as e:
                print(f"[{self.agent_name}] Warning: Failed to load compliance rules from {self.rules_path}: {e}")
        return {}

    def analyze(self, configuration):
        timestamp = datetime.datetime.utcnow().isoformat() + "Z"
        cfg = configuration or {}
        compliance_results = {}
        total_checks = 0
        total_violations = 0
        all_violations = []
        all_recommendations = []

        for std_id, std_data in self.standards.items():
            std_name = std_data.get("name", std_id)
            controls = std_data.get("mandatory_controls", [])
            passed_controls = []
            failed_controls = []

            for control in controls:
                total_checks += 1
                field = control.get("field")
                expected = control.get("expected", [])
                rule_desc = control.get("rule", "")

                actual_val = cfg.get(field) or cfg.get(field.replace("esp", "ipsec_mode"))

                if actual_val and any(str(actual_val).lower() == str(exp).lower() for exp in expected):
                    passed_controls.append({
                        "field": field,
                        "actual": actual_val,
                        "rule": rule_desc,
                        "status": "PASS"
                    })
                else:
                    total_violations += 1
                    viol_item = {
                        "standard": std_name,
                        "field": field,
                        "actual": actual_val or "Not Specified",
                        "expected": expected,
                        "rule": rule_desc,
                        "status": "FAIL"
                    }
                    failed_controls.append(viol_item)
                    all_violations.append(viol_item)
                    all_recommendations.append(f"[{std_id}] Set {field} to one of {expected} to satisfy {rule_desc}.")

            std_status = "PASS"
            if failed_controls:
                std_status = "FAIL" if len(failed_controls) == len(controls) else "PARTIAL"

            compliance_results[std_id] = {
                "name": std_name,
                "status": std_status,
                "passed_controls_count": len(passed_controls),
                "failed_controls_count": len(failed_controls),
                "passed_controls": passed_controls,
                "failed_controls": failed_controls
            }

        overall_status = "PASS"
        if total_violations > 0:
            overall_status = "FAIL" if total_violations == total_checks else "PARTIAL"

        return {
            "agent": self.agent_name,
            "status": "COMPLETED",
            "timestamp": timestamp,
            "compliance_status": overall_status,
            "total_checks": total_checks,
            "total_violations": total_violations,
            "standards": compliance_results,
            "violations": all_violations,
            "recommendations": all_recommendations,
            "findings": [
                f"Evaluated {total_checks} policy controls across {len(self.standards)} standards. Compliance status: {overall_status} ({total_violations} violations)."
            ]
        }
