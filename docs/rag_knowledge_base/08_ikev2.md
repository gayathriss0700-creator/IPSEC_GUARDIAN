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

# 8. IKEv2

## Definition
IKEv2 is the current Internet Standard version of IKE, specified by RFC 7296 and updated by later RFCs.

## Purpose
It provides authenticated negotiation and maintenance of IKE and IPsec SAs with a cleaner exchange model than IKEv1.

## How it works
Initial setup commonly consists of IKE_SA_INIT and IKE_AUTH. IKE_SA_INIT negotiates cryptographic parameters and performs DH exchange. IKE_AUTH authenticates identities and creates the first CHILD_SA. CREATE_CHILD_SA can create/rekey CHILD_SAs; INFORMATIONAL exchanges carry notifications and liveness/deletion information.

## Important components
IKE SA, CHILD SA, proposal, transforms, traffic selectors, AUTH payload, identities, EAP in some deployments, rekeying.

## Configuration concepts
Define an IKE proposal, authentication, peer identity, and one or more CHILD_SA proposals/selectors.

## Important parameters
Encryption; integrity/PRF; DH; authentication; local/remote identities; local/remote traffic selectors; ESP transforms; rekey intervals; MOBIKE where supported; NAT-T.

## Example
EXAMPLE CONFIGURATION CONCEPT:
IKEv2: AES-256-GCM + agreed DH group + certificate authentication.
CHILD_SA: ESP AES-256-GCM + agreed PFS/rekey group.
Exact syntax is vendor-specific.

## Common mistakes
Assuming IKE proposal and ESP proposal are the same; wrong identity; selector mismatch; missing certificate trust chain; unsupported DH.

## Troubleshooting
Use IKE logs to locate the failed exchange. Compare proposal lists, authentication identity, trust chain/PSK, and selectors.

## Security considerations
Use current algorithm guidance from RFC 8247 and its updates. Avoid weak/obsolete algorithms and unnecessary broad selectors.

## Related concepts
RFC 7296, RFC 7427, RFC 8247, CHILD_SA, PFS, EAP, NAT-T.

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
