import os
import json
import numpy as np
import datetime
import faiss
from sentence_transformers import SentenceTransformer, CrossEncoder

try:
    from config import MODEL_CONFIG
except ImportError:
    from backend.config import MODEL_CONFIG

_FAISS_INDEX = None
_RAG_METADATA = None
_EMBEDDING_MODEL = None
_CROSS_ENCODER = None


def get_rag_resources():
    global _FAISS_INDEX, _RAG_METADATA, _EMBEDDING_MODEL, _CROSS_ENCODER

    if _FAISS_INDEX is None and os.path.exists(MODEL_CONFIG["faiss_index_path"]):
        try:
            _FAISS_INDEX = faiss.read_index(MODEL_CONFIG["faiss_index_path"])
        except Exception as e:
            print(f"[RAGEvidenceAgent] Error loading FAISS index: {e}")

    if _RAG_METADATA is None and os.path.exists(MODEL_CONFIG["metadata_path"]):
        try:
            with open(MODEL_CONFIG["metadata_path"], "r", encoding="utf-8") as f:
                _RAG_METADATA = json.load(f)
        except Exception as e:
            print(f"[RAGEvidenceAgent] Error loading metadata: {e}")

    if _EMBEDDING_MODEL is None:
        try:
            _EMBEDDING_MODEL = SentenceTransformer(MODEL_CONFIG["embedding_model"])
        except Exception as e:
            print(f"[RAGEvidenceAgent] Error loading Embedding model: {e}")

    if _CROSS_ENCODER is None:
        try:
            _CROSS_ENCODER = CrossEncoder(MODEL_CONFIG["reranker_model"])
        except Exception as e:
            print(f"[RAGEvidenceAgent] Error loading CrossEncoder: {e}")

    return _FAISS_INDEX, _RAG_METADATA, _EMBEDDING_MODEL, _CROSS_ENCODER


class RAGEvidenceAgent:
    def __init__(self):
        self.agent_name = "rag_agent"

    def _get_meta_item(self, metadata, idx):
        if isinstance(metadata, list) and 0 <= idx < len(metadata):
            return metadata[idx]
        if isinstance(metadata, dict):
            return metadata.get(str(idx), metadata.get(idx, {}))
        return {}

    def analyze(self, question, configuration=None):
        timestamp = datetime.datetime.utcnow().isoformat() + "Z"
        index, metadata, embedder, reranker = get_rag_resources()

        if index is None or embedder is None or not metadata:
            return {
                "agent": self.agent_name,
                "status": "FAILED",
                "timestamp": timestamp,
                "query": question,
                "evidence": [],
                "findings": ["RAG Vector Database or Embedding model unavailable."],
                "error": "FAISS index or embedding model missing."
            }

        faiss_k = MODEL_CONFIG.get("faiss_top_k", 10)
        rerank_k = MODEL_CONFIG.get("rerank_top_k", 5)
        final_k = MODEL_CONFIG.get("final_evidence_k", 5)

        rag_query = f"IPsec security question: {question}"
        if configuration:
            conf_summary = ", ".join([f"{k}: {v}" for k, v in configuration.items() if v])
            rag_query += f" Configuration: {conf_summary}"

        query_emb = embedder.encode([rag_query], normalize_embeddings=True, show_progress_bar=False)
        query_vec = np.asarray(query_emb[0], dtype="float32")

        all_vectors = index.reconstruct_n(0, index.ntotal).astype("float32")
        scores = np.dot(all_vectors, query_vec)
        top_indices = np.argsort(scores)[-faiss_k:][::-1]

        candidates = []
        for rank, idx in enumerate(top_indices, 1):
            idx = int(idx)
            item = self._get_meta_item(metadata, idx)
            text = item.get("text") or item.get("content") or str(item)
            filename = item.get("document") or item.get("file_name") or item.get("file", "Unknown")
            section = item.get("section") or item.get("heading", "General")

            candidates.append({
                "index": idx,
                "faiss_rank": rank,
                "faiss_score": float(scores[idx]),
                "file": str(filename),
                "section": str(section),
                "text": str(text).strip()
            })

        if reranker is not None and candidates:
            pairs = [[question, cand["text"]] for cand in candidates]
            rerank_scores = reranker.predict(pairs, show_progress_bar=False)

            for cand, score in zip(candidates, rerank_scores):
                cand["rerank_score"] = float(score)

            candidates.sort(key=lambda x: x["rerank_score"], reverse=True)
        else:
            for cand in candidates:
                cand["rerank_score"] = cand["faiss_score"]

        top_evidence = candidates[:final_k]

        formatted_evidence = [
            {
                "source": f"{item['file']} ({item['section']})",
                "file": item["file"],
                "section": item["section"],
                "text": item["text"],
                "faiss_rank": item["faiss_rank"],
                "faiss_score": item["faiss_score"],
                "rerank_score": item["rerank_score"]
            }
            for item in top_evidence
        ]

        return {
            "agent": self.agent_name,
            "status": "COMPLETED",
            "timestamp": timestamp,
            "query": question,
            "evidence": formatted_evidence,
            "candidates_retrieved": len(formatted_evidence),
            "findings": [f"Retrieved {len(formatted_evidence)} relevant RAG evidence chunks."],
            "metadata": {
                "faiss_vectors": index.ntotal,
                "embedding_dim": index.d
            }
        }
