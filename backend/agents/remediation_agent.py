import datetime


class RemediationAgent:
    def __init__(self):
        self.agent_name = "remediation_agent"

    def analyze(self, config_agent_res=None, vuln_agent_res=None, compliance_agent_res=None, reasoning_agent_res=None):
        timestamp = datetime.datetime.utcnow().isoformat() + "Z"
        recommendations = []

        config_recs = (config_agent_res or {}).get("recommendations", [])
        comp_recs = (compliance_agent_res or {}).get("recommendations", [])
        vulnerabilities = (vuln_agent_res or {}).get("vulnerabilities", [])

        # Priority 1: Vulnerability Remediations
        for vuln in vulnerabilities:
            title = vuln.get("title", "")
            sev = vuln.get("severity", "MEDIUM")
            control = vuln.get("related_control", "General")
            desc = vuln.get("description", "")

            prio = "HIGH" if sev in ["CRITICAL", "HIGH"] else "MEDIUM"

            rec_action = f"Remediation for {title}: {desc}"
            if "pfs" in control.lower():
                rec_action = "Enable Perfect Forward Secrecy (PFS) in Phase 2 / Child SA parameters using Diffie-Hellman Group 14 (2048-bit) or higher."
            elif "encryption" in control.lower() or "cipher" in title.lower():
                rec_action = "Upgrade ESP encryption algorithm to AES-256-GCM or AES-128-GCM with 128-bit authentication tag."
            elif "ike" in control.lower():
                rec_action = "Migrate key exchange protocol from IKEv1 to IKEv2 (RFC 7296) and disable IKEv1 daemons."
            elif "dh" in control.lower():
                rec_action = "Upgrade Diffie-Hellman Group from legacy group to MODP 2048-bit (Group 14) or ECP 256-bit (Group 19)."

            recommendations.append({
                "priority": prio,
                "issue": title,
                "recommendation": rec_action,
                "related_control": control,
                "reason": vuln.get("impact", "Mitigates identified vulnerability.")
            })

        # Priority 2: Compliance Recommendations
        for comp_rec in comp_recs:
            if not any(r["recommendation"] == comp_rec for r in recommendations):
                recommendations.append({
                    "priority": "MEDIUM",
                    "issue": "Policy Compliance Gap",
                    "recommendation": comp_rec,
                    "related_control": "Compliance",
                    "reason": "Aligns IPsec tunnel configuration with NIST SP 800-77 and NSA CNSA benchmarks."
                })

        # Priority 3: General Config Recommendations
        for cfg_rec in config_recs:
            if not any(r["recommendation"] == cfg_rec for r in recommendations):
                recommendations.append({
                    "priority": "LOW",
                    "issue": "Best Practice Adjustment",
                    "recommendation": cfg_rec,
                    "related_control": "Configuration",
                    "reason": "Improves overall IPsec security posture."
                })

        # Sort recommendations by priority (HIGH -> MEDIUM -> LOW)
        prio_order = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3}
        recommendations.sort(key=lambda x: prio_order.get(x.get("priority", "LOW"), 3))

        return {
            "agent": self.agent_name,
            "status": "COMPLETED",
            "timestamp": timestamp,
            "total_recommendations": len(recommendations),
            "recommendations": recommendations,
            "findings": [f"Generated {len(recommendations)} prioritized, actionable remediation steps."],
            "metadata": {"remediation_count": len(recommendations)}
        }
