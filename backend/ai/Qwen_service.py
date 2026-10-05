import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from ipsec_security_assessment import generate_qwen_response, build_user_prompt


class QwenService:
    @staticmethod
    def generate_response(traffic, ml_result, configuration_text, question, evidence_text):
        """
        Wrapper service for Qwen3-14B evidence-grounded inference.
        """
        user_prompt = build_user_prompt(
            traffic=traffic,
            ml_result=ml_result,
            configuration_text=configuration_text,
            question=question,
            evidence_text=evidence_text
        )
        return generate_qwen_response(
            user_prompt=user_prompt,
            evidence_text=evidence_text,
            configuration_text=configuration_text
        )
