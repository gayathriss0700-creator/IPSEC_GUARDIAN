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

# 15. Site-to-Site VPN

## Definition
A site-to-site IPsec VPN securely connects networks through gateways.

## Purpose
Allow hosts in one private network to communicate with hosts in another while protecting traffic across an untrusted network.

## How it works
Gateway A and B authenticate, negotiate IKE and IPsec SAs, and encrypt matching inter-site traffic.

## Important components
Two gateways, WAN reachability, protected subnets, routes, IKE, ESP, firewall, NAT exemption where applicable.

## Configuration concepts
EXAMPLE:
LOCAL_NETWORK=192.168.10.0/24
REMOTE_NETWORK=192.168.20.0/24
LOCAL_GATEWAY=203.0.113.10
REMOTE_GATEWAY=203.0.113.20
Traffic from local to remote is selected for ESP tunnel protection.

## Important parameters
Peer IP, local/remote selectors, IKE proposal, authentication, ESP proposal, PFS, lifetimes, routing.

## Example
A packet 192.168.10.50 -> 192.168.20.50 is routed to the VPN gateway, encrypted into ESP, crosses the Internet, and is decrypted at the remote gateway.

## Common mistakes
No route; NAT applied before VPN selection; selectors reversed; peer address unreachable; firewall blocks UDP 500/4500 or ESP.

## Troubleshooting
Ping peer WAN addresses; verify IKE; verify CHILD_SA; inspect encrypted packet counters; test an allowed inner flow; check NAT and routing.

## Security considerations
Limit selectors, use strong algorithms, authenticate peers strongly, log tunnel state without exposing secrets, and restrict management access.

## Related concepts
Remote access, tunnel mode, NAT-T, routing, firewall.

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
