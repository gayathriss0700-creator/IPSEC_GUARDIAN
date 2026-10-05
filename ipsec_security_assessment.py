import os
import json
import re
import joblib
import faiss
import numpy as np
import pandas as pd
import torch

from sentence_transformers import SentenceTransformer, CrossEncoder
from transformers import AutoTokenizer, AutoModelForCausalLM


# ============================================================
# PROJECT PATHS
# ============================================================

PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))

ML_MODEL_PATH = os.path.join(
    PROJECT_DIR,
    "backend",
    "ml",
    "network_traffic_model.joblib"
)

FAISS_INDEX_PATH = os.path.join(
    PROJECT_DIR,
    "backend",
    "Rag",
    "ipsec.index"
)

METADATA_PATH = os.path.join(
    PROJECT_DIR,
    "backend",
    "Rag",
    "metadata.json"
)

QWEN_MODEL_PATH = os.environ.get(
    "QWEN_MODEL_PATH",
    "/home/sece2026-student19/models/Qwen3-14B"
)


# ============================================================
# DEVICE
# ============================================================

device = "cuda" if torch.cuda.is_available() else "cpu"

print("=" * 80)
print("IPsec SECURITY ASSESSMENT SYSTEM")
print("Evidence-Grounded Cybersecurity Reasoning System")
print("=" * 80)
print(f"Device: {device}")

if torch.cuda.is_available():
    print(f"GPU: {torch.cuda.get_device_name(0)}")


# ============================================================
# LAZY / INITIAL MODEL INITIALIZATION
# ============================================================

rf_model = None
MODEL_FEATURE_NAMES = [
    "source_port",
    "destination_port",
    "protocol",
    "duration",
    "packet_count",
    "bytes_sent",
    "bytes_received",
    "bytes_per_packet"
]
index = None
metadata = []
embedding_model = None
reranker = None
tokenizer = None
qwen_model = None


def load_all_models():
    """Load all ML, RAG, and LLM models if not already loaded."""
    global rf_model, MODEL_FEATURE_NAMES, index, metadata, embedding_model, reranker, tokenizer, qwen_model

    if rf_model is None:
        print("\nLoading Random Forest model...")
        if os.path.exists(ML_MODEL_PATH):
            rf_model = joblib.load(ML_MODEL_PATH)
            MODEL_FEATURE_NAMES = list(
                getattr(
                    rf_model,
                    "feature_names_in_",
                    MODEL_FEATURE_NAMES
                )
            )
            print(f"Random Forest model loaded. Features: {MODEL_FEATURE_NAMES}")
        else:
            print(f"Warning: ML model not found at {ML_MODEL_PATH}")

    if index is None:
        print("\nLoading FAISS index & metadata...")
        if os.path.exists(FAISS_INDEX_PATH) and os.path.exists(METADATA_PATH):
            index = faiss.read_index(FAISS_INDEX_PATH)
            with open(METADATA_PATH, "r", encoding="utf-8") as f:
                metadata = json.load(f)
            print(f"FAISS vectors: {index.ntotal}, Metadata entries: {len(metadata)}")
        else:
            print(f"Warning: FAISS index/metadata not found.")

    if embedding_model is None:
        print("\nLoading Sentence Transformer embedding model...")
        embedding_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
        print("Embedding model loaded.")

    if reranker is None:
        print("\nLoading Cross-Encoder reranker...")
        reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
        print("Cross-Encoder reranker loaded.")

    if qwen_model is None:
        print(f"\nLoading Qwen3-14B from {QWEN_MODEL_PATH}...")
        if os.path.exists(QWEN_MODEL_PATH):
            tokenizer = AutoTokenizer.from_pretrained(QWEN_MODEL_PATH, trust_remote_code=True)
            qwen_model = AutoModelForCausalLM.from_pretrained(
                QWEN_MODEL_PATH,
                dtype=torch.bfloat16,
                device_map="auto",
                trust_remote_code=True
            )
            print("Qwen3-14B loaded.")
        else:
            print(f"Notice: Qwen3-14B path {QWEN_MODEL_PATH} not found locally.")


# Auto-attempt initial loading if paths exist
try:
    load_all_models()
except Exception as err:
    print(f"Note on initial model loading: {err}")


# ============================================================
# HELPER: INPUT CLEANING & TERMINAL PROMPTS
# ============================================================

def clean_input_value(value, field_name):
    """Accept bare values or pasted values such as 'Field [default]: value'."""
    value = str(value).strip()
    if not value:
        return value

    escaped = re.escape(field_name)
    pattern = rf"^\s*{escaped}\s*(?:\[[^\]]*\])?\s*:\s*"
    for _ in range(3):
        cleaned = re.sub(pattern, "", value, flags=re.IGNORECASE).strip()
        if cleaned == value:
            break
        value = cleaned

    known_fields = [
        "IKE Version", "Encryption", "Integrity", "Authentication",
        "Diffie-Hellman Group", "PFS", "IPsec Mode", "ESP", "NAT-T",
        "Replay Protection", "Key Lifetime"
    ]
    for other in known_fields:
        if other.lower() == field_name.lower():
            continue
        marker = re.search(
            rf"\b{re.escape(other)}\s*(?:\[[^\]]*\])?\s*:",
            value,
            flags=re.IGNORECASE
        )
        if marker:
            value = value[:marker.start()].strip()
            break

    return value.strip()


def get_input(prompt, default):
    while True:
        try:
            raw = input(f"{prompt} [{default}]: ").strip()
        except (EOFError, KeyboardInterrupt):
            return default

        if raw == "":
            return default

        value = clean_input_value(raw, prompt)

        if value == "":
            return default

        return value


def get_int_input(prompt, default):
    while True:
        value = get_input(prompt, default)
        try:
            return int(value)
        except ValueError:
            print(f"Invalid integer for {prompt}. Please enter a number.")


def get_float_input(prompt, default):
    while True:
        value = get_input(prompt, default)
        try:
            return float(value)
        except ValueError:
            print(f"Invalid number for {prompt}. Please enter a numeric value.")


# ============================================================
# 1. MACHINE LEARNING ASSESSMENT
# ============================================================

def run_ml_assessment(traffic):
    """
    Run Random Forest assessment on network traffic.
    Expects traffic dictionary containing 8 features.
    """
    if rf_model is None:
        return {
            "predicted_class": "Model Not Loaded",
            "confidence": 0.0,
            "class_probabilities": {}
        }

    feature_values = {
        "source_port": float(traffic.get("source_port", 50000)),
        "destination_port": float(traffic.get("destination_port", 443)),
        "protocol": float(traffic.get("protocol", 6)),
        "duration": float(traffic.get("duration", 2)),
        "packet_count": float(traffic.get("packet_count", 50)),
        "bytes_sent": float(traffic.get("bytes_sent", 5000)),
        "bytes_received": float(traffic.get("bytes_received", 7000)),
        "bytes_per_packet": float(traffic.get("bytes_per_packet", 150))
    }

    ml_row = {}
    for feature in MODEL_FEATURE_NAMES:
        if feature in feature_values:
            ml_row[feature] = feature_values[feature]
        else:
            ml_row[feature] = 0.0

    ml_features = pd.DataFrame([ml_row], columns=MODEL_FEATURE_NAMES)

    predicted_class = rf_model.predict(ml_features)[0]
    probabilities = rf_model.predict_proba(ml_features)[0]
    confidence = float(np.max(probabilities))

    class_probabilities = {
        str(cls): float(prob)
        for cls, prob in zip(rf_model.classes_, probabilities)
    }

    return {
        "predicted_class": int(predicted_class) if isinstance(predicted_class, (int, np.integer)) else str(predicted_class),
        "confidence": confidence,
        "class_probabilities": class_probabilities
    }


# ============================================================
# 2. BUILD CONFIGURATION TEXT
# ============================================================

def build_configuration_text(configuration):
    """Convert configuration dictionary into formatted text block."""
    return f"""IKE Version: {configuration.get('ike_version', 'IKEv2')}
Encryption: {configuration.get('encryption', 'AES-256-GCM')}
Integrity: {configuration.get('integrity', 'SHA-256')}
Authentication: {configuration.get('authentication', 'Certificate')}
Diffie-Hellman Group: {configuration.get('dh_group', 'Strong group')}
PFS: {configuration.get('pfs', 'Enabled')}
IPsec Mode: {configuration.get('ipsec_mode', 'Tunnel')}
ESP: {configuration.get('esp', 'Enabled')}
NAT-T: {configuration.get('nat_t', 'Enabled')}
Replay Protection: {configuration.get('replay_protection', 'Enabled')}
Key Lifetime: {configuration.get('key_lifetime', 'Limited')}""".strip()


# ============================================================
# 3. METADATA HELPERS
# ============================================================

def get_metadata_item(idx):
    if isinstance(metadata, list):
        if 0 <= idx < len(metadata):
            return metadata[idx]
        return {}

    if isinstance(metadata, dict):
        if str(idx) in metadata:
            return metadata[str(idx)]
        if idx in metadata:
            return metadata[idx]

    return {}


def get_text(item):
    if not isinstance(item, dict):
        return str(item)

    for key in ["text", "content", "chunk", "evidence"]:
        if key in item and item[key] is not None:
            return str(item[key])

    return str(item)


def get_filename(item):
    if not isinstance(item, dict):
        return "Unknown"

    for key in ["document", "file_name", "filename", "source", "document_id", "file"]:
        if key in item and item[key] is not None:
            return str(item[key])

    return "Unknown"


def get_section(item):
    if not isinstance(item, dict):
        return "Unknown"

    for key in ["section", "heading", "title"]:
        if key in item and item[key] is not None:
            return str(item[key])

    return "Unknown"


def get_chunk_id(item, fallback):
    if isinstance(item, dict):
        for key in ["chunk", "chunk_id", "id"]:
            if key in item:
                return item[key]
    return fallback


# ============================================================
# 4. RAG GROUNDED RETRIEVAL V2
# ============================================================

STOPWORDS = {
    "the", "a", "an", "is", "are", "was", "were", "this", "that", "these",
    "those", "and", "or", "of", "to", "in", "on", "for", "with", "from",
    "does", "do", "what", "how", "why", "if", "it", "its", "be", "provide",
    "present", "configuration", "current", "security", "ipsec", "important"
}

FIELD_TERMS = {
    "ike": ["ike", "ikev1", "ikev2", "key management"],
    "encryption": ["encryption", "cipher", "aes", "aes-gcm", "des", "3des"],
    "integrity": ["integrity", "hmac", "hash", "sha"],
    "authentication": ["authentication", "certificate", "pre-shared key", "psk"],
    "dh": ["diffie-hellman", "diffie hellman", "dh group", "key exchange", "pfs"],
    "pfs": ["pfs", "perfect forward secrecy", "forward secrecy", "child-sa", "child sa", "rekey"],
    "mode": ["tunnel", "transport", "ipsec mode"],
    "esp": ["esp", "encapsulating security payload"],
    "nat": ["nat-t", "nat traversal", "udp encapsulation"],
    "replay": ["replay", "anti-replay", "sequence number", "sequence numbers"],
    "lifetime": ["lifetime", "rekey", "rekeying", "security association"],
    "general": ["security", "best practice", "weak crypto", "deprecated", "legacy", "access control", "traffic selector", "narrow selectors"]
}


def normalize_tokens(text):
    text = str(text).lower().replace("_", "-")
    return set(re.findall(r"[a-z0-9]+(?:-[a-z0-9]+)*", text))


def normalize_text(text):
    return re.sub(r"\s+", " ", str(text).lower()).strip()


def minmax(vals):
    if not vals:
        return []
    min_v = min(vals)
    max_v = max(vals)
    if max_v == min_v:
        return [1.0 for _ in vals]
    return [(v - min_v) / (max_v - min_v) for v in vals]


def is_boilerplate_chunk(item):
    section = normalize_text(get_section(item))
    text = normalize_text(get_text(item))
    if section in {"# rag safety and scope", "## authoritative references"}:
        return True
    if text.startswith("# rag safety and scope"):
        return True
    return False


def grounded_relevant_fields(question):
    q = normalize_text(question)
    fields = set()

    if any(x in q for x in ["ike", "key management"]):
        fields.add("ike")
    if any(x in q for x in ["encrypt", "cipher", "aes", "des", "3des"]):
        fields.add("encryption")
    if any(x in q for x in ["integrity", "hmac", "sha", "hash"]):
        fields.add("integrity")
    if any(x in q for x in ["authentication", "certificate", "psk", "pre-shared"]):
        fields.add("authentication")
    if any(x in q for x in ["diffie", "hellman", "dh group", "dh parameter"]):
        fields.add("dh")
    if any(x in q for x in ["pfs", "forward secrecy"]):
        fields.add("pfs")
    if any(x in q for x in ["tunnel", "transport", "mode"]):
        fields.add("mode")
    if "esp" in q:
        fields.add("esp")
    if any(x in q for x in ["nat", "nat-t", "traversal"]):
        fields.add("nat")
    if any(x in q for x in ["replay", "sequence number"]):
        fields.add("replay")
    if any(x in q for x in ["lifetime", "rekey", "security association"]):
        fields.add("lifetime")
    if any(x in q for x in ["secure", "security", "risk", "weak", "best practice", "vulnerability"]):
        fields.add("general")

    if not fields:
        fields.add("general")

    return fields


def grounded_topic_terms(question):
    terms = []
    for field in grounded_relevant_fields(question):
        terms.extend(FIELD_TERMS[field])
    return list(dict.fromkeys(terms))


def grounded_lexical_score(question, text):
    q = normalize_text(question)
    t = normalize_text(text)
    q_tokens = normalize_tokens(question) - STOPWORDS
    t_tokens = normalize_tokens(text)

    overlap = q_tokens & t_tokens
    score = len(overlap) / max(1, len(q_tokens))

    for term in grounded_topic_terms(question):
        if term in t:
            if " " in term or "-" in term:
                score += 0.35
            else:
                score += 0.18

    exact_phrases = [
        "replay protection", "replay attack", "anti-replay", "perfect forward secrecy",
        "forward secrecy", "diffie-hellman", "key exchange", "security association",
        "weak crypto", "deprecated", "legacy des", "3des", "aes-gcm", "strong hmac",
        "narrow selectors", "traffic selectors"
    ]

    for phrase in exact_phrases:
        if phrase in q and phrase in t:
            score += 0.75

    return float(score)


def grounded_configuration_score(text, configuration=None):
    t = normalize_text(text)
    if not configuration:
        return 0.0

    checks = [
        (configuration.get("encryption", ""), ["encryption", "cipher", "aes", "des", "3des"]),
        (configuration.get("integrity", ""), ["integrity", "hmac", "sha"]),
        (configuration.get("authentication", ""), ["authentication", "certificate", "psk"]),
        (configuration.get("dh_group", ""), ["diffie-hellman", "dh group", "key exchange"]),
        (configuration.get("pfs", ""), ["pfs", "forward secrecy"]),
        (configuration.get("replay_protection", ""), ["replay", "anti-replay", "sequence"]),
        (configuration.get("esp", ""), ["esp"]),
        (configuration.get("nat_t", ""), ["nat-t", "nat traversal"]),
        (configuration.get("ipsec_mode", ""), ["tunnel", "transport"]),
        (configuration.get("key_lifetime", ""), ["lifetime", "rekey", "security association"])
    ]

    score = 0.0
    for value, terms in checks:
        if any(term in t for term in terms):
            score += 0.15
        val_text = normalize_text(value)
        if len(val_text) > 2 and val_text in t:
            score += 0.10

    return score


def grounded_retrieve_evidence(question, configuration=None, final_k=5):
    """Configuration-aware hybrid retrieval with Cross-Encoder reranking."""
    if index is None or index.ntotal == 0 or embedding_model is None:
        return f"IPsec security assessment: {question}", []

    configuration_text = build_configuration_text(configuration or {})
    fields = grounded_relevant_fields(question)

    queries = [
        f"IPsec security assessment: {question}",
        f"IPsec security risks and best practices: {question}"
    ]

    if configuration:
        for field in sorted(fields):
            terms = ", ".join(FIELD_TERMS[field][:8])
            val = configuration.get(field, "")
            queries.append(f"IPsec {field}: {val}. Evidence about {terms}.")

    all_vectors = index.reconstruct_n(0, index.ntotal).astype("float32")
    candidate_indices = set()

    for query in queries:
        emb = embedding_model.encode([query], normalize_embeddings=True, show_progress_bar=False)
        scores = np.dot(all_vectors, np.asarray(emb[0], dtype="float32"))
        top_n = min(35, len(scores))
        top_idx = np.argsort(scores)[-top_n:][::-1]
        candidate_indices.update(int(x) for x in top_idx)

    candidates = []
    for idx in candidate_indices:
        item = get_metadata_item(idx)
        if not item:
            continue
        ev_text = get_text(item).strip()
        if not ev_text or is_boilerplate_chunk(item):
            continue

        semantic_best = -1.0
        for query in queries:
            emb = embedding_model.encode([query], normalize_embeddings=True, show_progress_bar=False)
            sc = float(np.dot(all_vectors[idx], np.asarray(emb[0], dtype="float32")))
            semantic_best = max(semantic_best, sc)

        lexical = grounded_lexical_score(question, ev_text)
        cfg_score = grounded_configuration_score(ev_text, configuration)

        candidates.append({
            "index": idx,
            "chunk_id": get_chunk_id(item, idx),
            "faiss_score": semantic_best,
            "file": get_filename(item),
            "section": get_section(item),
            "text": ev_text,
            "lexical_score": lexical,
            "configuration_score": cfg_score
        })

    if not candidates:
        return f"IPsec security assessment: {question}", []

    semantic_norm = minmax([x["faiss_score"] for x in candidates])
    lexical_norm = minmax([x["lexical_score"] for x in candidates])
    config_norm = minmax([x["configuration_score"] for x in candidates])

    for item, sem, lex, cfg in zip(candidates, semantic_norm, lexical_norm, config_norm):
        item["semantic_norm"] = float(sem)
        item["lexical_norm"] = float(lex)
        item["configuration_norm"] = float(cfg)
        item["candidate_score"] = 0.45 * sem + 0.35 * lex + 0.20 * cfg

    candidates.sort(key=lambda x: x["candidate_score"], reverse=True)
    candidate_data = candidates[:60]

    rerank_query = f"IPsec security question: {question}\nConfiguration:\n{configuration_text}"
    pairs = [[rerank_query, item["text"]] for item in candidate_data]

    if reranker is not None and pairs:
        rerank_scores = reranker.predict(pairs, show_progress_bar=False)
        for item, sc in zip(candidate_data, rerank_scores):
            item["rerank_score"] = float(sc)
    else:
        for item in candidate_data:
            item["rerank_score"] = item["candidate_score"]

    rerank_norm = minmax([x["rerank_score"] for x in candidate_data])

    for item, rn in zip(candidate_data, rerank_norm):
        item["rerank_norm"] = float(rn)
        item["final_score"] = 0.58 * rn + 0.22 * item["lexical_norm"] + 0.20 * item["configuration_norm"]

    candidate_data.sort(key=lambda x: x["final_score"], reverse=True)

    for rank, item in enumerate(candidate_data, start=1):
        item["faiss_rank"] = rank
        item["faiss_score"] = float(item.get("faiss_score", 0.0))
        item["rerank_score"] = float(item.get("rerank_score", 0.0))

    selected = []
    used_sections = set()

    for item in candidate_data:
        if len(selected) >= final_k:
            break
        sec_key = (item["file"], item["section"])
        if sec_key not in used_sections:
            selected.append(item)
            used_sections.add(sec_key)

    for item in candidate_data:
        if len(selected) >= final_k:
            break
        if item not in selected:
            selected.append(item)

    selected.sort(key=lambda x: x["final_score"], reverse=True)
    return f"IPsec security assessment: {question}", selected[:final_k]


# Compatibility alias
retrieve_evidence = grounded_retrieve_evidence


# ============================================================
# 5. BUILD EVIDENCE TEXT FOR QWEN
# ============================================================

def build_evidence_text(top_evidence):
    if not top_evidence:
        return "NO_RELEVANT_EVIDENCE_RETRIEVED"

    evidence_text = ""
    for i, item in enumerate(top_evidence, 1):
        evidence_text += f"""
[EVIDENCE {i}]
File: {item['file']}
Chunk: {item['chunk_id']}
Section: {item['section']}
FAISS score: {item['faiss_score']:.4f}
Reranker score: {item['rerank_score']:.4f}

{item['text']}
"""
    return evidence_text.strip()


# ============================================================
# 6. QWEN SYSTEM & USER PROMPT
# ============================================================

SYSTEM_PROMPT = """
You are an evidence-grounded cybersecurity reasoning assistant specialized in IPsec security assessment.

Your task is to assess the supplied network traffic and IPsec configuration using the retrieved evidence.

STRICT EVIDENCE RULES:
1. Do not invent facts, vulnerabilities, attacks, or weaknesses.
2. Do not assume ML class 0 or 1 means safe, malicious, attack, or benign.
3. Treat the ML result as an observation only unless its class meaning is explicitly supplied.
4. Technical IPsec claims must be supported by the supplied evidence whenever possible.
5. If the evidence does not establish that a setting is weak, say: "Not established from the available evidence."
6. Never invent a specific cryptographic group, algorithm, protocol version, parameter value, CVE, or remediation setting.
7. Do not turn a generic word such as "strong" into a specific DH group number.
8. Do not claim a configuration is secure merely because no weakness was found.
9. Distinguish clearly between: confirmed weakness supported by evidence, potential concern requiring verification, and information that cannot be determined.
10. Recommendations must be supported by the retrieved evidence or be stated only as a verification action.
11. What-if analysis must change one supplied configuration property and explain the evidence-supported consequence.
12. If the evidence is insufficient, abstain rather than guess.
13. Return ONLY the final assessment between the required markers.
"""


def build_user_prompt(traffic, ml_result, configuration_text, question, evidence_text):
    return f"""
Assess the following network traffic and IPsec configuration.

NETWORK TRAFFIC:
Source Port: {traffic.get("source_port")}
Destination Port: {traffic.get("destination_port")}
Protocol: {traffic.get("protocol")}
Duration: {traffic.get("duration")}
Packet Count: {traffic.get("packet_count")}
Bytes Sent: {traffic.get("bytes_sent")}
Bytes Received: {traffic.get("bytes_received")}
Bytes Per Packet: {traffic.get("bytes_per_packet")}

ML RESULT:
Predicted Class: {ml_result.get("predicted_class")}
Confidence: {ml_result.get("confidence", 0.0):.4f}

The meaning of the ML class is UNKNOWN unless explicitly supported by evidence.

IPsec CONFIGURATION:
{configuration_text}

USER QUESTION:
{question}

RETRIEVED IPsec EVIDENCE:
{evidence_text}

Produce the final answer using EXACTLY this structure:

FINAL_ASSESSMENT_START

ASSESSMENT:
State the overall assessment. Clearly distinguish confirmed issues, potential concerns, and items not established by evidence.

EVIDENCE:
List only the retrieved evidence that directly supports the assessment. Mention the source file and section when useful.

RISK:
Explain the security risk only when supported by evidence. If no weakness is established, say so explicitly.

RECOMMENDATION:
Give only evidence-supported recommendations or verification steps. Do not invent exact parameter values.

WHAT_IF:
Choose one important supplied configuration parameter and explain how the assessment would change if that parameter were weakened or disabled.

CONFIDENCE:
Give HIGH, MEDIUM, or LOW confidence and briefly explain whether the retrieved evidence directly answers the question.

ABSTENTION:
State what cannot be determined from the available evidence. If nothing important is missing, say "None."

FINAL_ASSESSMENT_END
""".strip()


# ============================================================
# 7. STRICT CLAIM GROUNDING GATE
# ============================================================

UNSUPPORTED_TECHNICAL_PATTERNS = [
    r"\b(?:dh|diffie[- ]hellman)\s*(?:group\s*)?\d{1,3}\b",
    r"\b\d{3,5}\s*[- ]?bit\b",
    r"\b(?:aes|sha|hmac|des|3des)[- ]?\d{1,4}\b",
    r"\bCVE-\d{4}-\d{4,7}\b",
    r"\b(?:ikev1|ikev2)\b",
    r"\b(?:crl|ocsp)\b"
]


def sentence_has_unsupported_technical_value(sentence, allowed_text):
    sentence_normalized = normalize_text(sentence)
    for pattern in UNSUPPORTED_TECHNICAL_PATTERNS:
        matches = re.findall(pattern, sentence_normalized, flags=re.IGNORECASE)
        for match in matches:
            if normalize_text(match) not in allowed_text:
                return True
    return False


def apply_strict_grounding_gate(response, evidence_text, configuration_text=""):
    response = re.sub(r"<think>.*?</think>", "", response, flags=re.IGNORECASE | re.DOTALL)
    if re.search(r"<think>", response, flags=re.IGNORECASE):
        response = re.split(r"<think>", response, maxsplit=1, flags=re.IGNORECASE)[0]

    allowed_text = normalize_text(configuration_text + "\n" + evidence_text)
    output_lines = []
    blocked = 0

    for line in response.splitlines():
        if not line.strip():
            output_lines.append(line)
            continue

        sentences = re.split(r"(?<=[.!?])\s+", line.strip())
        safe_sentences = []

        for sentence in sentences:
            if sentence_has_unsupported_technical_value(sentence, allowed_text):
                blocked += 1
                safe_sentences.append(
                    "This specific technical detail cannot be determined from the supplied configuration and retrieved evidence."
                )
            else:
                safe_sentences.append(sentence)

        output_lines.append(" ".join(safe_sentences))

    result = "\n".join(output_lines).strip()
    if blocked:
        result += f"\n\nGROUNDING NOTICE:\n{blocked} unsupported exact technical claim(s) were withheld because they were not established by the supplied configuration or retrieved evidence."

    return result


# ============================================================
# 8. GENERATE QWEN RESPONSE
# ============================================================

def generate_qwen_response(user_prompt, evidence_text="", configuration_text=""):
    if qwen_model is None or tokenizer is None:
        return """FINAL_ASSESSMENT_START

ASSESSMENT:
Model Qwen3-14B is not currently loaded in this environment.

EVIDENCE:
Retrieved evidence is displayed in the evidence panel.

RISK:
Not established without active LLM inference.

RECOMMENDATION:
Ensure Qwen3-14B model parameters are available at QWEN_MODEL_PATH.

WHAT_IF:
Loading Qwen3-14B will enable full evidence-grounded reasoning.

CONFIDENCE:
LOW - Model offline.

ABSTENTION:
Full reasoning requires Qwen3-14B.

FINAL_ASSESSMENT_END"""

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_prompt}
    ]

    prompt_text = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    inputs = tokenizer(prompt_text, return_tensors="pt")

    input_device = next(qwen_model.parameters()).device
    inputs = {key: val.to(input_device) for key, val in inputs.items()}

    with torch.no_grad():
        output = qwen_model.generate(
            **inputs,
            max_new_tokens=1200,
            do_sample=False,
            pad_token_id=tokenizer.eos_token_id
        )

    generated_tokens = output[0][inputs["input_ids"].shape[1]:]
    response = tokenizer.decode(generated_tokens, skip_special_tokens=True)

    extracted = extract_final_assessment(response)
    return apply_strict_grounding_gate(extracted, evidence_text, configuration_text)


# ============================================================
# 9. EXTRACT & PARSE ASSESSMENT
# ============================================================

def extract_final_assessment(response):
    start_marker = "FINAL_ASSESSMENT_START"
    end_marker = "FINAL_ASSESSMENT_END"

    if start_marker in response:
        final_response = response.split(start_marker, 1)[1]
        if end_marker in final_response:
            final_response = final_response.split(end_marker, 1)[0]
    else:
        final_response = re.sub(r"<think>.*?</think>", "", response, flags=re.IGNORECASE | re.DOTALL)
        if "ASSESSMENT:" in final_response:
            final_response = final_response[final_response.index("ASSESSMENT:"):]

    return final_response.strip()


def parse_assessment(text):
    sections = {
        "assessment": "",
        "evidence": "",
        "risk": "",
        "recommendation": "",
        "what_if": "",
        "confidence": "",
        "abstention": ""
    }

    markers = [
        ("ASSESSMENT:", "assessment"),
        ("EVIDENCE:", "evidence"),
        ("RISK:", "risk"),
        ("RECOMMENDATION:", "recommendation"),
        ("WHAT_IF:", "what_if"),
        ("CONFIDENCE:", "confidence"),
        ("ABSTENTION:", "abstention")
    ]

    positions = []
    for marker, key in markers:
        pos = text.find(marker)
        if pos != -1:
            positions.append((pos, marker, key))

    positions.sort(key=lambda x: x[0])

    for i, (pos, marker, key) in enumerate(positions):
        start = pos + len(marker)
        end = positions[i + 1][0] if i + 1 < len(positions) else len(text)
        sections[key] = text[start:end].strip()

    return sections


# ============================================================
# 10. COMPLETE PROGRAMMATIC SECURITY ASSESSMENT
# ============================================================

def assess_security(traffic, configuration, question):
    """
    Main programmatic entrypoint for FastAPI backend & external tools.
    """
    load_all_models()

    ml_result = run_ml_assessment(traffic)
    configuration_text = build_configuration_text(configuration)

    _, top_evidence = grounded_retrieve_evidence(
        question=question,
        configuration=configuration,
        final_k=5
    )

    evidence_text = build_evidence_text(top_evidence)

    user_prompt = build_user_prompt(
        traffic=traffic,
        ml_result=ml_result,
        configuration_text=configuration_text,
        question=question,
        evidence_text=evidence_text
    )

    raw_response = generate_qwen_response(
        user_prompt=user_prompt,
        evidence_text=evidence_text,
        configuration_text=configuration_text
    )

    final_response = extract_final_assessment(raw_response)
    parsed_response = parse_assessment(final_response)

    return {
        "question": question,
        "traffic": traffic,
        "configuration": configuration,
        "ml": ml_result,
        "rag": {
            "candidates_retrieved": len(top_evidence),
            "evidence": top_evidence
        },
        "assessment": parsed_response,
        "final_response": final_response
    }


# ============================================================
# DEFAULT TEST DATA & TERMINAL CLI MODE
# ============================================================

DEFAULT_TRAFFIC = {
    "source_port": 50000,
    "destination_port": 443,
    "protocol": 6,
    "duration": 2,
    "packet_count": 50,
    "bytes_sent": 5000,
    "bytes_received": 7000,
    "bytes_per_packet": 150
}

DEFAULT_CONFIGURATION = {
    "ike_version": "IKEv2",
    "encryption": "AES-256-GCM",
    "integrity": "SHA-256",
    "authentication": "Certificate",
    "dh_group": "Strong group",
    "pfs": "Enabled",
    "ipsec_mode": "Tunnel",
    "esp": "Enabled",
    "nat_t": "Enabled",
    "replay_protection": "Enabled",
    "key_lifetime": "Limited"
}


def terminal_mode():
    load_all_models()

    print("\n" + "=" * 80)
    print("TERMINAL TEST MODE")
    print("=" * 80)
    print("\nDefault network traffic:", json.dumps(DEFAULT_TRAFFIC, indent=2))
    print("\nDefault IPsec configuration:", json.dumps(DEFAULT_CONFIGURATION, indent=2))

    while True:
        try:
            question = input("\nEnter your IPsec security question (or 'exit'): ").strip()
        except (EOFError, KeyboardInterrupt):
            break

        if question.lower() in {"exit", "quit", "q"}:
            break

        if not question:
            continue

        result = assess_security(DEFAULT_TRAFFIC, DEFAULT_CONFIGURATION, question)
        print("\n" + "=" * 80)
        print("FINAL IPsec SECURITY ASSESSMENT")
        print("=" * 80)
        print(result["final_response"])


if __name__ == "__main__":
    terminal_mode()
