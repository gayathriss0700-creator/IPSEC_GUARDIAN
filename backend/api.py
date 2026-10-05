from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from agents.orchestrator import AgentOrchestrator

app = FastAPI(
    title="IPsec Guardian Multi-Agent API",
    description="Evidence-Grounded Cybersecurity Reasoning Backend API powered by 10 Modular Agents, Random Forest, FAISS RAG, CrossEncoder, and Qwen3-14B.",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global orchestrator singleton
orchestrator = AgentOrchestrator()


class TrafficData(BaseModel):
    source_port: int = Field(default=50000, description="Source IP port")
    destination_port: int = Field(default=443, description="Destination IP port")
    protocol: int = Field(default=6, description="IP protocol (6=TCP, 17=UDP)")
    duration: float = Field(default=2.0, description="Flow duration in seconds")
    packet_count: int = Field(default=50, description="Total packet count")
    bytes_sent: int = Field(default=5000, description="Bytes sent")
    bytes_received: int = Field(default=7000, description="Bytes received")
    bytes_per_packet: float = Field(default=150.0, description="Average bytes per packet")


class IPsecConfig(BaseModel):
    ike_version: str = Field(default="IKEv2", description="IKE Protocol Version")
    encryption: str = Field(default="AES-256-GCM", description="Encryption algorithm")
    integrity: str = Field(default="SHA-256", description="Integrity algorithm")
    authentication: str = Field(default="Certificate", description="Authentication method")
    dh_group: str = Field(default="Strong group", description="Diffie-Hellman Group")
    pfs: str = Field(default="Enabled", description="Perfect Forward Secrecy status")
    esp_mode: str = Field(default="Tunnel", description="IPsec ESP Mode (Tunnel / Transport)")
    nat_t: str = Field(default="Enabled", description="NAT Traversal status")
    anti_replay: str = Field(default="Enabled", description="Anti-Replay protection status")
    traffic_selectors: str = Field(default="Limited", description="Traffic Selectors scope")


class AssessRequest(BaseModel):
    question: str = Field(default="Why is PFS important in IKEv2?", description="User security question")
    traffic: TrafficData = Field(default_factory=TrafficData, description="Network traffic data")
    configuration: IPsecConfig = Field(default_factory=IPsecConfig, description="IPsec configuration parameters")
    run_simulation: bool = Field(default=True, description="Whether to run what-if attack simulation")
    simulation_scenario: str = Field(default="disable_pfs", description="Simulation scenario identifier")


class QuestionRequest(BaseModel):
    question: str = Field(..., description="Security question to query RAG and Qwen")
    configuration: IPsecConfig = Field(default_factory=IPsecConfig, description="IPsec configuration parameters")


class SimulationRequest(BaseModel):
    configuration: IPsecConfig = Field(default_factory=IPsecConfig, description="Current baseline configuration")
    scenario_name: str = Field(default="disable_pfs", description="Scenario identifier or custom scenario name")
    modifications: dict = Field(default=None, description="Custom parameter modifications dictionary")


@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "IPsec Guardian Multi-Agent API",
        "version": "2.0.0",
        "endpoints": ["/assess", "/api/assess", "/ask", "/simulate", "/agents", "/health"]
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "system": "IPsec Guardian Multi-Agent Cybersecurity Reasoning Engine",
        "agent_count": len(orchestrator.agent_registry)
    }


@app.get("/agents")
async def list_agents():
    return {
        "agents": [
            {"name": "Agent Orchestrator", "id": "orchestrator", "role": "Coordinates execution flow across all 9 sub-agents."},
            {"name": "IPsec Configuration Agent", "id": "configuration_agent", "role": "Deterministic rule evaluation of IPsec parameter choices."},
            {"name": "Threat Detection Agent", "id": "threat_detection_agent", "role": "Random Forest ML netflow traffic anomaly classification."},
            {"name": "RAG Security Evidence Agent", "id": "rag_agent", "role": "FAISS vector retrieval and CrossEncoder reranking."},
            {"name": "Vulnerability Analysis Agent", "id": "vulnerability_agent", "role": "Identifies severity-ranked security weaknesses."},
            {"name": "Compliance Agent", "id": "compliance_agent", "role": "Evaluates NIST SP 800-77, CNSA 1.0, and DoD STIG compliance."},
            {"name": "Attack Simulation Agent", "id": "attack_simulation_agent", "role": "Safe configuration-level what-if scenario simulator."},
            {"name": "Qwen3-14B Reasoning Agent", "id": "reasoning_agent", "role": "Grounded Qwen3-14B LLM cybersecurity reasoning."},
            {"name": "Remediation Agent", "id": "remediation_agent", "role": "Generates prioritized, actionable technical recommendations."},
            {"name": "Security Report Agent", "id": "report_agent", "role": "Compiles executive security reports and unified JSON."}
        ],
        "statuses": orchestrator.get_agent_statuses()
    }


@app.post("/assess")
@app.post("/api/assess")
async def run_assessment_endpoint(req: AssessRequest):
    try:
        cfg = req.configuration.model_dump() if hasattr(req.configuration, "model_dump") else req.configuration.dict()
        trf = req.traffic.model_dump() if hasattr(req.traffic, "model_dump") else req.traffic.dict()

        result = orchestrator.run_assessment(
            configuration=cfg,
            traffic=trf,
            question=req.question,
            run_simulation=req.run_simulation,
            simulation_scenario=req.simulation_scenario
        )

        # Ensure compatibility with existing frontend and client expectations
        result["rag"] = {"evidence": result.get("evidence", [])}
        orig_assessment = result.get("assessment", {})
        result["assessment"] = {
            "score": orig_assessment.get("score", 100),
            "risk_level": orig_assessment.get("risk_level", "LOW"),
            "verdict": orig_assessment.get("verdict", "PASS"),
            "summary": orig_assessment.get("summary", ""),
            "report_text": orig_assessment.get("report_text", ""),
            "qwen_reasoning": orig_assessment.get("qwen_reasoning", ""),
            "assessment": orig_assessment.get("summary", ""),
            "risk": orig_assessment.get("verdict", "PASS"),
            "recommendation": "\n".join([r.get("recommendation", "") for r in result.get("recommendations", [])[:3]]),
            "confidence": "HIGH (Multi-Agent Grounded)",
            "what_if": result.get("agents", {}).get("attack_simulation", {}).get("explanation", "N/A")
        }
        result["final_response"] = result["assessment"].get("qwen_reasoning") or result["assessment"].get("report_text", "")

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Multi-agent assessment failed: {str(e)}")


@app.post("/ask")
async def ask_question_endpoint(req: QuestionRequest):
    try:
        cfg = req.configuration.model_dump() if hasattr(req.configuration, "model_dump") else req.configuration.dict()
        rag_res = orchestrator.rag_agent.analyze(question=req.question, configuration=cfg)
        qwen_context = {
            "configuration": cfg,
            "rag_agent": rag_res
        }
        qwen_res = orchestrator.reasoning_agent.analyze(question=req.question, context=qwen_context)
        return {
            "question": req.question,
            "evidence": rag_res.get("evidence", []),
            "answer": qwen_res.get("reasoning_output", "")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ask endpoint failed: {str(e)}")


@app.post("/simulate")
async def simulate_endpoint(req: SimulationRequest):
    try:
        cfg = req.configuration.model_dump() if hasattr(req.configuration, "model_dump") else req.configuration.dict()
        sim_res = orchestrator.simulation_agent.simulate(
            current_configuration=cfg,
            scenario_name=req.scenario_name,
            modifications=req.modifications
        )
        return sim_res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
