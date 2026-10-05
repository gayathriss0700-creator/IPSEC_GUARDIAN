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

# 3. IPsec Protocol Reference

## Protocol table

| Protocol | IP protocol number | TCP/UDP port | Purpose |
|---|---:|---|---|
| ESP | 50 | None | Confidentiality, integrity/authentication, anti-replay |
| AH | 51 | None | Integrity, data-origin authentication, anti-replay |
| IKE | UDP | 500 | Key management and negotiation |
| IKE with NAT-T | UDP | 4500 | IKE and UDP-encapsulated ESP through NAT |

ESP and AH are IP protocols, not TCP/UDP services. They therefore do not have a TCP or UDP "port 50" or "port 51". UDP 500/4500 are for IKE/NAT-T.

## OSI/TCP-IP layer
ESP/AH operate at the IP/network layer. IKE is a key-management protocol carried over UDP.

## How protocols work together
IKE authenticates peers and negotiates parameters. ESP/AH then protect selected traffic according to the resulting SAs.

## Security properties
ESP can provide confidentiality plus integrity/authentication and anti-replay. AH provides integrity/data-origin authentication but not confidentiality. Modern deployments generally favor ESP.

## Common use
ESP tunnel mode: site-to-site VPN. ESP transport mode: host-to-host protection. IKEv2: negotiation and SA management.

## Configuration considerations
Firewall policy must allow the correct protocol/ports. With NAT-T, ESP is carried inside UDP 4500. Without NAT, native ESP protocol 50 can be used.

## Troubleshooting
If UDP 500 works but ESP does not, inspect protocol 50 filtering. If NAT exists, check whether both peers switch to UDP 4500. Do not troubleshoot ESP by looking for TCP port 50.

## RFC references
RFC 4301, RFC 4302, RFC 4303, RFC 7296, RFC 3947, RFC 3948.

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
