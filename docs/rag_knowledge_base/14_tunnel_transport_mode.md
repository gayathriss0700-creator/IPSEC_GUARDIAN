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

# 14. Tunnel Mode and Transport Mode

## Definition
Tunnel mode protects an entire inner IP packet and adds an outer IP header. Transport mode protects the payload of an IP packet while retaining the original IP header.

## Purpose
Tunnel mode is typical for gateway-to-gateway VPNs. Transport mode is useful for host-to-host protection and some specialized designs.

## How it works
Tunnel: original packet becomes protected inner content; outer header identifies tunnel endpoints.
Transport: original IP header remains as the outer packet header; ESP/AH protects the payload/selected fields.

## Important components
Outer/inner IP headers, ESP/AH, tunnel endpoints, traffic selectors.

## Configuration concepts
Cisco transform sets, strongSwan child mode, and Windows IPsec rules use vendor-specific terms.

## Important parameters
Mode, local/remote selectors, outer gateway addresses, protocol/port selectors.

## Example
EXAMPLE TUNNEL:
LOCAL_NETWORK 192.168.10.0/24 -> REMOTE_NETWORK 192.168.20.0/24 using ESP tunnel mode.
EXAMPLE TRANSPORT:
Host A -> Host B using ESP transport mode for selected host-to-host traffic.

## Common mistakes
Using transport mode for a gateway VPN without understanding endpoint requirements; misunderstanding outer vs inner addresses.

## Troubleshooting
Capture traffic at both sides and identify outer IP addresses, ESP/UDP 4500, and inner protected addresses after decryption.

## Security considerations
Tunnel mode hides the original internal addresses from observers on the untrusted path more effectively than transport mode.

## Related concepts
ESP, AH, NAT-T, site-to-site VPN.

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
