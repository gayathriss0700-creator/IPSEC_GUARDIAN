from pathlib import Path

path = Path("ipsec_security_assessment.py")
text = path.read_text(encoding="utf-8")

marker = "# ============================================================\n# INTERACTIVE SECURITY QUESTION LOOP"

if marker not in text:
    raise SystemExit("Could not find insertion point. No changes made.")

upgrade = r'''
# ============================================================
# V2 GROUNDED RETRIEVAL + STRICT CLAIM GATE
# ============================================================

FIELD_TERMS = {
    "ike": [
        "ike", "ikev1", "ikev2", "key management"
    ],
    "encryption": [
        "encryption", "cipher", "aes", "aes-gcm", "des", "3des"
    ],
    "integrity": [
        "integrity", "hmac", "hash", "sha"
    ],
    "authentication": [
        "authentication", "certificate", "pre-shared key", "psk"
    ],
    "dh": [
        "diffie-hellman", "diffie hellman", "dh group",
        "key exchange", "pfs"
    ],
    "pfs": [
        "pfs", "perfect forward secrecy", "forward secrecy",
        "child-sa", "child sa", "rekey"
    ],
    "mode": [
        "tunnel", "transport", "ipsec mode"
    ],
    "esp": [
        "esp", "encapsulating security payload"
    ],
    "nat": [
        "nat-t", "nat traversal", "udp encapsulation"
    ],
    "replay": [
        "replay", "anti-replay", "sequence number",
        "sequence numbers"
    ],
    "lifetime": [
        "lifetime", "rekey", "rekeying",
        "security association"
    ],
    "general": [
        "security", "best practice", "weak crypto",
        "deprecated", "legacy", "access control",
        "traffic selector", "narrow selectors"
    ]
}


def grounded_relevant_fields(question):
    q = normalize_text(question)
    fields = set()

    if any(x in q for x in ["ike", "key management"]):
        fields.add("ike")

    if any(x in q for x in [
        "encrypt", "cipher", "aes", "des", "3des"
    ]):
        fields.add("encryption")

    if any(x in q for x in [
        "integrity", "hmac", "sha", "hash"
    ]):
        fields.add("integrity")

    if any(x in q for x in [
        "authentication", "certificate", "psk", "pre-shared"
    ]):
        fields.add("authentication")

    if any(x in q for x in [
        "diffie", "hellman", "dh group", "dh parameter"
    ]):
        fields.add("dh")

    if any(x in q for x in [
        "pfs", "forward secrecy"
    ]):
        fields.add("pfs")

    if any(x in q for x in [
        "tunnel", "transport", "mode"
    ]):
        fields.add("mode")

    if "esp" in q:
        fields.add("esp")

    if any(x in q for x in [
        "nat", "nat-t", "traversal"
    ]):
        fields.add("nat")

    if any(x in q for x in [
        "replay", "sequence number"
    ]):
        fields.add("replay")

    if any(x in q for x in [
        "lifetime", "rekey", "security association"
    ]):
        fields.add("lifetime")

    if any(x in q for x in [
        "secure", "security", "risk", "weak",
        "best practice", "vulnerability"
    ]):
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
        "replay protection",
        "replay attack",
        "anti-replay",
        "perfect forward secrecy",
        "forward secrecy",
        "diffie-hellman",
        "key exchange",
        "security association",
        "weak crypto",
        "deprecated",
        "legacy des",
        "3des",
        "aes-gcm",
        "strong hmac",
        "narrow selectors",
        "traffic selectors"
    ]

    for phrase in exact_phrases:
        if phrase in q and phrase in t:
            score += 0.75

    return float(score)


def grounded_configuration_score(text):
    t = normalize_text(text)

    checks = [
        (encryption, [
            "encryption", "cipher", "aes", "des", "3des"
        ]),
        (integrity, [
            "integrity", "hmac", "sha"
        ]),
        (authentication, [
            "authentication", "certificate", "psk"
        ]),
        (dh_group, [
            "diffie-hellman", "dh group", "key exchange"
        ]),
        (pfs, [
            "pfs", "forward secrecy"
        ]),
        (replay_protection, [
            "replay", "anti-replay", "sequence"
        ]),
        (esp, ["esp"]),
        (nat_t, ["nat-t", "nat traversal"]),
        (ipsec_mode, ["tunnel", "transport"]),
        (key_lifetime, [
            "lifetime", "rekey", "security association"
        ])
    ]

    score = 0.0

    for value, terms in checks:
        if any(term in t for term in terms):
            score += 0.15

        value_text = normalize_text(value)

        if len(value_text) > 2 and value_text in t:
            score += 0.10

    return score


def grounded_retrieve_evidence(question, final_k=5):
    """
    Configuration-aware retrieval.

    Instead of depending on one embedding of the entire prompt,
    retrieve evidence for the question and each relevant IPsec field.
    """

    fields = grounded_relevant_fields(question)

    queries = [
        f"IPsec security assessment: {question}",
        f"IPsec security risks and best practices: {question}"
    ]

    field_values = {
        "ike": ike_version,
        "encryption": encryption,
        "integrity": integrity,
        "authentication": authentication,
        "dh": dh_group,
        "pfs": pfs,
        "mode": ipsec_mode,
        "esp": esp,
        "nat": nat_t,
        "replay": replay_protection,
        "lifetime": key_lifetime
    }

    for field in sorted(fields):
        terms = ", ".join(FIELD_TERMS[field][:8])
        value = field_values.get(field, "")

        queries.append(
            f"IPsec {field}: {value}. "
            f"Evidence about {terms}."
        )

    # Reconstruct the existing IndexFlatIP vectors.
    all_vectors = index.reconstruct_n(
        0,
        index.ntotal
    ).astype("float32")

    candidate_indices = set()

    # Retrieve top candidates for every targeted query.
    for query in queries:
        embedding = embedding_model.encode(
            [query],
            normalize_embeddings=True,
            show_progress_bar=False
        )

        scores = np.dot(
            all_vectors,
            np.asarray(embedding[0], dtype="float32")
        )

        top_n = min(35, len(scores))

        top_indices = np.argsort(scores)[
            -top_n:
        ][::-1]

        candidate_indices.update(
            int(x) for x in top_indices
        )

    candidates = []

    for idx in candidate_indices:
        item = get_metadata_item(idx)

        if not item:
            continue

        evidence = get_text(item).strip()

        if not evidence:
            continue

        if is_boilerplate_chunk(item):
            continue

        # Best semantic similarity across all targeted queries.
        semantic_best = -1.0

        for query in queries:
            embedding = embedding_model.encode(
                [query],
                normalize_embeddings=True,
                show_progress_bar=False
            )

            score = float(
                np.dot(
                    all_vectors[idx],
                    np.asarray(
                        embedding[0],
                        dtype="float32"
                    )
                )
            )

            semantic_best = max(
                semantic_best,
                score
            )

        lexical = grounded_lexical_score(
            question,
            evidence
        )

        config_score = grounded_configuration_score(
            evidence
        )

        candidates.append({
            "index": idx,
            "chunk_id": get_chunk_id(item, idx),
            "faiss_score": semantic_best,
            "file": get_filename(item),
            "section": get_section(item),
            "text": evidence,
            "lexical_score": lexical,
            "configuration_score": config_score
        })

    if not candidates:
        return (
            f"IPsec security assessment: {question}",
            []
        )

    semantic_norm = minmax([
        x["faiss_score"]
        for x in candidates
    ])

    lexical_norm = minmax([
        x["lexical_score"]
        for x in candidates
    ])

    config_norm = minmax([
        x["configuration_score"]
        for x in candidates
    ])

    for item, sem, lex, cfg in zip(
        candidates,
        semantic_norm,
        lexical_norm,
        config_norm
    ):
        item["semantic_norm"] = float(sem)
        item["lexical_norm"] = float(lex)
        item["configuration_norm"] = float(cfg)

        item["candidate_score"] = (
            0.45 * sem +
            0.35 * lex +
            0.20 * cfg
        )

    candidates.sort(
        key=lambda x: x["candidate_score"],
        reverse=True
    )

    # Cross-Encoder reranking.
    candidate_data = candidates[:60]

    rerank_query = (
        f"IPsec security question: {question}\n"
        f"Configuration:\n{configuration_text}"
    )

    pairs = [
        [rerank_query, item["text"]]
        for item in candidate_data
    ]

    rerank_scores = reranker.predict(
        pairs,
        show_progress_bar=False
    )

    for item, score in zip(
        candidate_data,
        rerank_scores
    ):
        item["rerank_score"] = float(score)

    rerank_norm = minmax([
        x["rerank_score"]
        for x in candidate_data
    ])

    for item, rn in zip(
        candidate_data,
        rerank_norm
    ):
        item["rerank_norm"] = float(rn)

        item["final_score"] = (
            0.58 * rn +
            0.22 * item["lexical_norm"] +
            0.20 * item["configuration_norm"]
        )

    candidate_data.sort(
        key=lambda x: x["final_score"],
        reverse=True
    )

    # --------------------------------------------------------
    # Evidence diversity
    # --------------------------------------------------------

    selected = []
    used_sections = set()

    def matches_field(item, field):
        evidence = normalize_text(
            item["text"]
        )

        return any(
            term in evidence
            for term in FIELD_TERMS[field]
        )

    # First take the strongest evidence for the fields that
    # actually matter to the user's question.
    for field in sorted(fields):

        matches = [
            item
            for item in candidate_data
            if matches_field(item, field)
        ]

        if not matches:
            continue

        best = max(
            matches,
            key=lambda x: x["final_score"]
        )

        section_key = (
            best["file"],
            best["section"]
        )

        if (
            best not in selected
            and section_key not in used_sections
        ):
            selected.append(best)
            used_sections.add(section_key)

        if len(selected) >= final_k:
            break

    # Fill remaining slots.
    for item in candidate_data:

        if len(selected) >= final_k:
            break

        if item in selected:
            continue

        section_key = (
            item["file"],
            item["section"]
        )

        if section_key in used_sections:
            continue

        selected.append(item)
        used_sections.add(section_key)

    # Final fallback.
    for item in candidate_data:

        if len(selected) >= final_k:
            break

        if item not in selected:
            selected.append(item)

    selected.sort(
        key=lambda x: x["final_score"],
        reverse=True
    )

    return (
        f"IPsec security assessment: {question}",
        selected[:final_k]
    )


# ============================================================
# STRICT CLAIM GROUNDING
# ============================================================

UNSUPPORTED_TECHNICAL_PATTERNS = [

    # Numeric DH groups / exact DH parameters
    r"\b(?:dh|diffie[- ]hellman)\s*(?:group\s*)?\d{1,3}\b",

    # Exact bit lengths
    r"\b\d{3,5}\s*[- ]?bit\b",

    # Exact crypto variants
    r"\b(?:aes|sha|hmac|des|3des)[- ]?\d{1,4}\b",

    # CVEs
    r"\bCVE-\d{4}-\d{4,7}\b",

    # Exact protocol versions
    r"\b(?:ikev1|ikev2)\b",

    # CRL/OCSP claims
    r"\b(?:crl|ocsp)\b"
]


def normalize_grounding_text(text):
    return normalize_text(text)


def sentence_has_unsupported_technical_value(
    sentence,
    allowed_text
):
    sentence_normalized = normalize_grounding_text(
        sentence
    )

    for pattern in UNSUPPORTED_TECHNICAL_PATTERNS:

        matches = re.findall(
            pattern,
            sentence_normalized,
            flags=re.IGNORECASE
        )

        for match in matches:

            normalized_match = normalize_grounding_text(
                match
            )

            if normalized_match not in allowed_text:
                return True

    return False


def apply_strict_grounding_gate(
    response,
    evidence_text
):
    """
    Conservative hallucination gate.

    It specifically blocks exact technical parameters that were not
    supplied by the configuration or retrieved evidence.
    """

    response = re.sub(
        r"<think>.*?</think>",
        "",
        response,
        flags=re.IGNORECASE | re.DOTALL
    )

    # Never expose an unclosed reasoning block.
    if re.search(
        r"<think>",
        response,
        flags=re.IGNORECASE
    ):
        response = re.split(
            r"<think>",
            response,
            maxsplit=1,
            flags=re.IGNORECASE
        )[0]

    allowed_text = normalize_grounding_text(
        configuration_text +
        "\n" +
        evidence_text
    )

    output_lines = []
    blocked = 0

    for line in response.splitlines():

        if not line.strip():
            output_lines.append(line)
            continue

        sentences = re.split(
            r"(?<=[.!?])\s+",
            line.strip()
        )

        safe_sentences = []

        for sentence in sentences:

            if sentence_has_unsupported_technical_value(
                sentence,
                allowed_text
            ):
                blocked += 1

                safe_sentences.append(
                    "This specific technical detail "
                    "cannot be determined from the "
                    "supplied configuration and "
                    "retrieved evidence."
                )

            else:
                safe_sentences.append(sentence)

        output_lines.append(
            " ".join(safe_sentences)
        )

    result = "\n".join(
        output_lines
    ).strip()

    if blocked:

        result += (
            "\n\nGROUNDING NOTICE:\n"
            f"{blocked} unsupported exact technical "
            "claim(s) were withheld because they were "
            "not established by the supplied "
            "configuration or retrieved evidence."
        )

    return result


# ============================================================
# OVERRIDE ORIGINAL RETRIEVAL
# ============================================================

retrieve_evidence = grounded_retrieve_evidence


# ============================================================
# OVERRIDE QWEN RESPONSE
# ============================================================

_original_generate_qwen_response = generate_qwen_response


def grounded_generate_qwen_response(
    question,
    evidence_text
):
    result = _original_generate_qwen_response(
        question,
        evidence_text
    )

    return apply_strict_grounding_gate(
        result,
        evidence_text
    )


generate_qwen_response = grounded_generate_qwen_response

'''

new_text = text.replace(
    marker,
    upgrade + "\n\n" + marker,
    1
)

path.write_text(new_text, encoding="utf-8")

print("Grounding upgrade applied successfully.")
print(f"New line count: {len(new_text.splitlines())}")
