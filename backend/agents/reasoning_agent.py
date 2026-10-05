import sys
import os
import datetime

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
try:
    from ai.Qwen_service import QwenService
except ImportError:
    from backend.ai.Qwen_service import QwenService

try:
    from config import MODEL_CONFIG
except ImportError:
    from backend.config import MODEL_CONFIG


class QwenReasoningAgent:
    def __init__(self):
        self.agent_name = "reasoning_agent"

    def analyze(self, question, context):
        timestamp = datetime.datetime.utcnow().isoformat() + "Z"

        configuration = context.get("configuration", {})
        threat_result = context.get("threat_agent", {})
        rag_evidence = context.get("rag_agent", {}).get("evidence", [])
        vulnerabilities = context.get("vulnerability_agent", {}).get("vulnerabilities", [])
        compliance = context.get("compliance_agent", {})
        simulation = context.get("simulation_agent", {})

        conf_lines = [f"{k}: {v}" for k, v in configuration.items() if v]
        configuration_text = "\n".join(conf_lines) if conf_lines else "Default IPsec Configuration"

        ml_result = {
            "predicted_class": threat_result.get("prediction", "0"),
            "confidence": threat_result.get("confidence", 0.0)
        }

        evidence_text = ""
        for i, ev in enumerate(rag_evidence, 1):
            evidence_text += f"\n[EVIDENCE {i}]\nSource: {ev.get('source')}\nScore: {ev.get('rerank_score', 0.0):.4f}\n{ev.get('text')}\n"
        if not evidence_text:
            evidence_text = "No RAG evidence retrieved."

        vuln_text = "\n".join([f"- [{v.get('severity')}] {v.get('title')}: {v.get('description')}" for v in vulnerabilities]) or "None"
        comp_text = f"Status: {compliance.get('compliance_status', 'UNKNOWN')}, Violations: {compliance.get('total_violations', 0)}"
        sim_text = f"Scenario: {simulation.get('scenario', 'N/A')}, Delta: {simulation.get('score_delta', 0)} pts, Explanation: {simulation.get('explanation', 'N/A')}"

        structured_user_prompt = f"""
Assess the following IPsec security context and question.

[IPSEC CONFIGURATION]
{configuration_text}

[THREAT MODEL RESULT]
Predicted Class: {ml_result['predicted_class']}
Confidence: {ml_result['confidence']:.4f}

[RAG EVIDENCE]
{evidence_text}

[VULNERABILITY FINDINGS]
{vuln_text}

[COMPLIANCE FINDINGS]
{comp_text}

[WHAT-IF SIMULATION]
{sim_text}

[USER QUESTION]
{question}

Produce the final answer between FINAL_ASSESSMENT_START and FINAL_ASSESSMENT_END.
"""

        try:
            reasoning_output = QwenService.generate_response(
                traffic=context.get("traffic", {}),
                ml_result=ml_result,
                configuration_text=configuration_text,
                question=question,
                evidence_text=evidence_text
            )

            return {
                "agent": self.agent_name,
                "status": "COMPLETED",
                "timestamp": timestamp,
                "model": MODEL_CONFIG["qwen_model_path"],
                "reasoning_output": reasoning_output,
                "findings": ["Qwen3-14B evidence-grounded reasoning generated successfully."],
                "metadata": {
                    "temperature": MODEL_CONFIG["temperature"],
                    "top_p": MODEL_CONFIG["top_p"],
                    "max_new_tokens": MODEL_CONFIG["max_new_tokens"]
                }
            }

        except Exception as e:
            return {
                "agent": self.agent_name,
                "status": "FAILED",
                "timestamp": timestamp,
                "error": f"Qwen reasoning failed: {str(e)}",
                "reasoning_output": "Model offline or execution error. Assessment fell back to deterministic rule engine.",
                "findings": ["Qwen3-14B inference was unavailable."],
                "metadata": {}
            }
