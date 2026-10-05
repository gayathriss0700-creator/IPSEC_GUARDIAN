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

# 17. IPsec Configuration

## Definition
IPsec configuration is the process of defining peer connectivity, authentication, cryptographic proposals, traffic selectors, routing, and firewall/NAT behavior.

## Purpose
Create a predictable, interoperable protected path.

## Configuration sequence
1. Establish underlay reachability.
2. Choose IKEv2 unless legacy interoperability requires IKEv1.
3. Define authentication.
4. Define IKE proposal.
5. Define ESP/CHILD_SA proposal.
6. Define selectors/mode.
7. Configure firewall and NAT behavior.
8. Configure routes.
9. Validate with counters/logs.
10. Test controlled application traffic.

## Important parameters
Peer IP, IKE version, identity, auth method, encryption, integrity/PRF, DH, ESP/AEAD, PFS, selectors, lifetimes, NAT-T.

## EXAMPLE CONFIGURATION
LOCAL_NETWORK=192.168.10.0/24
REMOTE_NETWORK=192.168.20.0/24
LOCAL_GATEWAY=203.0.113.10
REMOTE_GATEWAY=203.0.113.20
IKE=IKEv2
ESP=ESP-AES-GCM
MODE=tunnel
These names are conceptual unless mapped to a specific vendor syntax.

## Common mistakes
Copying syntax between platforms; assuming algorithm names are universal; forgetting NAT exemption; configuring selectors but no route; using a weak PSK.

## Troubleshooting
Separate control plane (IKE) from data plane (ESP/CHILD_SA) and from routing/firewall/application layers.

## Security considerations
Use strong cryptography, narrow selectors, secure authentication, minimal firewall exposure, and documented change control.

## Related concepts
Cisco crypto map/VTI, strongSwan swanctl, Windows IPsec policy.

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
