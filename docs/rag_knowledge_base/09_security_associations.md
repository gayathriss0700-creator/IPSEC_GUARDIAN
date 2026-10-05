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

# 9. Security Associations (SA)

## Definition
A Security Association is a set of parameters used to protect traffic in one direction using AH or ESP. An IPsec SA is simplex/unidirectional.

## Purpose
The SA tells the IPsec implementation how to process protected traffic.

## How it works
An SA contains an SPI, protocol, destination address, cryptographic algorithms/keys, sequence state, anti-replay information, lifetime, and related parameters.

## Important components
SPI, destination, protocol, algorithms, keys, sequence number, anti-replay window, lifetime, mode, selectors.

## Configuration concepts
IKE negotiates SAs dynamically. Manual SAs are possible but are harder to operate safely at scale.

## Important parameters
SPI, algorithm suite, key material, lifetime, mode, peer, traffic selectors.

## Example
A tunnel may have one outbound ESP SA and one inbound ESP SA. The two directions normally use distinct SA state.

## Common mistakes
Calling the IKE SA the same thing as an IPsec SA; assuming one SA is bidirectional; stale SA state after configuration changes.

## Troubleshooting
Check SA counters, SPI values, lifetime/rekey state, and whether the correct traffic selectors map to the SA.

## Security considerations
Use automated key management, timely rekeying, anti-replay protection, and secure algorithm suites.

## Related concepts
SAD, SPD, SPI, IKE, CHILD_SA.

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
