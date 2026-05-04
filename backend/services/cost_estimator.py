import json
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data"

with open(DATA_DIR / "cost_config.json") as f:
    COST_CONFIG = json.load(f)


def calculate_cost(
    procedure_data: dict,
    city: str | None,
    comorbidities: list,
    age: int | None,
    hospital_tier: str = "premium"
) -> dict:
    """Calculate detailed cost breakdown with adjustments."""

    base_cost = procedure_data["base_cost_inr"]

    city_key = (city or "").lower().strip()
    city_mult = COST_CONFIG["city_multipliers"].get(
        city_key,
        COST_CONFIG["city_multipliers"]["default"]
    )

    comorbidity_adj = 0.0
    comorbidities_lower = [c.lower() for c in comorbidities]

    combo_keys = COST_CONFIG["combo_adjustments"]
    for combo_key, adj in combo_keys.items():
        parts = combo_key.split("+")
        if all(p in comorbidities_lower for p in parts):
            comorbidity_adj = max(comorbidity_adj, adj)

    if comorbidity_adj == 0:
        for c in comorbidities_lower:
            comorbidity_adj += COST_CONFIG["comorbidity_adjustments"].get(c, 0)

    age_adj = 0.0
    if age:
        if age > 70:
            age_adj = COST_CONFIG["age_adjustment"]["above_70"]
        elif age > 60:
            age_adj = COST_CONFIG["age_adjustment"]["above_60"]

    tier_mult = COST_CONFIG["tier_multipliers"].get(hospital_tier, 1.0)
    total_multiplier = city_mult * tier_mult * (1 + comorbidity_adj + age_adj)

    adjusted_base = base_cost * total_multiplier
    cost_range_factor = procedure_data["cost_range_factor"]

    min_cost = adjusted_base * cost_range_factor
    max_cost = adjusted_base / cost_range_factor

    components = COST_CONFIG["cost_components"]
    breakdown = {}
    for key, comp in components.items():
        breakdown[key] = {
            "label": comp["label"],
            "min_inr": int(min_cost * comp["min_pct"]),
            "max_inr": int(max_cost * comp["max_pct"])
        }

    adjustments = []
    for c in comorbidities_lower:
        adj_pct = COST_CONFIG["comorbidity_adjustments"].get(c, 0)
        if adj_pct > 0:
            adjustments.append({
                "factor": c.replace("_", " ").title(),
                "adjustment": f"+{int(adj_pct * 100)}%"
            })
    if age_adj > 0:
        adjustments.append({
            "factor": f"Age {age}+",
            "adjustment": f"+{int(age_adj * 100)}%"
        })

    return {
        "breakdown": breakdown,
        "total_min_inr": int(min_cost),
        "total_max_inr": int(max_cost),
        "city_multiplier": city_mult,
        "comorbidity_adjustment": comorbidity_adj,
        "age_adjustment": age_adj,
        "adjustments_applied": adjustments,
        "hospital_tier": hospital_tier
    }


def format_inr(amount: int) -> str:
    """Format amount in INR with L/K notation."""
    if amount >= 100000:
        return f"₹{amount/100000:.1f}L"
    elif amount >= 1000:
        return f"₹{amount/1000:.0f}K"
    return f"₹{amount}"
