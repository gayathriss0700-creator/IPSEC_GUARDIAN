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

# 7. IKEv1

## Definition
IKEv1 is the original Internet Key Exchange protocol, defined by a family of RFCs including RFC 2409 and related ISAKMP/DOI documents. It has been superseded by IKEv2.

## Purpose
IKEv1 negotiates an ISAKMP/IKE security association and then IPsec SAs.

## How it works
Common terminology uses Phase 1 and Phase 2. Phase 1 establishes an authenticated ISAKMP SA, using Main Mode or Aggressive Mode. Phase 2 commonly uses Quick Mode to negotiate IPsec SAs.

## Important components
ISAKMP SA, Main Mode, Aggressive Mode, Quick Mode, pre-shared key or certificates, proposals, DH group.

## Configuration concepts
Exact syntax varies by vendor. Legacy Cisco IOS examples may use `crypto isakmp policy`, `crypto isakmp key`, `crypto ipsec transform-set`, and crypto maps.

## Important parameters
Encryption, hash/integrity, authentication, DH group, lifetime, peer identity, transform set, selectors.

## Example
EXAMPLE CONFIGURATION (Cisco IOS, vendor-specific, lab only):
crypto isakmp policy 10
 encryption aes 256
 hash sha256
 authentication pre-share
 group 14
!
This is an illustrative legacy syntax example; available algorithms vary by IOS release.

## Common mistakes
Using Aggressive Mode unnecessarily; weak hashes; weak DH groups; confusing Phase 1 with Phase 2.

## Troubleshooting
Inspect IKE policy negotiation, authentication, then IPsec transform-set/Quick Mode. Cisco IOS commonly provides `show crypto isakmp sa` and `show crypto ipsec sa` on supported releases.

## Security considerations
Use IKEv2 for new deployments when possible. Treat IKEv1 as legacy/interoperability technology and disable it if not needed.

## Related concepts
RFC 2409, IKEv2, ISAKMP, Quick Mode, Phase 1/2.

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
