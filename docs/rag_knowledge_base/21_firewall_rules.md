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

# 21. IPsec Firewall Rules and Security Policies

## Rule format
Rule ID | Name | Purpose | Source | Destination | Protocol | Port | Action | Authentication | Encryption | Integrity | Security level | Reason | Example | Common mistake

| IPSEC-001 | IKE | Establish IKE | Remote VPN peer | Local VPN gateway | UDP | 500 | Allow | Required by IKE | Negotiated | Negotiated | High | IKE control traffic | Allow UDP/500 from known peers | Treating it as TCP |
| IPSEC-002 | NAT-T | IKE/UDP-encapsulated ESP | Remote peer | Local gateway | UDP | 4500 | Allow | IKE authentication | ESP inside UDP | Negotiated | High | NAT traversal | Allow UDP/4500 from known peers | Blocking 4500 when NAT exists |
| IPSEC-003 | ESP | Native ESP | Remote peer | Local gateway | IP protocol 50 | N/A | Allow if used | SA required | ESP | ESP integrity/AEAD | High | Non-NAT ESP transport | Permit protocol 50 where design requires | Creating TCP/50 rule |
| IPSEC-004 | AH | Native AH | Remote peer | Local gateway | IP protocol 51 | N/A | Allow only if required | SA required | None | AH integrity | Medium | Legacy/specialized designs | Permit protocol 51 only when used | Expecting encryption |
| IPSEC-005 | VPN traffic | Protected subnet flow | Local subnet | Remote subnet | As required | As required | Allow after IPsec policy | IPsec SA | Required | Required | High | Least privilege | Permit only approved services | Allowing all ports |
| IPSEC-006 | Management | Administrative access | Admin network | VPN gateway | TCP/SSH or vendor management | Vendor-specific | Allow from admin segment | Strong admin auth | TLS/IPsec as designed | Required | High | Reduce attack surface | Restrict management to admin subnet | Exposing management to Internet |
| IPSEC-007 | Authentication | Peer authentication | VPN peers | VPN gateway | IKE | 500/4500 | Allow | Strong identity auth | IKE | Integrity | High | Prevent rogue peers | Certificate/strong PSK | Shared weak PSK |
| IPSEC-008 | Encryption | Cryptographic requirement | VPN peers | VPN peers | IPsec/IKE | N/A | Require | Required | Strong modern cipher | Required | High | Confidentiality | AES-GCM where supported | Legacy DES/3DES |
| IPSEC-009 | Integrity | Packet integrity | VPN peers | VPN peers | ESP/AH | N/A | Require | Required | AEAD or separate integrity | Required | High | Detect modification | AES-GCM or strong HMAC suite | Encryption without integrity |
| IPSEC-010 | Access control | Least privilege | Approved sources | Approved destinations | As needed | As needed | Allow only listed | IPsec auth | Required | Required | High | Limit blast radius | Narrow selectors | 0.0.0.0/0 unintentionally |
| IPSEC-011 | Weak crypto | Block deprecated suites | Any | VPN gateway | IKE/IPsec | N/A | Deny/disable | N/A | No DES/3DES | No weak hashes | High | Reduce cryptographic risk | Remove legacy proposals | Keeping legacy fallback forever |

## Important firewall facts
IKE commonly uses UDP 500. NAT-T uses UDP 4500. ESP is IP protocol 50 and AH is IP protocol 51. Firewall syntax is vendor-specific.

## Common mistakes
Allowing only UDP 500 when NAT-T is required; blocking protocol 50 in a non-NAT design; allowing VPN traffic but forgetting IKE; broad source rules.

## Troubleshooting
Check both gateway-local firewall and upstream firewall/NAT. Confirm whether traffic is native ESP or UDP-encapsulated.

## Security considerations
Allow only known peers where practical. Do not expose management interfaces unnecessarily.

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
