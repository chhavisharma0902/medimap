import json
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data"

with open(DATA_DIR / "hospitals.json") as f:
    HOSPITALS = json.load(f)


def score_hospital(
    hospital: dict,
    specialty: str,
    budget_inr: int | None,
    cost_min: int,
    cost_max: int
) -> float:
    """Score a hospital on 4 dimensions (0-100)."""

    # 1. Clinical Capability (30%)
    clinical = 0.0
    if specialty in hospital.get("specialties", []):
        clinical += 50
    if hospital.get("nabh"):
        clinical += 25
    if hospital.get("nabl"):
        clinical += 15
    vol = hospital.get("annual_volume", 0)
    if vol > 3000:
        clinical += 10
    elif vol > 1500:
        clinical += 5
    clinical = min(clinical, 100)

    # 2. Reputation (25%)
    reputation = hospital.get("rating", 3.0) / 5.0 * 100
    years = hospital.get("years_established", 0)
    if years > 20:
        reputation = min(reputation + 10, 100)
    elif years > 10:
        reputation = min(reputation + 5, 100)

    # 3. Accessibility (20%)
    dist = hospital.get("distance_km", 20)
    if dist <= 3:
        accessibility = 100
    elif dist <= 7:
        accessibility = 75
    elif dist <= 15:
        accessibility = 50
    else:
        accessibility = 25

    # 4. Affordability (25%)
    affordability = 50
    if budget_inr:
        if cost_min <= budget_inr:
            affordability = 100 if cost_max <= budget_inr else 75
        else:
            over_pct = (cost_min - budget_inr) / budget_inr
            affordability = max(0, 50 - int(over_pct * 100))

    tier = hospital.get("tier", "mid")
    if tier == "government":
        affordability = min(affordability + 20, 100)

    total = (
        clinical * 0.30 +
        reputation * 0.25 +
        accessibility * 0.20 +
        affordability * 0.25
    )
    return round(total, 2)


def rank_hospitals(
    city: str | None,
    specialty: str,
    budget_inr: int | None,
    cost_min: int,
    cost_max: int,
    top_n: int = 3
) -> list:
    """Filter and rank hospitals by city and specialty, return top N."""

    city_key = (city or "").lower().strip()

    candidates = []
    for h in HOSPITALS:
        h_city = h.get("city", "").lower()
        h_specialties = [s.lower() for s in h.get("specialties", [])]
        city_match = (not city_key) or (h_city == city_key)
        specialty_match = specialty.lower() in h_specialties
        if city_match and specialty_match:
            candidates.append(h)

    if not candidates and city_key:
        candidates = [h for h in HOSPITALS if h.get("city", "").lower() == city_key]

    if not candidates:
        candidates = HOSPITALS[:]

    scored = []
    for h in candidates:
        tier = h.get("tier", "mid")
        tier_cost_mult = {"government": 0.5, "mid": 0.85, "premium": 1.0}.get(tier, 1.0)
        h_cost_min = int(cost_min * tier_cost_mult)
        h_cost_max = int(cost_max * tier_cost_mult)

        score = score_hospital(h, specialty, budget_inr, h_cost_min, h_cost_max)
        scored.append({
            **h,
            "score": score,
            "estimated_cost_min": h_cost_min,
            "estimated_cost_max": h_cost_max
        })

    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored[:top_n]
