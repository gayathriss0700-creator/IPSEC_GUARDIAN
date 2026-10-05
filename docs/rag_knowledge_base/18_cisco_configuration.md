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

# 18. Cisco IOS IPsec Configuration Examples

## Vendor scope
The following syntax is Cisco IOS/IOS XE style and is NOT universal. Exact commands vary by release, platform, and whether crypto maps, VTIs, FlexVPN, or other features are used. Verify against the target release.

## A. Cisco IOS IKEv1 site-to-site example
EXAMPLE CONFIGURATION — fictional lab values:
```text
crypto isakmp policy 10
 encryption aes 256
 hash sha256
 authentication pre-share
 group 14
!
crypto isakmp key EXAMPLE_ONLY_PSK address 203.0.113.20
!
crypto ipsec transform-set LAB-ESP esp-aes 256 esp-sha256-hmac
 mode tunnel
!
ip access-list extended VPN-TRAFFIC
 permit ip 192.168.10.0 0.0.0.255 192.168.20.0 0.0.0.255
!
crypto map LAB-MAP 10 ipsec-isakmp
 set peer 203.0.113.20
 set transform-set LAB-ESP
 match address VPN-TRAFFIC
!
interface GigabitEthernet0/0
 ip address 203.0.113.10 255.255.255.0
 crypto map LAB-MAP
```

### Line explanations
- `crypto isakmp policy 10`: creates an IKEv1 policy with priority 10.
- `encryption aes 256`: selects AES-256 for IKE protection where supported.
- `hash sha256`: selects the IKEv1 hash/integrity setting.
- `authentication pre-share`: uses a PSK.
- `group 14`: selects the DH group in this example; verify support and current policy.
- `crypto isakmp key ...`: associates a PSK with the peer. The shown value is intentionally not a real secret.
- `crypto ipsec transform-set`: defines an ESP transform set.
- `mode tunnel`: selects tunnel mode.
- `VPN-TRAFFIC`: identifies protected "interesting" traffic.
- `crypto map`: ties peer, transform set, and traffic selector together.
- `set peer`: remote gateway address.
- `match address`: traffic that should trigger/protect the VPN.
- Interface `crypto map`: applies the crypto map to the external interface.

Cisco documents these commands for IOS/IOS XE IPsec configurations. Exact availability is release-specific.

## B. NAT exemption concept
VPN traffic should normally not be translated when the design expects the original inner addresses. Cisco implementations may use a NAT ACL/route-map arrangement; exact syntax is release-dependent.

## C. Verification
Common Cisco IOS/IOS XE commands include:
`show crypto isakmp sa`
`show crypto ipsec sa`
`show crypto map`
Exact output and command availability depend on platform/release.

## Common mistakes
Wrong peer; mismatched transform set; ACL selectors reversed; NAT applied to VPN traffic; crypto map not applied.

## Security considerations
For new designs, prefer IKEv2 and current algorithms supported by the platform. Avoid real credentials in documentation or source control.

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
