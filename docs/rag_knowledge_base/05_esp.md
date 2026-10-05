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

# 5. Encapsulating Security Payload (ESP)

## Definition
ESP is IP protocol 50 and is the principal IPsec traffic-protection protocol.

## Purpose
ESP provides confidentiality when encryption is enabled, integrity/data-origin authentication when an integrity mechanism is selected, and anti-replay protection.

## How it works
In tunnel mode, ESP protects an entire inner IP packet and adds an outer IP header. In transport mode, ESP protects the transport payload and selected parts of the original IP packet. ESP uses an SPI and sequence number to identify the SA and support replay protection.

## Important components
SPI, sequence number, encrypted payload, padding, next-header field, integrity/authentication data when applicable.

## Configuration concepts
Choose an ESP suite. Modern configurations commonly use an AEAD suite such as AES-GCM, or encryption plus a separate integrity algorithm where required for interoperability.

## Important parameters
Encryption/AEAD algorithm, key size, integrity algorithm if separate, mode, PFS/rekey DH, lifetimes, anti-replay.

## Example
EXAMPLE CONFIGURATION:
ESP proposal: AES-256-GCM, tunnel mode, PFS using an agreed modern DH group. Exact syntax is vendor-specific.

## Common mistakes
Treating ESP as UDP/TCP; selecting encryption without integrity; mismatching GCM vs CBC/HMAC suites; forgetting NAT-T.

## Troubleshooting
Check negotiated CHILD_SA/Phase 2; compare ESP proposals; inspect packet counters; verify protocol 50 or UDP 4500; check traffic selectors and routes.

## Security considerations
Prefer authenticated encryption (AEAD), such as AES-GCM, where supported. Avoid obsolete DES/3DES and weak integrity options. Do not rely on confidentiality alone.

## Related concepts
CHILD_SA, transform/proposal, PFS, NAT-T, tunnel mode.

## FAQ
**What port does ESP use?** None; ESP is IP protocol 50.
**Can ESP provide integrity without encryption?** IPsec permits ESP configurations providing integrity without confidentiality, but confidentiality without integrity is not recommended.

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
