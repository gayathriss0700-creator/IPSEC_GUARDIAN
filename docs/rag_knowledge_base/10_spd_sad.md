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

# 10. Security Policy Database (SPD) and Security Association Database (SAD)

## Definition
The SPD contains policy rules describing how traffic should be treated. The SAD contains active SA state.

## Purpose
Together they separate policy decisions from cryptographic session state.

## How it works
For outbound traffic, policy classification can result in BYPASS, DISCARD, or PROTECT. PROTECT processing uses an appropriate outbound SA. For inbound traffic, the packet is checked against SA and policy requirements.

## Important components
SPD selectors, actions, SAD entries, SPI, protocol, algorithms, keys, replay state.

## Configuration concepts
Cisco crypto ACLs, strongSwan traffic selectors, Windows IPsec rules, and firewall/VPN policy objects are vendor-specific representations of similar policy ideas.

## Important parameters
Source/destination selectors, protocol/ports, direction, action, peer/SA, mode.

## Example
EXAMPLE POLICY:
192.168.10.0/24 -> 192.168.20.0/24 = PROTECT using ESP tunnel.
Other Internet traffic = normal routing/BYPASS unless another policy applies.

## Common mistakes
Overlapping selectors; incorrect direction; selectors broader on one peer than the other; treating a firewall ACL as identical to an SPD.

## Troubleshooting
Check which policy matched, then which SA was selected. Inspect route, selector, and SA counters.

## Security considerations
Use least-privilege selectors and explicit deny rules where appropriate. Avoid unintended cleartext bypass.

## Related concepts
SA, SAD, SPD, traffic selectors, crypto ACL, firewall policy.

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
