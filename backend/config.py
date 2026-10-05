import os

# ============================================================
# CENTRALIZED MODEL & AGENT CONFIGURATION
# ============================================================

MODEL_CONFIG = {
    # Models
    "embedding_model": "sentence-transformers/all-MiniLM-L6-v2",
    "reranker_model": "cross-encoder/ms-marco-MiniLM-L-6-v2",
    "qwen_model_path": os.environ.get("QWEN_MODEL_PATH", "/home/sece2026-student19/models/Qwen3-14B"),

    # RAG Retrieval Settings
    "faiss_top_k": 10,
    "rerank_top_k": 5,
    "final_evidence_k": 5,

    # Qwen3-14B Generation Parameters
    "temperature": 0.2,
    "top_p": 0.8,
    "top_k": 20,
    "max_new_tokens": 2048,
    "repetition_penalty": 1.05,
    "do_sample": True,

    # Paths
    "base_dir": os.path.dirname(os.path.abspath(__file__)),
    "ml_model_path": os.path.join(os.path.dirname(os.path.abspath(__file__)), "ml", "network_traffic_model.joblib"),
    "faiss_index_path": os.path.join(os.path.dirname(os.path.abspath(__file__)), "Rag", "ipsec.index"),
    "metadata_path": os.path.join(os.path.dirname(os.path.abspath(__file__)), "Rag", "metadata.json"),
    "ipsec_rules_path": os.path.join(os.path.dirname(os.path.abspath(__file__)), "rules", "ipsec_rules.json"),
    "compliance_rules_path": os.path.join(os.path.dirname(os.path.abspath(__file__)), "rules", "compliance_rules.json"),
}
