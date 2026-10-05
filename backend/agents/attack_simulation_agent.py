import datetime
from .configuration_agent import IPsecConfigurationAgent


class AttackSimulationAgent:
    def __init__(self):
        self.agent_name = "attack_simulation_agent"
        self.config_agent = IPsecConfigurationAgent()

    def simulate(self, current_configuration, scenario_name=None, modifications=None):
        timestamp = datetime.datetime.utcnow().isoformat() + "Z"

        baseline_config = dict(current_configuration or {})
        baseline_eval = self.config_agent.analyze(baseline_config)
        baseline_score = baseline_eval.get("score", 100)

        # Default simulation scenarios if none provided
        if not modifications:
            if scenario_name == "disable_pfs":
                modifications = {"pfs": "Disabled"}
                scenario_name = "Disable Perfect Forward Secrecy (PFS)"
            elif scenario_name == "downgrade_cipher":
                modifications = {"encryption": "3DES"}
                scenario_name = "Downgrade Encryption to 3DES"
            elif scenario_name == "disable_replay":
                modifications = {"replay_protection": "Disabled"}
                scenario_name = "Disable Anti-Replay Protection"
            elif scenario_name == "downgrade_ike":
                modifications = {"ike_version": "IKEv1"}
                scenario_name = "Downgrade Key Management to IKEv1"
            else:
                # Default what-if test scenario
                modifications = {"pfs": "Disabled"}
                scenario_name = "Disable Perfect Forward Secrecy (PFS)"

        simulated_config = dict(baseline_config)
        simulated_config.update(modifications)

        simulated_eval = self.config_agent.analyze(simulated_config)
        simulated_score = simulated_eval.get("score", 100)

        score_delta = baseline_score - simulated_score
        affected_controls = list(modifications.keys())

        # Generate technical explanation
        explanations = []
        for key, val in modifications.items():
            if key == "pfs" and str(val).lower() in ["disabled", "false"]:
                explanations.append(
                    "Disabling PFS removes Diffie-Hellman rekeying for Child SAs. If an adversary compromises the static private key or long-term secret, they can decrypt all historically recorded sessions."
                )
            elif key == "encryption" and val in ["3DES", "DES"]:
                explanations.append(
                    f"Downgrading encryption to {val} introduces Sweet32 64-bit block collision vulnerabilities and reduces effective key strength below NIST minimums."
                )
            elif key == "replay_protection" and str(val).lower() in ["disabled", "false"]:
                explanations.append(
                    "Disabling anti-replay protection allows attackers to capture legitimate encrypted packets and re-inject them into the network to cause duplicate processing or state exhaustion."
                )
            elif key == "ike_version" and val in ["IKEv1", "v1"]:
                explanations.append(
                    "Downgrading to IKEv1 exposes the handshake to aggressive mode pre-shared key hash capture and offline dictionary cracking."
                )
            else:
                explanations.append(f"Changing {key} to {val} weakens the baseline security posture.")

        impact_desc = f"Security score reduced by {score_delta} points (from {baseline_score} to {simulated_score})."

        return {
            "agent": self.agent_name,
            "status": "COMPLETED",
            "timestamp": timestamp,
            "scenario": scenario_name,
            "baseline_score": baseline_score,
            "simulated_score": simulated_score,
            "score_delta": score_delta,
            "affected_controls": affected_controls,
            "modifications": modifications,
            "impact": impact_desc,
            "explanation": " ".join(explanations),
            "findings": [f"What-if simulation '{scenario_name}' resulted in a score drop of {score_delta} points."],
            "recommendations": [f"Maintain baseline setting for {ctrl} to prevent security score degradation." for ctrl in affected_controls]
        }
