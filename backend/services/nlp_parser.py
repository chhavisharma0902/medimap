import os
import json
import re
import anthropic

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY", ""))

SYSTEM_PROMPT = """You are a medical intent parser for MediMap, an AI healthcare navigator for India.
Extract structured information from patient healthcare queries.
ALWAYS respond with ONLY valid JSON. No markdown, no explanation.

Extract:
- symptom_or_procedure: the main medical condition, symptom, or procedure mentioned
- city: Indian city name (lowercase, or null if not mentioned)
- budget_inr: numeric budget in INR (convert 3L to 300000, 1.5L to 150000, null if not mentioned)
- age: patient age as integer (null if not mentioned)
- gender: "male", "female", or null
- comorbidities: array of conditions from: ["diabetes", "hypertension", "heart_disease", "kidney_disease", "obesity", "copd", "liver_disease", "cancer"] (empty array if none)
- urgency: "emergency", "elective", "routine" (default "elective")

Example input: "angioplasty near Nagpur for diabetic patient under 3L"
Example output:
{
  "symptom_or_procedure": "angioplasty",
  "city": "nagpur",
  "budget_inr": 300000,
  "age": null,
  "gender": null,
  "comorbidities": ["diabetes"],
  "urgency": "elective"
}"""


def parse_query_with_claude(query: str) -> dict:
    """Use Claude API to extract structured info from natural language query."""
    try:
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=500,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": query}]
        )
        raw = message.content[0].text.strip()
        raw = re.sub(r"^```(?:json)?\s*", "", raw)
        raw = re.sub(r"\s*```$", "", raw)
        return json.loads(raw)
    except Exception:
        return fallback_parse(query)


def fallback_parse(query: str) -> dict:
    """Rule-based fallback parser."""
    query_lower = query.lower()

    cities = ["mumbai", "delhi", "bangalore", "chennai", "hyderabad", "pune",
              "kolkata", "nagpur", "lucknow", "ahmedabad", "jaipur", "surat",
              "indore", "bhopal", "kanpur"]
    city = next((c for c in cities if c in query_lower), None)

    comorbidities = []
    if any(w in query_lower for w in ["diabet", "sugar", "dm"]):
        comorbidities.append("diabetes")
    if any(w in query_lower for w in ["hypertens", "bp", "blood pressure", "htn"]):
        comorbidities.append("hypertension")
    if any(w in query_lower for w in ["heart disease", "cardiac"]):
        comorbidities.append("heart_disease")

    budget_inr = None
    budget_match = re.search(r"(\d+(?:\.\d+)?)\s*(?:l|lakh|lac)", query_lower)
    if budget_match:
        budget_inr = int(float(budget_match.group(1)) * 100000)
    else:
        k_match = re.search(r"(\d+(?:\.\d+)?)\s*k", query_lower)
        if k_match:
            budget_inr = int(float(k_match.group(1)) * 1000)

    age = None
    age_match = re.search(r"(\d+)\s*(?:year|yr|y\.?o\.?|age)", query_lower)
    if age_match:
        age = int(age_match.group(1))

    gender = None
    if any(w in query_lower for w in ["male", "man", "boy"]):
        gender = "male"
    elif any(w in query_lower for w in ["female", "woman", "girl"]):
        gender = "female"

    return {
        "symptom_or_procedure": query,
        "city": city,
        "budget_inr": budget_inr,
        "age": age,
        "gender": gender,
        "comorbidities": comorbidities,
        "urgency": "emergency" if "emergency" in query_lower else "elective"
    }
