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

# 6. Internet Key Exchange (IKE)

## Definition
IKE is the key-management protocol used with IPsec to authenticate peers, negotiate cryptographic parameters, establish SAs, and maintain/rekey them.

## Purpose
It avoids manually configuring every traffic-encryption key and provides authenticated negotiation.

## How it works
IKE establishes control-plane security, authenticates the peers, negotiates cryptographic transforms, and creates IPsec SAs. IKEv2 uses IKE_SA_INIT followed by IKE_AUTH for initial setup; subsequent exchanges manage CHILD_SAs and other state.

## Important components
Initiator, responder, IKE SA, CHILD_SA/IPsec SA, proposals, identities, authentication, DH key exchange, traffic selectors, rekeying.

## Configuration concepts
IKE policy/proposal is distinct from the ESP/IPsec proposal. Both peers need at least one compatible combination.

## Important parameters
IKE version, encryption, integrity/PRF, DH group, authentication method, identity, lifetimes/rekey, NAT detection, liveness.

## Example
A fictional IKEv2 configuration can use AES-GCM, a modern DH group, and certificate or PSK authentication, but exact names are platform-specific.

## Common mistakes
Mixing IKE and ESP algorithms; wrong identity; wrong PSK; mismatched DH; firewall blocking UDP 500/4500.

## Troubleshooting
Start with UDP reachability, then identify whether failure is IKE_SA_INIT, IKE_AUTH, or CHILD_SA creation. Compare proposals and authentication data.

## Security considerations
Prefer IKEv2. Use strong algorithms and authentication. Protect PSKs and private keys. Minimize exposed management services.

## Related concepts
IKEv1, IKEv2, ISAKMP, SA, DH, PFS, NAT-T.

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
