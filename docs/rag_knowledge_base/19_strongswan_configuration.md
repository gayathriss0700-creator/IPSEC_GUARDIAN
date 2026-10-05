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

# 19. strongSwan Linux IPsec Configuration

## Vendor scope
strongSwan is an open-source IPsec implementation. Current deployments commonly use `swanctl.conf`; legacy deployments may use `ipsec.conf`. Syntax is implementation-specific.

## A. swanctl-style IKEv2 example
EXAMPLE CONFIGURATION — fictional lab:
```text
connections {
  lab-vpn {
    version = 2
    remote_addrs = 203.0.113.20
    local_addrs = 203.0.113.10

    local {
      auth = psk
      id = gw-a.example.invalid
    }
    remote {
      auth = psk
      id = gw-b.example.invalid
    }

    children {
      site {
        local_ts = 192.168.10.0/24
        remote_ts = 192.168.20.0/24
        esp_proposals = aes256gcm16
        start_action = trap
      }
    }
  }
}
secrets {
  ike-1 {
    secret = EXAMPLE_ONLY_PSK
  }
}
```

### Line explanations
- `version = 2`: selects IKEv2.
- `remote_addrs` / `local_addrs`: IKE peer endpoint addresses.
- `local` and `remote`: authentication method and identities.
- `children`: defines the IPsec/CHILD_SA.
- `local_ts` / `remote_ts`: traffic selectors.
- `esp_proposals`: ESP/CHILD_SA algorithm proposal; exact proposal names depend on strongSwan version/plugins.
- `start_action = trap`: installs policy so matching traffic can trigger negotiation.
- `secrets`: PSK material; the example is not a real secret.

## B. ipsec.conf conceptual alternative
Legacy `ipsec.conf` configurations can express `conn` blocks with `left`, `right`, authentication, and proposals. Use the version-specific strongSwan documentation before deploying.

## NAT-T
strongSwan generally detects NAT and uses UDP encapsulation when negotiated. Firewall policy must permit UDP 500/4500 as appropriate.

## Troubleshooting
Useful strongSwan tools include `swanctl --list-sas`, `swanctl --list-pols`, and `journalctl`/daemon logs. Exact output varies by version and service manager.

## Common mistakes
Wrong identity, missing CA/PSK, mismatched traffic selectors, unsupported proposal, forgetting routes/firewall.

## Security considerations
Use current proposals, certificate authentication for scalable deployments, protected secret storage, and strict selectors. Check the installed strongSwan version's documentation because options evolve.

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
