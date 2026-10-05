import logging
import datetime
from .configuration_agent import IPsecConfigurationAgent
from .threat_detection_agent import ThreatDetectionAgent
from .rag_agent import RAGEvidenceAgent
from .vulnerability_agent import VulnerabilityAnalysisAgent
from .compliance_agent import ComplianceAgent
from .attack_simulation_agent import AttackSimulationAgent
from .reasoning_agent import QwenReasoningAgent
from .remediation_agent import RemediationAgent
from .report_agent import SecurityReportAgent

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("IPsecOrchestrator")


class AgentOrchestrator:
    def __init__(self):
        logger.info("[ORCHESTRATOR] Initializing Multi-Agent Cybersecurity System")

        # Initialize agent modules
        self.config_agent = IPsecConfigurationAgent()
        self.threat_agent = ThreatDetectionAgent()
        self.rag_agent = RAGEvidenceAgent()
        self.vulnerability_agent = VulnerabilityAnalysisAgent()
        self.compliance_agent = ComplianceAgent()
        self.simulation_agent = AttackSimulationAgent()
        self.reasoning_agent = QwenReasoningAgent()
        self.remediation_agent = RemediationAgent()
        self.report_agent = SecurityReportAgent()

        self.agent_registry = {
            "configuration_agent": self.config_agent,
            "threat_detection_agent": self.threat_agent,
            "rag_agent": self.rag_agent,
            "vulnerability_agent": self.vulnerability_agent,
            "compliance_agent": self.compliance_agent,
            "attack_simulation_agent": self.simulation_agent,
            "reasoning_agent": self.reasoning_agent,
            "remediation_agent": self.remediation_agent,
            "report_agent": self.report_agent,
        }

    def get_agent_statuses(self, active_statuses=None):
        statuses = {name: "READY" for name in self.agent_registry.keys()}
        if active_statuses:
            statuses.update(active_statuses)
        return statuses

    def run_assessment(self, configuration, traffic=None, question=None, run_simulation=True, simulation_scenario=None):
        logger.info("=" * 80)
        logger.info("[ORCHESTRATOR] Starting Multi-Agent Security Assessment Workflow")
        logger.info("=" * 80)

        execution_statuses = self.get_agent_statuses()
        agent_outputs = {}

        # 1. IPsec Configuration Agent
        try:
            logger.info("[CONFIG_AGENT] Analyzing IPsec configuration parameters")
            execution_statuses["configuration_agent"] = "RUNNING"
            config_res = self.config_agent.analyze(configuration)
            agent_outputs["configuration_agent"] = config_res
            execution_statuses["configuration_agent"] = config_res.get("status", "COMPLETED")
        except Exception as e:
            logger.error(f"[CONFIG_AGENT] Failed: {e}")
            execution_statuses["configuration_agent"] = "FAILED"
            agent_outputs["configuration_agent"] = {"status": "FAILED", "error": str(e), "score": 50, "risk_level": "HIGH"}

        # 2. Threat Detection Agent (Random Forest ML)
        try:
            logger.info("[THREAT_AGENT] Running Random Forest traffic classification")
            execution_statuses["threat_detection_agent"] = "RUNNING"
            threat_res = self.threat_agent.analyze(traffic)
            agent_outputs["threat_detection_agent"] = threat_res
            execution_statuses["threat_detection_agent"] = threat_res.get("status", "COMPLETED")
        except Exception as e:
            logger.error(f"[THREAT_AGENT] Failed: {e}")
            execution_statuses["threat_detection_agent"] = "FAILED"
            agent_outputs["threat_detection_agent"] = {"status": "FAILED", "error": str(e), "prediction": "N/A", "confidence": 0.0}

        # 3. RAG Security Evidence Agent (FAISS + CrossEncoder)
        try:
            search_query = question or "IPsec security assessment vulnerabilities and best practices"
            logger.info(f"[RAG_AGENT] Querying FAISS index & CrossEncoder reranking for: '{search_query}'")
            execution_statuses["rag_agent"] = "RUNNING"
            rag_res = self.rag_agent.analyze(question=search_query, configuration=configuration)
            agent_outputs["rag_agent"] = rag_res
            execution_statuses["rag_agent"] = rag_res.get("status", "COMPLETED")
        except Exception as e:
            logger.error(f"[RAG_AGENT] Failed: {e}")
            execution_statuses["rag_agent"] = "FAILED"
            agent_outputs["rag_agent"] = {"status": "FAILED", "error": str(e), "evidence": []}

        # 4. Vulnerability Analysis Agent
        try:
            logger.info("[VULNERABILITY_AGENT] Evaluating security controls and weaknesses")
            execution_statuses["vulnerability_agent"] = "RUNNING"
            vuln_res = self.vulnerability_agent.analyze(
                config_findings=agent_outputs.get("configuration_agent", {}).get("findings", []),
                rag_evidence=agent_outputs.get("rag_agent", {}).get("evidence", [])
            )
            agent_outputs["vulnerability_agent"] = vuln_res
            execution_statuses["vulnerability_agent"] = vuln_res.get("status", "COMPLETED")
        except Exception as e:
            logger.error(f"[VULNERABILITY_AGENT] Failed: {e}")
            execution_statuses["vulnerability_agent"] = "FAILED"
            agent_outputs["vulnerability_agent"] = {"status": "FAILED", "error": str(e), "vulnerabilities": []}

        # 5. Compliance Agent
        try:
            logger.info("[COMPLIANCE_AGENT] Checking security control compliance (NIST SP 800-77, CNSA, STIG)")
            execution_statuses["compliance_agent"] = "RUNNING"
            comp_res = self.compliance_agent.analyze(configuration)
            agent_outputs["compliance_agent"] = comp_res
            execution_statuses["compliance_agent"] = comp_res.get("status", "COMPLETED")
        except Exception as e:
            logger.error(f"[COMPLIANCE_AGENT] Failed: {e}")
            execution_statuses["compliance_agent"] = "FAILED"
            agent_outputs["compliance_agent"] = {"status": "FAILED", "error": str(e), "compliance_status": "UNKNOWN"}

        # 6. Attack Simulation / What-If Agent
        if run_simulation:
            try:
                scen = simulation_scenario or "disable_pfs"
                logger.info(f"[SIMULATION_AGENT] Running configuration what-if scenario: '{scen}'")
                execution_statuses["attack_simulation_agent"] = "RUNNING"
                sim_res = self.simulation_agent.simulate(configuration, scenario_name=scen)
                agent_outputs["attack_simulation_agent"] = sim_res
                execution_statuses["attack_simulation_agent"] = sim_res.get("status", "COMPLETED")
            except Exception as e:
                logger.error(f"[SIMULATION_AGENT] Failed: {e}")
                execution_statuses["attack_simulation_agent"] = "FAILED"
                agent_outputs["attack_simulation_agent"] = {"status": "FAILED", "error": str(e)}
        else:
            logger.info("[SIMULATION_AGENT] Skipped based on request configuration")
            execution_statuses["attack_simulation_agent"] = "SKIPPED"
            agent_outputs["attack_simulation_agent"] = {"status": "SKIPPED"}

        # 7. Qwen3-14B Reasoning Agent
        try:
            ask_q = question or "Provide an evidence-grounded security assessment for this IPsec configuration."
            logger.info("[QWEN_AGENT] Executing Qwen3-14B evidence-grounded reasoning")
            execution_statuses["reasoning_agent"] = "RUNNING"
            qwen_context = {
                "configuration": configuration,
                "traffic": traffic,
                "config_agent": agent_outputs.get("configuration_agent", {}),
                "threat_agent": agent_outputs.get("threat_detection_agent", {}),
                "rag_agent": agent_outputs.get("rag_agent", {}),
                "vulnerability_agent": agent_outputs.get("vulnerability_agent", {}),
                "compliance_agent": agent_outputs.get("compliance_agent", {}),
                "simulation_agent": agent_outputs.get("attack_simulation_agent", {})
            }
            qwen_res = self.reasoning_agent.analyze(question=ask_q, context=qwen_context)
            agent_outputs["reasoning_agent"] = qwen_res
            execution_statuses["reasoning_agent"] = qwen_res.get("status", "COMPLETED")
        except Exception as e:
            logger.error(f"[QWEN_AGENT] Failed: {e}")
            execution_statuses["reasoning_agent"] = "FAILED"
            agent_outputs["reasoning_agent"] = {"status": "FAILED", "error": str(e), "reasoning_output": "Model reasoning failed."}

        # 8. Remediation Agent
        try:
            logger.info("[REMEDIATION_AGENT] Generating prioritized remediation guidance")
            execution_statuses["remediation_agent"] = "RUNNING"
            remed_res = self.remediation_agent.analyze(
                config_agent_res=agent_outputs.get("configuration_agent"),
                vuln_agent_res=agent_outputs.get("vulnerability_agent"),
                compliance_agent_res=agent_outputs.get("compliance_agent"),
                reasoning_agent_res=agent_outputs.get("reasoning_agent")
            )
            agent_outputs["remediation_agent"] = remed_res
            execution_statuses["remediation_agent"] = remed_res.get("status", "COMPLETED")
        except Exception as e:
            logger.error(f"[REMEDIATION_AGENT] Failed: {e}")
            execution_statuses["remediation_agent"] = "FAILED"
            agent_outputs["remediation_agent"] = {"status": "FAILED", "error": str(e), "recommendations": []}

        # 9. Security Report Agent
        try:
            logger.info("[REPORT_AGENT] Compiling consolidated executive security report")
            execution_statuses["report_agent"] = "RUNNING"
            report_res = self.report_agent.compile_report(agent_outputs, execution_statuses)
            agent_outputs["report_agent"] = report_res
            execution_statuses["report_agent"] = report_res.get("status", "COMPLETED")
        except Exception as e:
            logger.error(f"[REPORT_AGENT] Failed: {e}")
            execution_statuses["report_agent"] = "FAILED"
            agent_outputs["report_agent"] = {"status": "FAILED", "error": str(e)}

        logger.info("[ORCHESTRATOR] Multi-Agent Assessment Workflow Completed Successfully")
        logger.info("=" * 80)

        # Structure final return matching frontend and API specifications
        final_summary = agent_outputs.get("report_agent", {}).get("summary", {})
        evidence_list = agent_outputs.get("rag_agent", {}).get("evidence", [])
        remed_list = agent_outputs.get("remediation_agent", {}).get("recommendations", [])

        return {
            "assessment": {
                "score": final_summary.get("score", 100),
                "risk_level": final_summary.get("risk_level", "LOW"),
                "verdict": final_summary.get("verdict", ""),
                "summary": final_summary.get("executive_summary", ""),
                "report_text": agent_outputs.get("report_agent", {}).get("report_text", ""),
                "qwen_reasoning": agent_outputs.get("reasoning_agent", {}).get("reasoning_output", "")
            },
            "agents": {
                "configuration": agent_outputs.get("configuration_agent", {}),
                "threat_detection": agent_outputs.get("threat_detection_agent", {}),
                "rag": agent_outputs.get("rag_agent", {}),
                "vulnerability": agent_outputs.get("vulnerability_agent", {}),
                "compliance": agent_outputs.get("compliance_agent", {}),
                "attack_simulation": agent_outputs.get("attack_simulation_agent", {}),
                "reasoning": agent_outputs.get("reasoning_agent", {}),
                "remediation": agent_outputs.get("remediation_agent", {}),
                "report": agent_outputs.get("report_agent", {})
            },
            "agent_statuses": execution_statuses,
            "evidence": evidence_list,
            "recommendations": remed_list
        }
