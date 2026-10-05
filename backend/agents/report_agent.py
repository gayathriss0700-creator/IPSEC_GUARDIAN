import datetime


class SecurityReportAgent:
    def __init__(self):
        self.agent_name = "report_agent"

    def compile_report(self, agent_outputs, execution_statuses):
        timestamp = datetime.datetime.utcnow().isoformat() + "Z"

        config_res = agent_outputs.get("configuration_agent", {})
        threat_res = agent_outputs.get("threat_detection_agent", {})
        rag_res = agent_outputs.get("rag_agent", {})
        vuln_res = agent_outputs.get("vulnerability_agent", {})
        comp_res = agent_outputs.get("compliance_agent", {})
        sim_res = agent_outputs.get("attack_simulation_agent", {})
        qwen_res = agent_outputs.get("reasoning_agent", {})
        remed_res = agent_outputs.get("remediation_agent", {})

        # Score calculations
        score = config_res.get("score", 100)
        risk_level = config_res.get("risk_level", "LOW")

        # Adjust score if vulnerabilities exist
        vuln_count = len(vuln_res.get("vulnerabilities", []))
        if vuln_count > 0:
            sev_counts = vuln_res.get("severity_breakdown", {})
            if sev_counts.get("CRITICAL", 0) > 0:
                risk_level = "CRITICAL"
                score = min(score, 35)
            elif sev_counts.get("HIGH", 0) > 0:
                if risk_level not in ["CRITICAL"]:
                    risk_level = "HIGH"
                score = min(score, 65)

        verdict = f"IPsec Security Posture: {risk_level} Risk (Security Score: {score}/100)"
        exec_summary = (
            f"Assessment completed across 10 security agents. Detected {len(config_res.get('findings', []))} configuration items, "
            f"{vuln_count} vulnerabilities, and {comp_res.get('total_violations', 0)} compliance violations. "
            f"Random Forest ML flow classification predicted Class '{threat_res.get('prediction', 'N/A')}' with {threat_res.get('confidence', 0)*100:.1f}% confidence."
        )

        human_readable_report = f"""
================================================================================
IPSEC GUARDIAN EXECUTIVE CYBERSECURITY REPORT
================================================================================
Timestamp    : {timestamp}
Overall Score: {score}/100
Risk Level   : {risk_level}
Verdict      : {verdict}

EXECUTIVE SUMMARY:
{exec_summary}

--------------------------------------------------------------------------------
1. CONFIGURATION FINDINGS
--------------------------------------------------------------------------------
Score        : {config_res.get('score', 100)}/100
Risk Level   : {config_res.get('risk_level', 'LOW')}
Findings Count: {len(config_res.get('findings', []))}

--------------------------------------------------------------------------------
2. RANDOM FOREST TRAFFIC THREAT DETECTION
--------------------------------------------------------------------------------
Predicted Class    : {threat_res.get('prediction', 'N/A')}
Model Confidence   : {threat_res.get('confidence', 0.0):.4f}
Model Classification: {threat_res.get('risk_level', 'N/A')}

--------------------------------------------------------------------------------
3. VULNERABILITIES IDENTIFIED ({vuln_count})
--------------------------------------------------------------------------------
"""
        for v in vuln_res.get("vulnerabilities", []):
            human_readable_report += f"- [{v.get('severity')}] {v.get('title')}: {v.get('description')}\n  Impact: {v.get('impact')}\n"

        human_readable_report += f"""
--------------------------------------------------------------------------------
4. POLICY COMPLIANCE STATUS ({comp_res.get('compliance_status', 'UNKNOWN')})
--------------------------------------------------------------------------------
Total Checks: {comp_res.get('total_checks', 0)} | Violations: {comp_res.get('total_violations', 0)}
"""
        for viol in comp_res.get("violations", []):
            human_readable_report += f"- Violation [{viol.get('standard')}]: Field '{viol.get('field')}' is '{viol.get('actual')}' (Expected: {viol.get('expected')})\n"

        human_readable_report += f"""
--------------------------------------------------------------------------------
5. WHAT-IF ATTACK SIMULATION
--------------------------------------------------------------------------------
Scenario       : {sim_res.get('scenario', 'N/A')}
Baseline Score : {sim_res.get('baseline_score', 100)} -> Simulated Score: {sim_res.get('simulated_score', 100)} (Delta: -{sim_res.get('score_delta', 0)} pts)
Impact         : {sim_res.get('impact', 'N/A')}

--------------------------------------------------------------------------------
6. RERANKED RAG EVIDENCE ({len(rag_res.get('evidence', []))} Chunks)
--------------------------------------------------------------------------------
"""
        for ev in rag_res.get("evidence", []):
            human_readable_report += f"- Source: {ev.get('source')} (Score: {ev.get('rerank_score', 0):.4f})\n"

        human_readable_report += f"""
--------------------------------------------------------------------------------
7. QWEN3-14B EVIDENCE-GROUNDED REASONING
--------------------------------------------------------------------------------
{qwen_res.get('reasoning_output', 'Reasoning output unavailable.')}

--------------------------------------------------------------------------------
8. ACTIONABLE REMEDIATION RECOMMENDATIONS
--------------------------------------------------------------------------------
"""
        for rec in remed_res.get("recommendations", []):
            human_readable_report += f"- [{rec.get('priority')}] {rec.get('recommendation')}\n  Reason: {rec.get('reason')}\n"

        human_readable_report += f"""
--------------------------------------------------------------------------------
9. AGENT EXECUTION SUMMARY
--------------------------------------------------------------------------------
"""
        for agent_id, status in execution_statuses.items():
            human_readable_report += f"  {agent_id:30s} : {status}\n"

        human_readable_report += "================================================================================\n"

        return {
            "agent": self.agent_name,
            "status": "COMPLETED",
            "timestamp": timestamp,
            "summary": {
                "score": score,
                "risk_level": risk_level,
                "verdict": verdict,
                "executive_summary": exec_summary
            },
            "report_text": human_readable_report,
            "execution_summary": execution_statuses,
            "findings": ["Executive cybersecurity report compiled successfully."],
            "metadata": {"total_agents_executed": len(execution_statuses)}
        }
