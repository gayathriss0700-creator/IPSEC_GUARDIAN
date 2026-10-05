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

# 13. Diffie-Hellman Key Exchange and Perfect Forward Secrecy

## Definition
Diffie-Hellman (DH) is a key-agreement method that lets peers derive shared secret material without sending the resulting secret directly. Perfect Forward Secrecy (PFS) means compromise of long-term authentication material does not reveal past session keys, assuming fresh ephemeral key exchanges were used appropriately.

## Purpose
Establish fresh keying material and reduce the impact of later credential compromise.

## How it works
Peers exchange DH public values and independently compute the same shared secret. IKE uses DH during key establishment. IKEv2 can also use an additional DH exchange when creating/rekeying CHILD_SAs if PFS is configured.

## Important components
DH group, ephemeral/private values, public values, derived keys, rekey policy.

## Configuration concepts
IKE DH and CHILD_SA PFS DH are distinct settings. Some platforms reuse terminology such as `group`, `pfs`, or `dh-group`.

## Important parameters
DH group, key exchange method, rekey interval.

## Example
EXAMPLE: IKEv2 uses an agreed modern DH group; CHILD_SA rekey uses a PFS group. Exact group numbers/names must be checked against the platform.

## Common mistakes
Mismatched DH group; assuming IKE DH automatically means CHILD_SA PFS; choosing weak legacy groups.

## Troubleshooting
Compare IKE proposal DH with IPsec/CHILD_SA PFS settings separately.

## Security considerations
Use groups recommended by current standards/vendor guidance. Do not treat a group number as universally equivalent across every configuration syntax without checking documentation.

## Related concepts
IKE, PFS, rekey, ECDH, cryptographic agility.

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
