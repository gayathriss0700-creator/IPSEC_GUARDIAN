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

# 20. Windows IPsec Configuration Concepts

## Definition
Windows provides IPsec policy and firewall capabilities through Windows Defender Firewall with Advanced Security and Windows PowerShell networking/security cmdlets. Exact capabilities vary by Windows edition/version.

## Purpose
Protect host-to-host or host-to-network traffic and integrate IPsec authentication/encryption into Windows network policy.

## Important components
Windows Defender Firewall with Advanced Security, connection security rules, authentication methods, IPsec settings, IKE/IKEv2, certificates/PSKs where supported.

## Configuration concepts
A connection security rule defines authentication and IPsec requirements between endpoints. Firewall rules control allowed application traffic separately.

## Important parameters
Endpoint addresses, authentication, tunnel/transport behavior, encryption/integrity algorithms, key exchange, authentication requirements.

## Example
EXAMPLE CONCEPT: create a connection security rule requiring authentication for traffic between 192.168.10.0/24 and 192.168.20.0/24. Exact GUI/PowerShell syntax should be verified for the target Windows release.

## Common mistakes
Confusing firewall allow rules with IPsec connection-security rules; applying a policy to the wrong profile; certificate trust/identity mismatch.

## Troubleshooting
Inspect Windows Defender Firewall/IPsec logs, effective rules, authentication/certificate state, and packet captures. Confirm that both endpoints negotiate compatible settings.

## Security considerations
Use least-privilege rules and modern cryptography. Avoid broad "allow all" rules and unmanaged certificates.

## Related concepts
Windows Defender Firewall, IKEv2, certificates, connection security rules.

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
