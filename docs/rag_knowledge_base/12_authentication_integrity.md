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

# 12. Authentication and Integrity

## Definition
Authentication verifies peer identity or data origin; integrity detects unauthorized modification. IPsec uses both peer authentication in IKE and packet integrity/authentication in ESP/AH.

## Purpose
Prevent unauthorized peers from establishing trust and detect altered protected packets.

## How it works
IKE can authenticate peers using PSKs, certificates, raw public keys, or EAP-based methods depending on IKE version and implementation. ESP/AH can use integrity protection; AEAD combines encryption and integrity.

## Important components
PSK, X.509 certificates, digital signatures, HMAC, integrity transforms, trust anchors.

## Configuration concepts
Authentication method must be compatible with the peer and policy. Certificate deployments require correct identity matching and certificate validation.

## Important parameters
Identity, trust chain, certificate validity, PSK, signature algorithm, integrity transform.

## Example
EXAMPLE: IKEv2 certificate authentication using fictional `vpn-gw-a.example.invalid` and `vpn-gw-b.example.invalid` identities.

## Common mistakes
Wrong identity/IDr; expired certificate; missing intermediate CA; mismatched PSK; using weak legacy hashes.

## Troubleshooting
Check authentication exchange logs, identity values, certificate chain, clock, trust store, and exact PSK association.

## Security considerations
Prefer certificate-based authentication for larger deployments when lifecycle management is available. Protect private keys. Use strong unique PSKs where PSKs are required.

## Related concepts
PKI, X.509, IKE_AUTH, HMAC, AEAD, PFS.

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
