import json
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data"

with open(DATA_DIR / "procedures.json") as f:
    PROCEDURES_DATA = json.load(f)["procedures"]


def map_to_icd(symptom_or_procedure: str) -> dict:
    """Map symptom/procedure text to ICD-10 code and clinical procedure."""
    text = symptom_or_procedure.lower().strip()

    best_match = None
    best_score = 0

    for proc in PROCEDURES_DATA:
        score = 0
        for kw in proc["keywords"]:
            if kw in text:
                score += 3
            elif any(part in text for part in kw.split()):
                score += 1
        for kw in proc.get("symptom_keywords", []):
            if kw in text:
                score += 2

        if score > best_score:
            best_score = score
            best_match = proc

    if best_match and best_score >= 1:
        return {
            "icd_code": best_match["icd_code"],
            "condition": best_match["condition"],
            "procedure": best_match["procedure"],
            "procedure_short": best_match["procedure_short"],
            "specialty": best_match["specialty"],
            "hospital_stay_days": best_match["hospital_stay_days"],
            "base_cost_inr": best_match["base_cost_inr"],
            "cost_range_factor": best_match["cost_range_factor"],
            "match_score": best_score
        }

    return {
        "icd_code": "Z00.0",
        "condition": "General Medical Consultation",
        "procedure": "Medical Evaluation & Treatment",
        "procedure_short": "Medical Evaluation",
        "specialty": "general medicine",
        "hospital_stay_days": [1, 3],
        "base_cost_inr": 30000,
        "cost_range_factor": 0.6,
        "match_score": 0
    }
