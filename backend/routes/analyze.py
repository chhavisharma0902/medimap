from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.nlp_parser import parse_query_with_claude
from services.icd_mapper import map_to_icd
from services.cost_estimator import calculate_cost, format_inr
from services.hospital_ranker import rank_hospitals
from services.confidence_scorer import calculate_confidence

router = APIRouter()


class AnalyzeRequest(BaseModel):
    query: str


class AnalyzeResponse(BaseModel):
    icd_code: str
    condition: str
    procedure: str
    procedure_short: str
    specialty: str
    parsed_query: dict
    hospitals: list
    cost_breakdown: dict
    total_range: dict
    adjustments_applied: list
    confidence: dict
    disclaimer: str


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(req: AnalyzeRequest):
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    # Step 1: NLP Parse
    parsed = parse_query_with_claude(req.query)

    # Step 2: ICD Mapping
    icd_data = map_to_icd(parsed.get("symptom_or_procedure", req.query))

    # Step 3: Cost Estimation (premium baseline)
    cost_result = calculate_cost(
        procedure_data=icd_data,
        city=parsed.get("city"),
        comorbidities=parsed.get("comorbidities", []),
        age=parsed.get("age"),
        hospital_tier="premium"
    )

    # Step 4: Hospital Ranking
    hospitals = rank_hospitals(
        city=parsed.get("city"),
        specialty=icd_data["specialty"],
        budget_inr=parsed.get("budget_inr"),
        cost_min=cost_result["total_min_inr"],
        cost_max=cost_result["total_max_inr"],
        top_n=3
    )

    # Step 5: Confidence Score
    confidence = calculate_confidence(
        parsed_query=parsed,
        icd_match_score=icd_data.get("match_score", 0),
        hospital_count=len(hospitals)
    )

    # Format hospitals for response
    formatted_hospitals = []
    for h in hospitals:
        formatted_hospitals.append({
            "id": h["id"],
            "name": h["name"],
            "city": h["city"].title(),
            "address": h["address"],
            "distance_km": h["distance_km"],
            "rating": h["rating"],
            "specialties": h["specialties"],
            "nabh": h["nabh"],
            "nabl": h.get("nabl", False),
            "tags": h["tags"],
            "phone": h["phone"],
            "insurance_accepted": h["insurance_accepted"],
            "tier": h["tier"],
            "score": h["score"],
            "estimated_cost_min": h["estimated_cost_min"],
            "estimated_cost_max": h["estimated_cost_max"],
            "estimated_cost_min_fmt": format_inr(h["estimated_cost_min"]),
            "estimated_cost_max_fmt": format_inr(h["estimated_cost_max"]),
        })

    # Format cost breakdown
    formatted_breakdown = {}
    for key, comp in cost_result["breakdown"].items():
        formatted_breakdown[key] = {
            "label": comp["label"],
            "min_inr": comp["min_inr"],
            "max_inr": comp["max_inr"],
            "min_fmt": format_inr(comp["min_inr"]),
            "max_fmt": format_inr(comp["max_inr"])
        }

    return AnalyzeResponse(
        icd_code=icd_data["icd_code"],
        condition=icd_data["condition"],
        procedure=icd_data["procedure"],
        procedure_short=icd_data["procedure_short"],
        specialty=icd_data["specialty"],
        parsed_query=parsed,
        hospitals=formatted_hospitals,
        cost_breakdown=formatted_breakdown,
        total_range={
            "min_inr": cost_result["total_min_inr"],
            "max_inr": cost_result["total_max_inr"],
            "min_fmt": format_inr(cost_result["total_min_inr"]),
            "max_fmt": format_inr(cost_result["total_max_inr"])
        },
        adjustments_applied=cost_result["adjustments_applied"],
        confidence=confidence,
        disclaimer="⚠️ MediMap provides decision support only — not a diagnosis or treatment recommendation. Consult a qualified physician before any medical procedure. Cost estimates are indicative ranges based on available data."
    )
