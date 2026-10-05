# IPsec Guardian (Merged Project)

An Evidence-Grounded Cybersecurity Reasoning System for IPsec Security Assessment.

## Overview

IPsec Guardian merges machine learning flow classification, hybrid RAG retrieval, CrossEncoder reranking, and local Qwen3-14B LLM reasoning with strict claim grounding to provide robust, evidence-backed security analysis of IPsec configurations and network traffic.

## Architecture

1. **Network Traffic Classification**: Random Forest model predicting flow classes over 8 network traffic features (`source_port`, `destination_port`, `protocol`, `duration`, `packet_count`, `bytes_sent`, `bytes_received`, `bytes_per_packet`).
2. **Hybrid RAG Retrieval V2**: Configuration-aware multi-query FAISS vector search (384-dimensional embeddings via `sentence-transformers/all-MiniLM-L6-v2`) combined with exact phrase lexical matching and configuration parameter scoring.
3. **CrossEncoder Reranking**: Candidate reranking using `cross-encoder/ms-marco-MiniLM-L-6-v2` with section diversity filtering.
4. **Evidence-Grounded Qwen3-14B Reasoning**: Local LLM prompt template enforcing strict evidence attribution.
5. **Strict Claim Grounding Gate**: Regex-based claim verification preventing ungrounded exact technical parameters, CVEs, or unsupported group numbers from reaching the user.

## Project Structure

```
IPSEC_GUARDIAN_MERGED/
├── backend/
│   ├── api.py                    # FastAPI web application (/api/assess, /health)
│   ├── ai/
│   │   └── Qwen_service.py       # Wrapper service for Qwen3-14B inference
│   ├── ml/
│   │   └── network_traffic_model.joblib # Trained Random Forest model (1.4 MB)
│   └── Rag/
│       ├── ipsec.index           # FAISS index (625 KB, 418 vectors)
│       └── metadata.json         # RAG chunk metadata (163 KB)
├── frontend/                     # Modern React + Vite Web UI
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── components/           # Chat, ConfigPanel, EvidenceCard, RiskCard
│       └── pages/                # Dashboard, Assistance, History
├── docs/
│   └── rag_knowledge_base/       # 26 markdown knowledge files + statistics
├── scripts/
│   └── apply_grounding_upgrade.py# Grounding upgrade script
├── ipsec_security_assessment.py  # Main pipeline module (Programmatic & CLI mode)
├── requirements.txt              # Unified Python dependencies
└── README.md                     # Documentation
```

## Running the Application

### 1. Terminal / CLI Mode
```bash
python ipsec_security_assessment.py
```

### 2. Backend API
```bash
pip install -r requirements.txt
uvicorn backend.api:app --reload --port 8000
```
API Documentation will be available at `http://localhost:8000/docs`.

### 3. Frontend Web Application
```bash
cd frontend
npm install
npm run dev
```
Access the application at `http://localhost:3000`.

## Configuration Environment Variables

- `QWEN_MODEL_PATH`: Path to Qwen3-14B model directory (default: `/home/sece2026-student19/models/Qwen3-14B`).
