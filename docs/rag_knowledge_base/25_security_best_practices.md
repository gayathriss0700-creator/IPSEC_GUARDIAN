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

# 25. IPsec Security Best Practices

## Definition
Secure IPsec configuration combines strong cryptography, strong authentication, narrow policy, secure operations, and lifecycle management.

## Purpose
Reduce compromise likelihood and limit the impact of configuration mistakes.

## Recommended practices
1. Prefer IKEv2 for new deployments.
2. Prefer ESP over AH for normal VPN use.
3. Prefer authenticated encryption such as AES-GCM where supported.
4. Avoid DES, 3DES, and weak legacy hashes for new configurations.
5. Use PFS for CHILD_SA rekeying when supported and appropriate.
6. Use certificates for scalable peer authentication when practical.
7. If PSKs are required, use unique, high-entropy PSKs per peer.
8. Narrow traffic selectors.
9. Restrict IKE/ESP exposure to expected peers where feasible.
10. Permit UDP 4500 when NAT-T is needed.
11. Protect management interfaces separately.
12. Patch VPN gateways and clients.
13. Monitor authentication failures, tunnel state, and unexpected peer changes.
14. Redact keys and credentials from logs.
15. Document vendor/version-specific assumptions.
16. Test failover and rekey behavior.
17. Validate effective policy after every change.

## Deprecated/weak algorithms
DES and 3DES should not be selected for new deployments. MD5 and SHA-1 should generally be avoided for new security designs except where an explicitly documented interoperability constraint exists. Exact algorithm status should be checked against current IETF and vendor guidance.

## Security considerations
Algorithm recommendations evolve. RFC 8247 and RFC 9395 provide IKEv2 algorithm guidance; ESP algorithm guidance is covered by documents such as RFC 8221 and later updates.

## Related concepts
Cryptographic agility, PKI, PFS, least privilege, zero trust, patch management.

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
