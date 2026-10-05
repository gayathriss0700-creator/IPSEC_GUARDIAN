import sys
import os
import json

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ipsec_security_assessment import assess_security, DEFAULT_TRAFFIC, DEFAULT_CONFIGURATION

question = "Why is PFS important in IKEv2?"

print("=" * 80)
print("IPSEC GUARDIAN SECURITY ASSESSMENT TEST")
print("=" * 80)
print(f"Question: {question}\n")

result = assess_security(DEFAULT_TRAFFIC, DEFAULT_CONFIGURATION, question)

print("=" * 80)
print("1. MACHINE LEARNING TRAFFIC EVALUATION")
print("=" * 80)
print(json.dumps(result["ml"], indent=2))

print("\n" + "=" * 80)
print(f"2. RAG RETRIEVAL & CROSS-ENCODER RERANKING ({result['rag']['candidates_retrieved']} Evidence Chunks)")
print("=" * 80)

for i, ev in enumerate(result["rag"]["evidence"], 1):
    print(f"\n[Evidence #{i}]")
    print(f"File         : {ev['file']}")
    print(f"Section      : {ev['section']}")
    print(f"FAISS Score  : {ev['faiss_score']:.4f}")
    print(f"Rerank Score : {ev.get('rerank_score', 0.0):.4f}")
    print(f"Text Snippet : {ev['text'][:180]}...")

print("\n" + "=" * 80)
print("3. FINAL EVIDENCE-GROUNDED ASSESSMENT")
print("=" * 80)
print(result["final_response"])
