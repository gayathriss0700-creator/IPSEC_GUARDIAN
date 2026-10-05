# RAG safety and scope
This document is a technical knowledge-base artifact for a college-level IPsec/network-security assistant. Configuration examples are fictional and intended for isolated labs. They use documentation/test-network addresses such as 192.168.10.0/24, 192.168.20.0/24 and TEST_PUBLIC_* placeholders. Never copy example secrets into production. Vendor-specific syntax is labeled as such.

Terminology:
- IPsec = Internet Protocol Security.
- IKE = Internet Key Exchange.
- SA = Security Association.
- SPD = Security Policy Database.
- SAD = Security Association Database.
- ESP = Encapsulating Security Payload.
- AH = Authentication Header.

# 11. Encryption Algorithms

## Definition
Encryption provides confidentiality. IPsec commonly uses symmetric ciphers for bulk traffic.

## Purpose
Prevent unauthorized parties from reading protected traffic.

## How it works
The negotiated key and algorithm transform ESP payload data. Modern AEAD algorithms can provide confidentiality and integrity together.

## Important components
AES, AES-GCM, AES-CBC, ChaCha20-Poly1305 where a particular implementation supports it, key length, nonce/IV handling.

## Configuration concepts
Algorithm names and syntax are vendor-specific. An IKE proposal and an ESP proposal are separate.

## Important parameters
Cipher, key size, AEAD mode, integrity selection where separate, DH/PFS, proposal ordering.

## Example
Recommended modern lab concept: ESP AES-256-GCM. Legacy interoperability concept: AES-CBC with HMAC-SHA-256, if required by both endpoints.

## Common mistakes
Using DES/3DES for new deployments; selecting CBC encryption with no integrity; assuming AES-GCM needs a separate HMAC in the same way CBC does.

## Troubleshooting
If proposals fail, compare exact algorithm/mode/key-size names and whether each side supports AEAD.

## Security considerations
Prefer modern authenticated encryption. Deprecate DES and 3DES where possible. Treat algorithm policy as lifecycle-managed, not permanent.

## Related concepts
AEAD, integrity, IKE proposals, ESP transforms, RFC 8247, RFC 8221.

## FAQ
**Is AES-256 automatically safer than every AES-128 deployment?** Security depends on the overall design; both can be strong. Interoperability and policy requirements also matter.

## Authoritative references
- RFC 4301 — Security Architecture for the Internet Protocol.
- RFC 4302 — IP Authentication Header.
- RFC 4303 — IP Encapsulating Security Payload.
- RFC 7296 — Internet Key Exchange Protocol Version 2.
- RFC 3947 — Negotiation of NAT-Traversal in the IKE.
- RFC 3948 — UDP Encapsulation of IPsec ESP Packets.
- RFC 8247 — IKEv2 Algorithm Implementation Requirements and Usage Guidance.
- RFC 6071 — IPsec and IKE Document Roadmap.
Vendor-specific references should be checked for the exact Cisco IOS/IOS XE release, strongSwan version, or Windows version in use.
