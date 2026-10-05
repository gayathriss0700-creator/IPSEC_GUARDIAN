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

# 26. IPsec FAQ and RAG Evaluation Questions

This file contains 100 administrator/student questions designed for semantic retrieval and answer evaluation.

## Q001
**Question:** What is IPsec?
**Answer:** IPsec is a suite of IP-layer security standards that uses ESP/AH and key-management mechanisms such as IKE to protect selected IP traffic.
**Relevant Topic:** Fundamentals
**Difficulty:** Easy
**Keywords:** IPsec, VPN, ESP, IKE

## Q002
**Question:** What is the difference between AH and ESP?
**Answer:** AH provides integrity/data-origin authentication but no confidentiality; ESP can provide confidentiality and integrity/authentication and is the normal choice for VPNs.
**Relevant Topic:** AH/ESP
**Difficulty:** Easy
**Keywords:** AH, ESP, integrity, encryption

## Q003
**Question:** What is tunnel mode?
**Answer:** Tunnel mode encapsulates/protects an entire inner IP packet and adds an outer IP header, making it common for gateway-to-gateway VPNs.
**Relevant Topic:** Tunnel/Transport
**Difficulty:** Easy
**Keywords:** tunnel mode, VPN

## Q004
**Question:** What is transport mode?
**Answer:** Transport mode protects the payload of an IP packet while retaining the original IP header, making it common for host-to-host use.
**Relevant Topic:** Tunnel/Transport
**Difficulty:** Easy
**Keywords:** transport mode

## Q005
**Question:** What is IKE?
**Answer:** IKE is the key-management protocol used to authenticate peers and negotiate/maintain IPsec security associations.
**Relevant Topic:** IKE
**Difficulty:** Easy
**Keywords:** IKE, key exchange

## Q006
**Question:** What is IKEv2?
**Answer:** IKEv2 is the current Internet Standard version of IKE, specified by RFC 7296 and updated by later RFCs.
**Relevant Topic:** IKEv2
**Difficulty:** Easy
**Keywords:** IKEv2, RFC 7296

## Q007
**Question:** What is a Security Association?
**Answer:** An IPsec SA is a unidirectional set of parameters such as SPI, algorithms, keys, sequence state, and lifetime used to protect traffic.
**Relevant Topic:** SA
**Difficulty:** Easy
**Keywords:** SA, SPI

## Q008
**Question:** What is the difference between SPD and SAD?
**Answer:** The SPD contains traffic-policy decisions; the SAD contains active security-association state and cryptographic processing parameters.
**Relevant Topic:** SPD/SAD
**Difficulty:** Easy
**Keywords:** SPD, SAD

## Q009
**Question:** What ports does IKE use?
**Answer:** IKE normally uses UDP 500. With NAT traversal, IKE and UDP-encapsulated ESP use UDP 4500.
**Relevant Topic:** Protocols/NAT-T
**Difficulty:** Easy
**Keywords:** UDP 500, UDP 4500

## Q010
**Question:** What is ESP?
**Answer:** ESP is IP protocol 50 and provides the main IPsec traffic protection, including confidentiality and integrity/authentication depending on the negotiated suite.
**Relevant Topic:** ESP
**Difficulty:** Easy
**Keywords:** ESP, protocol 50

## Q011
**Question:** What is NAT-T?
**Answer:** NAT-T encapsulates ESP in UDP so IPsec can traverse NAT devices that do not handle native ESP well.
**Relevant Topic:** NAT-T
**Difficulty:** Easy
**Keywords:** NAT-T, UDP 4500

## Q012
**Question:** How does a site-to-site IPsec VPN work?
**Answer:** Two gateways authenticate and negotiate IKE/IPsec SAs, then encrypt matching traffic between protected networks across an untrusted path.
**Relevant Topic:** Site-to-site
**Difficulty:** Easy
**Keywords:** site-to-site, gateway

## Q013
**Question:** How do I configure an IPsec tunnel?
**Answer:** Define underlay reachability, IKE authentication/proposal, ESP proposal, traffic selectors, routing, firewall/NAT behavior, then verify IKE and IPsec state. Exact commands are vendor-specific.
**Relevant Topic:** Configuration
**Difficulty:** Medium
**Keywords:** IPsec configuration

## Q014
**Question:** Why is my IPsec tunnel not establishing?
**Answer:** First separate reachability, IKE, authentication, CHILD_SA, and data-plane problems. Check UDP 500/4500, proposals, identities, credentials, and logs.
**Relevant Topic:** Troubleshooting
**Difficulty:** Medium
**Keywords:** tunnel failure

## Q015
**Question:** Why does IKE negotiation fail?
**Answer:** Common causes include unreachable peer, blocked UDP 500/4500, proposal mismatch, DH mismatch, identity mismatch, or authentication failure.
**Relevant Topic:** Troubleshooting
**Difficulty:** Medium
**Keywords:** IKE failure

## Q016
**Question:** Why is Phase 1 failing?
**Answer:** In IKEv1 terminology, Phase 1 failure usually points to peer reachability, IKE policy, DH, authentication, or lifetime mismatch.
**Relevant Topic:** IKEv1
**Difficulty:** Medium
**Keywords:** Phase 1

## Q017
**Question:** Why is Phase 2 failing?
**Answer:** In IKEv1 terminology, Phase 2 commonly fails because of transform-set mismatch, PFS mismatch, or traffic-selector/crypto-ACL mismatch.
**Relevant Topic:** IKEv1
**Difficulty:** Medium
**Keywords:** Phase 2

## Q018
**Question:** What causes IPsec authentication failure?
**Answer:** Wrong PSK, wrong identity, certificate validation failure, expired certificate, missing trust chain, or unsupported authentication method can cause failure.
**Relevant Topic:** Authentication
**Difficulty:** Medium
**Keywords:** PSK, certificates

## Q019
**Question:** What causes an IPsec proposal mismatch?
**Answer:** The peers have no common cryptographic combination. Compare IKE and ESP/CHILD_SA proposals separately.
**Relevant Topic:** Algorithms
**Difficulty:** Medium
**Keywords:** proposal mismatch

## Q020
**Question:** What is Perfect Forward Secrecy?
**Answer:** PFS uses fresh key exchange material for CHILD_SA key establishment/rekeying so compromise of long-term authentication material does not automatically expose past session keys.
**Relevant Topic:** PFS
**Difficulty:** Medium
**Keywords:** PFS, DH

## Q021
**Question:** Which encryption algorithms should be avoided?
**Answer:** DES and 3DES should not be selected for new deployments; legacy algorithms should be retained only for documented interoperability needs and risk acceptance.
**Relevant Topic:** Best practices
**Difficulty:** Easy
**Keywords:** DES, 3DES

## Q022
**Question:** How do I troubleshoot an IPsec VPN?
**Answer:** Check underlay, IKE, authentication, CHILD_SA, selectors, routing, NAT/firewall, and application behavior in that order.
**Relevant Topic:** Troubleshooting
**Difficulty:** Medium
**Keywords:** troubleshooting

## Q023
**Question:** What firewall rules are required for IPsec?
**Answer:** Allow UDP 500 for IKE and UDP 4500 when NAT-T is used. Native ESP is IP protocol 50; AH is protocol 51 if AH is actually deployed.
**Relevant Topic:** Firewall
**Difficulty:** Medium
**Keywords:** firewall, ESP 50

## Q024
**Question:** What is the difference between IKE and IPsec?
**Answer:** IKE is the control/key-management protocol; IPsec traffic protection is normally provided by ESP or AH according to negotiated SAs.
**Relevant Topic:** IKE/IPsec
**Difficulty:** Easy
**Keywords:** IKE, IPsec

## Q025
**Question:** What is the difference between ESP encryption and authentication?
**Answer:** Encryption provides confidentiality. Integrity/authentication detects modification and authenticates protected data origin. AEAD modes can combine both.
**Relevant Topic:** ESP
**Difficulty:** Medium
**Keywords:** encryption, integrity

## Q026
**Question:** How does Diffie-Hellman work in IPsec?
**Answer:** Peers exchange DH public values and independently derive shared secret material; IKE uses this to derive keying material without sending the resulting secret directly.
**Relevant Topic:** DH/PFS
**Difficulty:** Medium
**Keywords:** DH, key exchange

## Q027
**Question:** The IKE tunnel is not establishing between two gateways. Both gateways have different Diffie-Hellman groups. What is the likely problem?
**Answer:** The IKE proposals do not share a compatible DH group. Configure at least one common supported group on both peers and verify the target platform's group naming.
**Relevant Topic:** IKEv2/DH
**Difficulty:** Medium
**Keywords:** DH mismatch

## Q028
**Question:** IKE establishes but the CHILD_SA fails because one side proposes AES-GCM and the other only AES-CBC plus HMAC. What is wrong?
**Answer:** There is no common ESP proposal. Align the ESP/CHILD_SA suites or add a compatible proposal on both sides, following current security guidance.
**Relevant Topic:** ESP
**Difficulty:** Medium
**Keywords:** GCM, CBC, proposal

## Q029
**Question:** A firewall allows UDP 500 but blocks UDP 4500. The client is behind NAT. What symptom is likely?
**Answer:** IKE may begin, but NAT-T traffic can fail after NAT detection because UDP 4500 is unavailable.
**Relevant Topic:** NAT-T
**Difficulty:** Medium
**Keywords:** UDP 4500

## Q030
**Question:** A device administrator creates a TCP port 50 rule for ESP. Is that correct?
**Answer:** No. ESP is IP protocol 50, not TCP port 50.
**Relevant Topic:** Protocols
**Difficulty:** Easy
**Keywords:** ESP protocol 50

## Q031
**Question:** A device administrator creates UDP port 51 for AH. Is that correct?
**Answer:** No. AH is IP protocol 51, not UDP port 51.
**Relevant Topic:** Protocols
**Difficulty:** Easy
**Keywords:** AH protocol 51

## Q032
**Question:** The tunnel is established but counters stay at zero. What should be checked?
**Answer:** Check routes, traffic selectors/crypto ACLs, SPD policy installation, and whether test traffic actually matches the protected networks.
**Relevant Topic:** Troubleshooting
**Difficulty:** Medium
**Keywords:** counters, selectors

## Q033
**Question:** The tunnel is up but hosts cannot communicate because local traffic is NATed to the Internet address. What is the likely issue?
**Answer:** VPN traffic is being translated instead of matching the intended protected selectors. Check NAT exemption/order and platform-specific policy processing.
**Relevant Topic:** NAT/Configuration
**Difficulty:** Medium
**Keywords:** NAT exemption

## Q034
**Question:** A certificate-based IKEv2 tunnel fails after certificate renewal. What should be checked?
**Answer:** Check certificate validity, subject/SAN identity matching, trust chain, private-key association, and peer trust configuration.
**Relevant Topic:** Authentication
**Difficulty:** Medium
**Keywords:** certificate, PKI

## Q035
**Question:** An administrator uses the same PSK for every VPN peer. Why is this risky?
**Answer:** Compromise of one peer's shared secret can affect trust across multiple peers. Unique high-entropy PSKs reduce blast radius.
**Relevant Topic:** Authentication
**Difficulty:** Medium
**Keywords:** PSK

## Q036
**Question:** A site-to-site VPN uses 0.0.0.0/0 selectors unintentionally. What is the risk?
**Answer:** The policy may capture far more traffic than intended. Use narrow selectors unless a deliberate full-tunnel design requires broad selectors.
**Relevant Topic:** SPD
**Difficulty:** Medium
**Keywords:** selectors, least privilege

## Q037
**Question:** Why is AH problematic with NAT?
**Answer:** AH authenticates IP header information that NAT may modify, so NAT can invalidate AH integrity checks.
**Relevant Topic:** AH/NAT-T
**Difficulty:** Medium
**Keywords:** AH, NAT

## Q038
**Question:** What is an SPI?
**Answer:** A Security Parameters Index identifies an IPsec SA in received IPsec processing and is carried in ESP/AH headers.
**Relevant Topic:** SA
**Difficulty:** Easy
**Keywords:** SPI

## Q039
**Question:** Is an IPsec SA bidirectional?
**Answer:** No. An IPsec SA is unidirectional; normal two-way communication uses separate inbound/outbound SA state.
**Relevant Topic:** SA
**Difficulty:** Easy
**Keywords:** SA direction

## Q040
**Question:** Does ESP always encrypt?
**Answer:** ESP supports confidentiality but can also be configured for integrity without confidentiality. Confidentiality without integrity is not recommended.
**Relevant Topic:** ESP
**Difficulty:** Easy
**Keywords:** ESP encryption

## Q041
**Question:** What does IKE_SA_INIT do in IKEv2?
**Answer:** It negotiates initial IKE cryptographic parameters and performs a key exchange, plus other initial capabilities/notifications.
**Relevant Topic:** IKEv2
**Difficulty:** Medium
**Keywords:** IKE_SA_INIT

## Q042
**Question:** What does IKE_AUTH do?
**Answer:** It authenticates the peers and establishes the first CHILD_SA, including traffic selectors and related authorization information.
**Relevant Topic:** IKEv2
**Difficulty:** Medium
**Keywords:** IKE_AUTH

## Q043
**Question:** What is a CHILD_SA?
**Answer:** A CHILD_SA is an IKEv2 term for an IPsec SA pair protecting traffic under an IKE SA.
**Relevant Topic:** IKEv2/SA
**Difficulty:** Medium
**Keywords:** CHILD_SA

## Q044
**Question:** Why should IKEv2 usually be preferred for new deployments?
**Answer:** It is the modern standardized IKE protocol and has a cleaner exchange model and richer standardized features. Legacy interoperability may still require IKEv1.
**Relevant Topic:** IKEv2
**Difficulty:** Easy
**Keywords:** IKEv2

## Q045
**Question:** What is PFS in a CHILD_SA?
**Answer:** It is the use of an additional fresh DH exchange when creating/rekeying the CHILD_SA, when configured and supported.
**Relevant Topic:** PFS
**Difficulty:** Medium
**Keywords:** CHILD_SA PFS

## Q046
**Question:** What is the role of a traffic selector?
**Answer:** It defines which source/destination traffic, and sometimes protocol/port combinations, are associated with a CHILD_SA/IPsec policy.
**Relevant Topic:** SPD
**Difficulty:** Easy
**Keywords:** traffic selector

## Q047
**Question:** Why can a route be correct but the VPN still not pass traffic?
**Answer:** The traffic may not match the IPsec policy/selector, or firewall/NAT processing may prevent protected forwarding.
**Relevant Topic:** Troubleshooting
**Difficulty:** Medium
**Keywords:** routing, selector

## Q048
**Question:** What is the difference between IKE proposal and ESP proposal?
**Answer:** IKE proposal protects IKE control exchanges; ESP/CHILD_SA proposal defines protection for user traffic.
**Relevant Topic:** Algorithms
**Difficulty:** Easy
**Keywords:** IKE proposal, ESP

## Q049
**Question:** What is an AEAD algorithm?
**Answer:** Authenticated Encryption with Associated Data combines confidentiality and integrity/authentication in one cryptographic construction, such as AES-GCM.
**Relevant Topic:** Algorithms
**Difficulty:** Medium
**Keywords:** AEAD, AES-GCM

## Q050
**Question:** Should AES-256-GCM have a separate HMAC?
**Answer:** No separate HMAC is normally required because GCM is an AEAD mode that provides authentication/integrity along with encryption.
**Relevant Topic:** Algorithms
**Difficulty:** Medium
**Keywords:** GCM, HMAC

## Q051
**Question:** Why is 3DES considered legacy?
**Answer:** It has a much smaller effective security margin and poor performance compared with modern alternatives, so it should not be selected for new deployments.
**Relevant Topic:** Best practices
**Difficulty:** Easy
**Keywords:** 3DES

## Q052
**Question:** Why should SHA-1 generally be avoided for new designs?
**Answer:** SHA-1 has known collision weaknesses and is legacy for new security designs. Exact interoperability exceptions should be documented and reviewed.
**Relevant Topic:** Algorithms
**Difficulty:** Easy
**Keywords:** SHA-1

## Q053
**Question:** What is a crypto map on Cisco IOS?
**Answer:** It is a vendor-specific policy construct that can associate a peer, transform set, and traffic ACL with an interface.
**Relevant Topic:** Cisco
**Difficulty:** Medium
**Keywords:** crypto map

## Q054
**Question:** What is a Cisco crypto ACL?
**Answer:** In classic policy-based IOS IPsec, an extended ACL can identify the traffic to be protected by a crypto map.
**Relevant Topic:** Cisco
**Difficulty:** Medium
**Keywords:** crypto ACL

## Q055
**Question:** What is VTI?
**Answer:** A Virtual Tunnel Interface is a route-based VPN interface model used by some platforms, including Cisco IOS XE, instead of relying only on crypto-map policy.
**Relevant Topic:** Cisco
**Difficulty:** Medium
**Keywords:** VTI

## Q056
**Question:** What is strongSwan?
**Answer:** strongSwan is an open-source IPsec implementation for Linux and other systems, commonly configured through swanctl or legacy ipsec.conf.
**Relevant Topic:** strongSwan
**Difficulty:** Easy
**Keywords:** strongSwan

## Q057
**Question:** What is swanctl.conf?
**Answer:** It is a strongSwan configuration format used by swanctl to define connections, secrets, and related IPsec/IKE settings.
**Relevant Topic:** strongSwan
**Difficulty:** Medium
**Keywords:** swanctl

## Q058
**Question:** What is ipsec.conf in strongSwan?
**Answer:** It is a legacy-style strongSwan configuration format supported by the starter/stroke architecture on applicable installations.
**Relevant Topic:** strongSwan
**Difficulty:** Medium
**Keywords:** ipsec.conf

## Q059
**Question:** What should be checked before changing crypto settings?
**Answer:** Capture the current configuration, identify the exact failure stage, and compare both peers so changes are targeted rather than random.
**Relevant Topic:** Troubleshooting
**Difficulty:** Medium
**Keywords:** change control

## Q060
**Question:** Why should configuration examples avoid real secrets?
**Answer:** A knowledge base can be retrieved and exposed by systems that do not have production security context. Fictional placeholders prevent accidental credential disclosure.
**Relevant Topic:** RAG Safety
**Difficulty:** Easy
**Keywords:** secrets, RAG

## Q061
**Question:** What is NAT exemption?
**Answer:** It is a policy arrangement that prevents selected VPN traffic from being translated when the VPN design requires original inner addresses.
**Relevant Topic:** NAT
**Difficulty:** Medium
**Keywords:** NAT exemption

## Q062
**Question:** Can IPsec protect IPv6?
**Answer:** Yes. IPsec standards apply to IP and include IPv6 considerations; exact deployment behavior depends on implementation.
**Relevant Topic:** Fundamentals
**Difficulty:** Easy
**Keywords:** IPv6

## Q063
**Question:** Does IPsec replace a firewall?
**Answer:** No. IPsec provides cryptographic protection and policy mechanisms, while firewalls enforce broader access-control policy.
**Relevant Topic:** Architecture
**Difficulty:** Easy
**Keywords:** firewall

## Q064
**Question:** What is anti-replay protection?
**Answer:** It uses sequence numbers and a receive window to detect and reject replayed protected packets.
**Relevant Topic:** ESP
**Difficulty:** Medium
**Keywords:** anti-replay

## Q065
**Question:** What is a security policy action of BYPASS?
**Answer:** It means matching traffic is permitted to pass without IPsec protection, subject to the policy model.
**Relevant Topic:** SPD
**Difficulty:** Medium
**Keywords:** BYPASS

## Q066
**Question:** What is DISCARD in an IPsec policy?
**Answer:** It means matching traffic is rejected rather than bypassed or protected.
**Relevant Topic:** SPD
**Difficulty:** Easy
**Keywords:** DISCARD

## Q067
**Question:** What does PROTECT mean in the SPD?
**Answer:** It means matching traffic must receive IPsec protection using an appropriate SA.
**Relevant Topic:** SPD
**Difficulty:** Easy
**Keywords:** PROTECT

## Q068
**Question:** Why can overlapping selectors be dangerous?
**Answer:** The wrong policy may match first or create ambiguous behavior, depending on implementation. Keep selectors explicit and test effective policy.
**Relevant Topic:** SPD
**Difficulty:** Medium
**Keywords:** overlap

## Q069
**Question:** What is an IKE identity?
**Answer:** It is the identifier used in IKE authentication/authorization, which may differ from the peer's outer IP address.
**Relevant Topic:** Authentication
**Difficulty:** Medium
**Keywords:** IKE identity

## Q070
**Question:** Why can a peer IP be correct but authentication still fail?
**Answer:** The peer's cryptographic identity is separately validated; an IP address alone does not prove identity.
**Relevant Topic:** Authentication
**Difficulty:** Medium
**Keywords:** identity

## Q071
**Question:** What is certificate-based authentication?
**Answer:** Peers use certificates and digital signatures backed by a trust relationship to authenticate IKE identities.
**Relevant Topic:** Authentication
**Difficulty:** Easy
**Keywords:** certificates, PKI

## Q072
**Question:** What is a PSK?
**Answer:** A pre-shared key is secret key material configured on both peers and used for authentication in supported IKE modes.
**Relevant Topic:** Authentication
**Difficulty:** Easy
**Keywords:** PSK

## Q073
**Question:** What is DPD/liveness detection?
**Answer:** Dead Peer Detection or liveness mechanisms help detect an unresponsive peer and clean up or re-establish state, with exact behavior varying by implementation.
**Relevant Topic:** IKE
**Difficulty:** Medium
**Keywords:** DPD

## Q074
**Question:** Why might a tunnel repeatedly rekey?
**Answer:** Possible causes include lifetime mismatch, failed rekey negotiation, peer restart, liveness behavior, or resource/network problems.
**Relevant Topic:** Troubleshooting
**Difficulty:** Medium
**Keywords:** rekey

## Q075
**Question:** What is an IKE lifetime?
**Answer:** It is a policy/implementation setting controlling how long IKE security state is used before rekeying or replacement.
**Relevant Topic:** IKE
**Difficulty:** Medium
**Keywords:** lifetime

## Q076
**Question:** What is an IPsec/CHILD_SA lifetime?
**Answer:** It controls when protected-traffic keys/SAs are rekeyed or replaced, according to implementation policy.
**Relevant Topic:** SA
**Difficulty:** Medium
**Keywords:** lifetime

## Q077
**Question:** Why might MTU matter for IPsec?
**Answer:** Encapsulation adds overhead, reducing effective payload size and potentially causing fragmentation or PMTU problems.
**Relevant Topic:** Troubleshooting
**Difficulty:** Medium
**Keywords:** MTU

## Q078
**Question:** Why can ping work while an application fails?
**Answer:** The application may use ports/protocols excluded by selectors/firewall policy, or encounter MTU, routing, DNS, or service-layer restrictions.
**Relevant Topic:** Troubleshooting
**Difficulty:** Medium
**Keywords:** application

## Q079
**Question:** Why is packet capture useful for IPsec troubleshooting?
**Answer:** It reveals whether IKE packets reach the peer, whether NAT-T is active, and whether encrypted traffic is flowing, without requiring plaintext visibility on the wire.
**Relevant Topic:** Troubleshooting
**Difficulty:** Medium
**Keywords:** packet capture

## Q080
**Question:** Should I expose IKE to every Internet address?
**Answer:** A gateway must receive IKE from intended peers, but firewall policy can often restrict sources where deployment topology permits. Do not block legitimate roaming clients unintentionally.
**Relevant Topic:** Firewall
**Difficulty:** Medium
**Keywords:** IKE firewall

## Q081
**Question:** Can ESP be inspected like HTTP?
**Answer:** Not on the wire without decryption/context; ESP payload is protected. Network devices can still inspect metadata such as outer addresses and protocol/UDP encapsulation.
**Relevant Topic:** ESP
**Difficulty:** Medium
**Keywords:** inspection

## Q082
**Question:** What happens if protocol 50 is blocked but NAT-T is available?
**Answer:** If NAT-T is negotiated and UDP 4500 is permitted, ESP may be carried inside UDP 4500 instead of native protocol 50.
**Relevant Topic:** NAT-T
**Difficulty:** Medium
**Keywords:** protocol 50

## Q083
**Question:** What happens if both peers are behind NAT?
**Answer:** NAT-T can support the scenario, but peer discovery/addressing and NAT behavior must be compatible with the deployment.
**Relevant Topic:** NAT-T
**Difficulty:** Medium
**Keywords:** double NAT

## Q084
**Question:** Why is AH rarely used for normal VPNs?
**Answer:** ESP can provide the required confidentiality and integrity services and is more compatible with NAT traversal.
**Relevant Topic:** AH
**Difficulty:** Easy
**Keywords:** AH

## Q085
**Question:** What is the outer IP header in tunnel mode?
**Answer:** It identifies the IPsec tunnel endpoints, typically the VPN gateways, while the original packet is protected inside.
**Relevant Topic:** Tunnel Mode
**Difficulty:** Easy
**Keywords:** outer header

## Q086
**Question:** What is the inner IP packet in tunnel mode?
**Answer:** It is the original packet between protected hosts/subnets, encapsulated and protected by ESP.
**Relevant Topic:** Tunnel Mode
**Difficulty:** Easy
**Keywords:** inner packet

## Q087
**Question:** What is split tunneling?
**Answer:** In remote access, only selected traffic is routed through the VPN while other traffic uses the normal network path.
**Relevant Topic:** Remote Access
**Difficulty:** Easy
**Keywords:** split tunnel

## Q088
**Question:** What is full tunneling?
**Answer:** In remote access, broad traffic, often including Internet traffic, is routed through the VPN gateway according to policy.
**Relevant Topic:** Remote Access
**Difficulty:** Easy
**Keywords:** full tunnel

## Q089
**Question:** Why is least privilege important for VPN selectors?
**Answer:** A compromised endpoint or credential should have access only to the resources required for its role.
**Relevant Topic:** Best Practices
**Difficulty:** Easy
**Keywords:** least privilege

## Q090
**Question:** What should a secure IPsec knowledge base do when uncertain?
**Answer:** It should explicitly state uncertainty or vendor-specific scope rather than invent a parameter or command.
**Relevant Topic:** RAG Safety
**Difficulty:** Easy
**Keywords:** uncertainty

## Q091
**Question:** Why should vendor syntax be labeled?
**Answer:** Cisco IOS, strongSwan, Windows, firewalls, and other platforms expose different configuration models and command names.
**Relevant Topic:** RAG Safety
**Difficulty:** Easy
**Keywords:** vendor-specific

## Q092
**Question:** What RFC defines the IPsec architecture?
**Answer:** RFC 4301 defines the Security Architecture for the Internet Protocol.
**Relevant Topic:** Standards
**Difficulty:** Easy
**Keywords:** RFC 4301

## Q093
**Question:** What RFC defines ESP?
**Answer:** RFC 4303 defines the IP Encapsulating Security Payload protocol.
**Relevant Topic:** Standards
**Difficulty:** Easy
**Keywords:** RFC 4303

## Q094
**Question:** What RFC defines AH?
**Answer:** RFC 4302 defines the IP Authentication Header protocol.
**Relevant Topic:** Standards
**Difficulty:** Easy
**Keywords:** RFC 4302

## Q095
**Question:** What RFC defines IKEv2?
**Answer:** RFC 7296 defines IKEv2 and is an Internet Standard, with later updates.
**Relevant Topic:** Standards
**Difficulty:** Easy
**Keywords:** RFC 7296

## Q096
**Question:** What RFC defines NAT-T negotiation?
**Answer:** RFC 3947 defines negotiation of NAT traversal in IKE; RFC 3948 defines UDP encapsulation of ESP packets.
**Relevant Topic:** Standards
**Difficulty:** Easy
**Keywords:** RFC 3947, RFC 3948

## Q097
**Question:** What is the role of RFC 8247?
**Answer:** It gives IKEv2 algorithm implementation requirements and usage guidance and updates RFC 7296.
**Relevant Topic:** Standards
**Difficulty:** Medium
**Keywords:** RFC 8247

## Q098
**Question:** What should be logged during IPsec troubleshooting?
**Answer:** Peer identity, negotiation stage, proposal mismatch indicators, SA establishment/deletion, and counters are useful; secrets and private keys should never be logged.
**Relevant Topic:** Operations
**Difficulty:** Medium
**Keywords:** logging

## Q099
**Question:** How should a failed PSK be investigated safely?
**Answer:** Verify that the correct secret is associated with the intended peer and identity without printing or copying the secret into logs or tickets.
**Relevant Topic:** Authentication
**Difficulty:** Medium
**Keywords:** PSK troubleshooting

## Q100
**Question:** A Cisco crypto map is configured but not applied to an interface. What is likely?
**Answer:** The policy may never be applied to traffic on that interface. Verify interface attachment and platform-specific routing/policy behavior.
**Relevant Topic:** Cisco
**Difficulty:** Medium
**Keywords:** crypto map

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
