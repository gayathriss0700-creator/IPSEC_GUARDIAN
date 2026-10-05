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

# 24. Common IPsec Configuration Errors

## Error 1: Proposal mismatch
Cause: No common IKE or ESP transform. Fix: compare exact algorithms, key sizes, integrity/AEAD, and DH.

## Error 2: Authentication failure
Cause: Wrong PSK, wrong identity, expired/untrusted certificate, or incompatible authentication method. Fix: verify identity and trust configuration without exposing secrets.

## Error 3: Phase 1 / IKE failure
Cause: peer unreachable, UDP 500/4500 blocked, IKE mismatch, DH mismatch, or authentication problem.

## Error 4: Phase 2 / CHILD_SA failure
Cause: traffic selectors, ESP proposal, PFS, or mode mismatch.

## Error 5: Tunnel established but traffic fails
Cause: route, selector, firewall, NAT, MTU, or application issue.

## Error 6: NAT breaks VPN
Cause: native ESP cannot cross a particular NAT path. Fix: ensure NAT-T is negotiated and UDP 4500 is allowed.

## Error 7: No traffic counters
Cause: selector does not match, route not using gateway, or policy not installed.

## Error 8: Asymmetric selectors
Cause: local/remote networks reversed or different masks.

## Error 9: Weak crypto
Cause: copied legacy configuration. Fix: remove deprecated algorithms and use current vendor/IETF guidance.

## Error 10: Vendor syntax copied unchanged
Cause: commands differ among Cisco IOS, ASA, strongSwan, Windows, and other products. Fix: consult the target platform's documentation.

## Error 11: Secret leakage
Cause: PSK/private key embedded in tickets, repositories, or chat. Fix: rotate exposed secrets and store them securely.

## Error 12: Management exposure
Cause: VPN gateway administration reachable from untrusted networks. Fix: restrict management source networks and require strong authentication.

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
