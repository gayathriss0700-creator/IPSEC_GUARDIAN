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

# 23. IPsec Troubleshooting

## Definition
IPsec troubleshooting isolates failures across underlay connectivity, IKE, IPsec/CHILD_SA, policy, routing, NAT/firewall, and application layers.

## Method
1. Confirm peer addresses are reachable.
2. Confirm UDP 500/4500 as appropriate.
3. Identify IKE version and failed exchange.
4. Compare IKE proposals.
5. Verify authentication.
6. Verify CHILD_SA/ESP proposals and PFS.
7. Verify traffic selectors.
8. Verify routes.
9. Verify NAT exemption/translation behavior.
10. Check ESP/IPsec counters.
11. Test one known flow.
12. Check application-specific behavior.

## Important diagnostics
Packet captures, IKE daemon logs, SA tables, policy tables, route tables, firewall/NAT logs.

## Common symptoms
- No IKE packets: underlay/firewall/routing.
- IKE_SA_INIT fails: proposal/DH/transport issue.
- IKE_AUTH fails: identity/authentication/certificate/PSK issue.
- CHILD_SA fails: ESP proposal/PFS/traffic selector issue.
- SA established but no data: route, selector, NAT, firewall, MTU, or application issue.
- One direction works: asymmetric routing/policy/NAT/replay issue.

## Example
If IKE establishes but CHILD_SA does not, do not keep changing the PSK first. Compare ESP/CHILD_SA proposals, PFS, selectors, and mode.

## Security considerations
Redact secrets from logs and captures. Avoid publishing private keys or PSKs in tickets.

## Related concepts
IKEv2 exchanges, SA, SPD/SAD, NAT-T, firewall.

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
