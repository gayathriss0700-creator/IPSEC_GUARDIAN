# IPsec RAG Knowledge Base

## Scope
26 logical Markdown documents covering IPsec fundamentals, architecture, ESP/AH, IKEv1/IKEv2, SAs, SPD/SAD, algorithms, DH/PFS, modes, VPN types, configuration, Cisco IOS/IOS XE, strongSwan, Windows concepts, firewall rules, NAT-T, troubleshooting, common errors, best practices, and 100 evaluation questions.

## Recommended RAG chunking
- Starting chunk size: 500–800 tokens.
- Starting overlap: 75–120 tokens.
- Prefer section-aware chunking: keep a heading with its definition/purpose/example and avoid splitting tables where possible.
- For configuration code, keep each complete configuration block as a single chunk when it fits; otherwise split at logical blocks.
- Consider 350–600 tokens for high-precision troubleshooting chunks.

## Recommended metadata fields
`document_id`, `file_name`, `title`, `section`, `subsection`, `topic`, `vendor`, `platform`, `protocol`, `rfc`, `mode`, `configuration_type`, `security_level`, `algorithm`, `contains_code`, `contains_example`, `difficulty`, `keywords`, `version_scope`, `source_type`.

## Technologies
IPsec, ESP, AH, IKE, IKEv1, IKEv2, ISAKMP, NAT-T, SPD, SAD, Security Associations, Diffie-Hellman, PFS, AES, AES-GCM, HMAC, X.509/PKI concepts, site-to-site VPN, remote-access VPN, Cisco IOS/IOS XE, strongSwan, Linux, Windows Defender Firewall/IPsec.

## Protocols
ESP (IP protocol 50), AH (IP protocol 51), IKE over UDP 500, NAT-T/UDP 4500.

## Safety and RAG behavior
The assistant should distinguish facts in the knowledge base from facts not covered. It should not invent commands or parameters. Vendor-specific syntax must not be generalized. Example credentials are fictional placeholders and must never be treated as production secrets.
