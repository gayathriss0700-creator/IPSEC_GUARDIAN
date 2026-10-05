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

# 2. IPsec Architecture

## Definition
IPsec architecture describes how policy, security associations, key management, and packet-processing functions cooperate to protect IP traffic.

## Purpose
It provides a consistent model for deciding whether traffic is bypassed, discarded, or protected and for applying the correct SA.

## How it works
Outbound traffic is classified against policy and, when protection is required, associated with an outbound SA. Inbound traffic is checked against an inbound SA and security policy. IKE supplies dynamically negotiated SA parameters and keys.

## Important components
- SPD: policy rules.
- SAD: inbound/outbound SA records.
- Security protocol: ESP or AH.
- IKE: key-management/control plane.
- Security gateway: router/firewall/VPN concentrator.
- Traffic selectors: source, destination, protocol, and optional ports.

## Configuration concepts
Architectures can be host-to-host, host-to-gateway, or gateway-to-gateway. Tunnel mode is common for gateway VPNs because it protects an entire inner IP packet.

## Important parameters
Mode, selectors, SA direction, SPI, algorithms, key lifetimes, peer identity, gateway addresses, anti-replay settings.

## Example
A gateway at LOCAL_GATEWAY protects LOCAL_NETWORK to REMOTE_NETWORK through an ESP tunnel to REMOTE_GATEWAY.

## Common mistakes
Assuming one SA is bidirectional; ignoring that an SA is directional; mixing IKE policy with ESP policy; allowing cleartext bypass accidentally.

## Troubleshooting
Determine whether failure is underlay, IKE, CHILD_SA/IPsec, policy, routing, or application-layer. Check both inbound and outbound state.

## Security considerations
Use least-privilege selectors. Avoid broad 0.0.0.0/0 selectors unless deliberately designing full-tunnel or remote-access policy. Protect management plane separately.

## Related concepts
SPD, SAD, SA, SPI, IKE, ESP, AH, traffic selectors.

## FAQ
**Is an SA bidirectional?** No. An IPsec SA is unidirectional; bidirectional communication normally uses a pair.
**What chooses an SA?** Policy/selector processing plus SA state, including the SPI for inbound IPsec processing.

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
