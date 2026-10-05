import json
import os
import datetime

try:
    from config import MODEL_CONFIG
except ImportError:
    from backend.config import MODEL_CONFIG


class IPsecConfigurationAgent:
    def __init__(self, rules_path=None):
        self.agent_name = "configuration_agent"
        self.rules_path = rules_path or MODEL_CONFIG["ipsec_rules_path"]
        self.rules = self._load_rules()

    def _load_rules(self):
        if os.path.exists(self.rules_path):
            try:
                with open(self.rules_path, "r", encoding="utf-8") as f:
                    return json.load(f).get("rules", {})
            except Exception as e:
                print(f"[{self.agent_name}] Warning: Failed to load rules from {self.rules_path}: {e}")
        return {}

    def analyze(self, configuration):
        timestamp = datetime.datetime.utcnow().isoformat() + "Z"
        findings = []
        recommendations = []
        score = 100

        cfg = {
            "ike_version": configuration.get("ike_version") or configuration.get("ike"),
            "encryption": configuration.get("encryption"),
            "integrity": configuration.get("integrity"),
            "authentication": configuration.get("authentication") or configuration.get("auth"),
            "dh_group": configuration.get("dh_group") or configuration.get("dh"),
            "pfs": configuration.get("pfs"),
            "esp": configuration.get("esp") or configuration.get("esp_mode"),
            "nat_t": configuration.get("nat_t"),
            "replay_protection": configuration.get("replay_protection") or configuration.get("anti_replay"),
            "traffic_selectors": configuration.get("traffic_selectors"),
        }

        # 1. IKE Version Check
        ike_val = cfg.get("ike_version")
        if ike_val in ["IKEv1", "v1"]:
            rule = self.rules.get("ike_version", {}).get("penalties", {}).get("IKEv1", {})
            findings.append({
                "field": "ike_version",
                "value": ike_val,
                "severity": rule.get("severity", "HIGH"),
                "issue": "Legacy IKE Version",
                "detail": rule.get("finding", "IKEv1 is legacy and vulnerable to aggressive mode PSK offline cracking.")
            })
            score -= rule.get("penalty", 25)
            recommendations.append("Upgrade from IKEv1 to IKEv2.")

        # 2. Encryption Check
        enc_val = cfg.get("encryption")
        if enc_val:
            penalties = self.rules.get("encryption", {}).get("penalties", {})
            if enc_val in penalties:
                rule = penalties[enc_val]
                findings.append({
                    "field": "encryption",
                    "value": enc_val,
                    "severity": rule.get("severity", "CRITICAL"),
                    "issue": "Weak Cipher Algorithm",
                    "detail": rule.get("finding", f"Cipher {enc_val} is cryptographically weak or deprecated.")
                })
                score -= rule.get("penalty", 35)
                recommendations.append(f"Replace cipher {enc_val} with AES-256-GCM or AES-128-GCM.")

        # 3. Integrity Check
        int_val = cfg.get("integrity")
        if int_val:
            penalties = self.rules.get("integrity", {}).get("penalties", {})
            if int_val in penalties:
                rule = penalties[int_val]
                findings.append({
                    "field": "integrity",
                    "value": int_val,
                    "severity": rule.get("severity", "HIGH"),
                    "issue": "Weak Integrity Hash",
                    "detail": rule.get("finding", f"Hash algorithm {int_val} is deprecated.")
                })
                score -= rule.get("penalty", 25)
                recommendations.append(f"Upgrade integrity algorithm {int_val} to SHA-256 or SHA-512.")

        # 4. DH Group Check
        dh_val = cfg.get("dh_group")
        if dh_val:
            penalties = self.rules.get("dh_group", {}).get("penalties", {})
            if dh_val in penalties:
                rule = penalties[dh_val]
                findings.append({
                    "field": "dh_group",
                    "value": dh_val,
                    "severity": rule.get("severity", "HIGH"),
                    "issue": "Weak Diffie-Hellman Group",
                    "detail": rule.get("finding", f"DH Group {dh_val} offers insufficient security strength.")
                })
                score -= rule.get("penalty", 25)
                recommendations.append(f"Upgrade Diffie-Hellman Group {dh_val} to Group 14 (2048-bit) or higher.")

        # 5. PFS Check
        pfs_val = str(cfg.get("pfs")).strip()
        if pfs_val.lower() in ["disabled", "false", "no", "off"]:
            rule = self.rules.get("pfs", {}).get("penalties", {}).get("Disabled", {})
            findings.append({
                "field": "pfs",
                "value": pfs_val,
                "severity": rule.get("severity", "HIGH"),
                "issue": "Perfect Forward Secrecy Disabled",
                "detail": rule.get("finding", "PFS is disabled. Session key compromise compromises past traffic.")
            })
            score -= rule.get("penalty", 30)
            recommendations.append("Enable Perfect Forward Secrecy (PFS) for Child SAs.")

        # 6. Anti-Replay Check
        replay_val = str(cfg.get("replay_protection")).strip()
        if replay_val.lower() in ["disabled", "false", "no", "off"]:
            rule = self.rules.get("replay_protection", {}).get("penalties", {}).get("Disabled", {})
            findings.append({
                "field": "replay_protection",
                "value": replay_val,
                "severity": rule.get("severity", "HIGH"),
                "issue": "Anti-Replay Protection Disabled",
                "detail": rule.get("finding", "Anti-replay protection is disabled.")
            })
            score -= rule.get("penalty", 25)
            recommendations.append("Enable Anti-Replay sequence window protection.")

        # 7. Traffic Selectors Check
        ts_val = cfg.get("traffic_selectors")
        if ts_val in ["Any", "0.0.0.0/0", "Broad"]:
            rule = self.rules.get("traffic_selectors", {}).get("penalties", {}).get(ts_val, {})
            findings.append({
                "field": "traffic_selectors",
                "value": ts_val,
                "severity": rule.get("severity", "MEDIUM"),
                "issue": "Overly Broad Traffic Selectors",
                "detail": rule.get("finding", "Broad traffic selectors increase attack surface.")
            })
            score -= rule.get("penalty", 15)
            recommendations.append("Restrict traffic selectors to explicit local/remote subnets.")

        score = max(0, min(100, score))

        if score >= 90:
            risk_level = "LOW"
        elif score >= 70:
            risk_level = "MEDIUM"
        elif score >= 40:
            risk_level = "HIGH"
        else:
            risk_level = "CRITICAL"

        return {
            "agent": self.agent_name,
            "status": "COMPLETED",
            "timestamp": timestamp,
            "input_summary": configuration,
            "findings": findings,
            "risk_level": risk_level,
            "score": score,
            "evidence": [],
            "recommendations": recommendations,
            "metadata": {"total_findings": len(findings)}
        }
