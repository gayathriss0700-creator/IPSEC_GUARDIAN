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

# 22. NAT Traversal (NAT-T)

## Definition
NAT Traversal (NAT-T) allows IPsec ESP to cross Network Address Translation devices by encapsulating ESP in UDP.

## Purpose
NAT devices commonly track TCP/UDP flows and may not handle native ESP protocol 50 correctly. NAT-T provides UDP encapsulation.

## How it works
IKE detects NAT conditions. When negotiated, IKE and UDP-encapsulated ESP use UDP 4500. RFC 3947 specifies NAT detection/negotiation and RFC 3948 specifies UDP encapsulation of ESP.

## Important components
NAT detection payloads, UDP 4500, non-ESP marker for IKE over 4500, UDP-encapsulated ESP.

## Configuration concepts
Most modern IKE implementations negotiate NAT-T automatically. Some platforms have an explicit NAT-T enable/force setting.

## Important parameters
UDP 4500, keepalives, NAT mapping timeout, peer addresses.

## Example
EXAMPLE: Client behind NAT 10.0.0.10 reaches gateway 203.0.113.20. After NAT detection, IKE/ESP use UDP 4500.

## Common mistakes
Opening UDP 500 but not 4500; expecting protocol 50 to work through every NAT; confusing NAT-T with NAT exemption.

## Troubleshooting
Packet capture: verify IKE begins on UDP 500 and switches/uses UDP 4500 when NAT is detected. Check NAT timeout and firewall rules.

## Security considerations
NAT-T is a transport mechanism, not a substitute for authentication or encryption. Keep peer authentication and cryptographic policy strong.

## Related concepts
RFC 3947, RFC 3948, IKE, ESP.

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
