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

# 16. Remote-Access VPN

## Definition
A remote-access VPN connects an individual host/client to an organization or service gateway.

## Purpose
Provide protected access from an untrusted network to selected internal resources.

## How it works
The client authenticates, receives or selects virtual/assigned addressing, and establishes IPsec SAs to the gateway. IKEv2 is commonly used; EAP methods may support user authentication.

## Important components
VPN gateway, client, virtual IP, authentication backend, certificates/PSK, traffic selectors, DNS/routes.

## Configuration concepts
Full tunnel sends broad traffic through the VPN; split tunnel sends only selected networks through it. Exact support is vendor-specific.

## Important parameters
Client identity, authentication method, virtual IP pool, selectors, DNS, routes, IKE/ESP proposals.

## Example
EXAMPLE: Client receives 10.250.10.10 from a fictional VPN pool and is permitted to reach 192.168.20.0/24.

## Common mistakes
Overbroad access, incorrect virtual IP pool, missing route, DNS mismatch, certificate identity mismatch.

## Troubleshooting
Check authentication first, then assigned address, CHILD_SA selectors, routes, DNS, and application access.

## Security considerations
Use least privilege and MFA where the platform supports it. Segment remote users and log authentication/security events.

## Related concepts
EAP, IKEv2, certificates, split tunnel, full tunnel.

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
