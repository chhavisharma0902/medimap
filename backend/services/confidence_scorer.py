import json
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data"

with open(DATA_DIR / "cost_config.json") as f:
    COST_CONFIG = json.load(f)

SUPPORTED_CITIES = set(COST_CONFIG["city_multipliers"].keys()) - {"default"}


def calculate_confidence(
    parsed_query: dict,
    icd_match_score: int,
    hospital_count: int
) -> dict:
    """Calculate confidence score (0-1) based on data completeness."""

    # 1. ICD Match Quality (35%)
    if icd_match_score >= 5:
        icd_score = 1.0
    elif icd_match_score >= 3:
        icd_score = 0.75
    elif icd_match_score >= 1:
        icd_score = 0.5
    else:
        icd_score = 0.25

    # 2. City Support (20%)
    city = (parsed_query.get("city") or "").lower()
    if city in SUPPORTED_CITIES:
        city_score = 1.0
    elif city:
        city_score = 0.5
    else:
        city_score = 0.3

    # 3. Hospital Availability (25%)
    if hospital_count >= 3:
        hospital_score = 1.0
    elif hospital_count == 2:
        hospital_score = 0.7
    elif hospital_count == 1:
        hospital_score = 0.4
    else:
        hospital_score = 0.1

    # 4. Query Completeness (20%)
    fields = ["city", "age", "comorbidities", "budget_inr"]
    provided = sum(1 for f in fields if parsed_query.get(f))
    completeness_score = provided / len(fields)

    total = (
        icd_score * 0.35 +
        city_score * 0.20 +
        hospital_score * 0.25 +
        completeness_score * 0.20
    )
    total = round(min(max(total, 0.0), 1.0), 2)

    if total >= 0.80:
        label, color = "High", "green"
    elif total >= 0.55:
        label, color = "Moderate", "yellow"
    else:
        label, color = "Low", "red"

    return {
        "score": total,
        "percentage": int(total * 100),
        "label": label,
        "color": color,
        "factors": {
            "icd_match": round(icd_score, 2),
            "city_support": round(city_score, 2),
            "hospital_availability": round(hospital_score, 2),
            "query_completeness": round(completeness_score, 2)
        }
    }
