import sys
import os
import json

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.agents.orchestrator import AgentOrchestrator

orchestrator = AgentOrchestrator()

# Test Case 1: Recommended Strong Configuration
strong_config = {
    "ike_version": "IKEv2",
    "encryption": "AES-256-GCM",
    "integrity": "SHA-256",
    "authentication": "Certificate",
    "dh_group": "Strong group",
    "pfs": "Enabled",
    "esp_mode": "Tunnel",
    "nat_t": "Enabled",
    "anti_replay": "Enabled",
    "traffic_selectors": "Limited"
}
strong_question = "Why is PFS important in IKEv2?"

# Test Case 2: Weaker Configuration
weak_config = {
    "ike_version": "IKEv1",
    "encryption": "3DES",
    "integrity": "MD5",
    "authentication": "Pre-Shared Key",
    "dh_group": "Group 2",
    "pfs": "Disabled",
    "esp_mode": "Tunnel",
    "nat_t": "Disabled",
    "anti_replay": "Disabled",
    "traffic_selectors": "0.0.0.0/0"
}
weak_question = "What vulnerabilities exist in this configuration?"

traffic_data = {
    "source_port": 50000,
    "destination_port": 443,
    "protocol": 6,
    "duration": 2,
    "packet_count": 50,
    "bytes_sent": 5000,
    "bytes_received": 7000,
    "bytes_per_packet": 150
}

print("=" * 80)
print("TEST CASE 1: RECOMMENDED STRONG CONFIGURATION")
print("=" * 80)
res1 = orchestrator.run_assessment(
    configuration=strong_config,
    traffic=traffic_data,
    question=strong_question,
    run_simulation=True,
    simulation_scenario="disable_pfs"
)

print("\n--- AGENT EXECUTION STATUSES ---")
print(json.dumps(res1["agent_statuses"], indent=2))

print("\n--- ASSESSMENT SUMMARY ---")
print(json.dumps(res1["assessment"], indent=2))

print("\n" + "=" * 80)
print("TEST CASE 2: INTENTIONALLY WEAKER CONFIGURATION")
print("=" * 80)
res2 = orchestrator.run_assessment(
    configuration=weak_config,
    traffic=traffic_data,
    question=weak_question,
    run_simulation=True,
    simulation_scenario="disable_pfs"
)

print("\n--- AGENT EXECUTION STATUSES ---")
print(json.dumps(res2["agent_statuses"], indent=2))

print("\n--- CONFIGURATION AGENT FINDINGS ---")
print(json.dumps(res2["agents"]["configuration"]["findings"], indent=2))

print("\n--- VULNERABILITIES IDENTIFIED ---")
print(json.dumps(res2["agents"]["vulnerability"]["vulnerabilities"], indent=2))

print("\n--- COMPLIANCE STATUS & VIOLATIONS ---")
print(json.dumps(res2["agents"]["compliance"]["violations"], indent=2))

print("\n--- REMEDIATION RECOMMENDATIONS ---")
print(json.dumps(res2["recommendations"], indent=2))
