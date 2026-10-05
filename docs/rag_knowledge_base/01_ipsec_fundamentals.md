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

# 1. IPsec Fundamentals

## Definition
IPsec is a suite of standards that provides security services at the IP layer. Its principal traffic-protection protocols are ESP and AH; automated key management is normally performed by IKE. RFC 4301 defines the IPsec security architecture.

## Purpose
IPsec protects IP traffic against eavesdropping, modification, spoofing of protected traffic, and replay, depending on the selected algorithms and policy.

## How it works
1. A policy determines which traffic requires protection.
2. IKE authenticates peers and negotiates cryptographic parameters.
3. IKE creates Security Associations.
4. ESP or AH applies the negotiated protection to matching packets.
5. The receiver validates, decrypts when applicable, checks anti-replay state, and applies policy.

## Important components
- Security Policy Database (SPD): traffic-policy decisions.
- Security Association Database (SAD): active SA state.
- IKE daemon/state machine.
- ESP/AH processing.
- Cryptographic algorithms and keys.
- Traffic selectors or policy selectors.
- Peer identities and authentication credentials.

## Configuration concepts
A practical site-to-site design normally defines local/remote gateways, protected subnets, IKE proposal, authentication method, IPsec/CHILD_SA proposal, lifetimes/rekey behavior, and firewall/NAT treatment.

## Important parameters
Peer addresses; IKE version; authentication method; encryption; integrity/PRF; Diffie-Hellman group; ESP mode; ESP encryption/integrity or AEAD; traffic selectors; PFS/rekey DH; DPD/liveness; NAT-T.

## Example
EXAMPLE CONFIGURATION:
LOCAL_NETWORK=192.168.10.0/24
REMOTE_NETWORK=192.168.20.0/24
LOCAL_GATEWAY=203.0.113.10
REMOTE_GATEWAY=203.0.113.20
Use these only as fictional documentation values.

## Common mistakes
Confusing IKE SA with IPsec/CHILD_SA; encrypting the wrong traffic; mismatched proposals; forgetting NAT exemption where required; treating ESP as TCP/UDP; exposing management services on the VPN gateway.

## Troubleshooting steps
Check underlay reachability; verify UDP 500/4500 reachability as applicable; inspect IKE negotiation; compare proposals and identities; inspect CHILD_SA/IPsec counters; verify routes and traffic selectors; check NAT/firewall logs.

## Security considerations
Prefer IKEv2 for new deployments when supported. Prefer modern AEAD such as AES-GCM where interoperability permits. Disable obsolete algorithms and unnecessary IKEv1 modes. Use certificates for larger deployments when practical; protect PSKs strongly when PSK authentication is used.

## Related concepts
VPN, PKI, NAT-T, PFS, routing, firewall policy, cryptographic suites, traffic selectors.

## FAQ
**What does IPsec protect?** IP traffic selected by policy; it does not automatically protect every packet.
**Is IKE itself the encrypted application tunnel?** No. IKE negotiates and maintains security state; ESP normally protects the user traffic.

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
