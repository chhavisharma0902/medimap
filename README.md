<div align="center">

# 🏥 MediMap
### AI Healthcare Navigator & Cost Estimator for India

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Claude-Sonnet_4-CC785C?style=for-the-badge&logo=anthropic&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
</p>

<p align="center">
  <b>Describe your medical need in plain language → Get hospital recommendations + cost estimates instantly</b>
</p>

---

</div>

## 🌟 What is MediMap?

MediMap is an AI-powered healthcare navigation tool built for India. It takes a plain-language description of a patient's medical condition and returns:

- 🏨 **Top 3 ranked hospitals** in the specified city with scores, ratings, and cost estimates
- 💰 **Detailed cost breakdown** across procedure, stay, doctor fees, diagnostics, medicines, and contingency
- 🧠 **AI-powered NLP parsing** using Claude to extract city, budget, age, comorbidities, and urgency
- 📋 **ICD-10 code mapping** for the identified condition
- 📊 **Confidence scoring** based on data completeness
- ⚖️ **Smart cost adjustments** for diabetes, hypertension, age, city multipliers, and hospital tier

---

## ✨ Features

| Feature | Description |
|---|---|
| 🗣️ **Natural Language Input** | Type queries like you'd describe to a doctor — no forms, no dropdowns |
| 🤖 **Claude AI NLP** | Extracts city, budget, age, gender, comorbidities automatically |
| 🗺️ **ICD-10 Mapping** | Maps symptoms/procedures to standard medical codes |
| 🏥 **Hospital Ranking** | Scores hospitals on clinical capability, reputation, accessibility & affordability |
| 💸 **Cost Estimation** | Detailed breakdown with city multipliers and comorbidity adjustments |
| 📈 **Confidence Score** | Tells you how reliable the estimate is based on query completeness |
| 🧾 **NABH/NABL Badges** | Shows accreditation status for every hospital |
| 📱 **Responsive UI** | Works on desktop and mobile |
| ⚡ **Loading Skeletons** | Smooth experience while AI processes your query |

---

## 🏗️ Architecture

```
User Query (Natural Language)
        │
        ▼
┌─────────────────┐
│  React Frontend  │  ←─── Dark UI, CSS Variables
└────────┬────────┘
         │ POST /api/analyze
         ▼
┌─────────────────────────────────────────┐
│              FastAPI Backend             │
│                                         │
│  1. NLP Parser  ──→  Claude Sonnet API  │
│  2. ICD Mapper  ──→  procedures.json    │
│  3. Cost Engine ──→  cost_config.json   │
│  4. Hospital Ranker → hospitals.json    │
│  5. Confidence Scorer                   │
└─────────────────────────────────────────┘
         │
         ▼
  Structured JSON Response
  (ICD code, hospitals, cost breakdown, confidence)
```

---

## 🗂️ Project Structure

```
medimap/
├── 📁 backend/
│   ├── main.py                    # FastAPI app entry point
│   ├── requirements.txt           # Python dependencies
│   ├── 📁 routes/
│   │   └── analyze.py             # POST /api/analyze endpoint
│   ├── 📁 services/
│   │   ├── nlp_parser.py          # Claude API — query parsing
│   │   ├── icd_mapper.py          # ICD-10 code mapping
│   │   ├── cost_estimator.py      # Cost calculation engine
│   │   ├── hospital_ranker.py     # Hospital scoring & ranking
│   │   └── confidence_scorer.py   # Confidence score calculation
│   └── 📁 data/
│       ├── hospitals.json         # Hospital database (12 hospitals, 5 cities)
│       ├── procedures.json        # 12 medical procedures with ICD-10 codes
│       └── cost_config.json       # City multipliers, comorbidity adjustments
│
├── 📁 frontend/
│   ├── package.json
│   ├── 📁 public/
│   │   └── index.html
│   └── 📁 src/
│       ├── App.js                 # Main layout & state
│       ├── index.js
│       ├── index.css              # Design tokens & global styles
│       ├── 📁 utils/
│       │   └── api.js             # API call to backend
│       └── 📁 components/
│           ├── Header.js          # Sticky nav
│           ├── SearchBox.js       # Query input with examples
│           ├── HospitalCard.js    # Hospital result card
│           ├── CostBreakdown.js   # Cost table with adjustments
│           ├── ConfidenceBar.js   # Confidence score widget
│           ├── ParsedQueryInfo.js # ICD + extracted params
│           ├── LoadingSkeleton.js # Shimmer loading state
│           └── Disclaimer.js      # Medical disclaimer banner
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Python 3.11+](https://www.python.org/downloads/)
- [Node.js 18+](https://nodejs.org/)
- [Git](https://git-scm.com/)
- An [Anthropic API Key](https://console.anthropic.com/settings/keys)

---

### 1. Clone the Repository

```bash
git clone https://github.com/chhavisharma0902/medimap.git
cd medimap
```

---

### 2. Backend Setup

```bash
cd backend
```

**Create and activate a virtual environment:**

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python -m venv venv
source venv/bin/activate
```

**Install dependencies:**

```bash
pip install -r requirements.txt
```

**Set your Anthropic API key:**

```bash
# Windows (PowerShell)
$env:ANTHROPIC_API_KEY="sk-ant-your-key-here"

# macOS/Linux
export ANTHROPIC_API_KEY="sk-ant-your-key-here"
```

> 💡 To make it permanent on Windows, run:
> `[System.Environment]::SetEnvironmentVariable("ANTHROPIC_API_KEY", "sk-ant-...", "User")`

**Start the backend server:**

```bash
uvicorn main:app --reload
```

✅ Backend running at: **http://localhost:8000**
📖 Swagger API docs: **http://localhost:8000/docs**
💚 Health check: **http://localhost:8000/health**

---

### 3. Frontend Setup

Open a **new terminal** (keep backend running):

```bash
cd frontend
npm install
npm start
```

✅ Frontend running at: **http://localhost:3000**

---

## 🧪 Sample Queries to Test

Try these in the search box:

```
angioplasty near Nagpur for diabetic patient under 3L
```
```
knee replacement in Pune, 68 year old female, budget 2 lakh
```
```
bypass surgery in Mumbai for 65 year old hypertensive patient
```
```
kidney stone surgery Nagpur under 1L
```
```
affordable heart surgery Nagpur very low budget 1L
```
```
angioplasty for diabetic hypertensive patient in Mumbai
```

---

## 🌐 API Reference

### `POST /api/analyze`

**Request:**
```json
{
  "query": "angioplasty near Nagpur for diabetic patient under 3L"
}
```

**Response:**
```json
{
  "icd_code": "I25.1",
  "condition": "Atherosclerotic heart disease",
  "procedure": "Coronary Angioplasty (PCI)",
  "procedure_short": "Angioplasty",
  "specialty": "cardiology",
  "parsed_query": {
    "city": "nagpur",
    "budget_inr": 300000,
    "comorbidities": ["diabetes"],
    "urgency": "elective"
  },
  "hospitals": [ "..." ],
  "cost_breakdown": { "..." },
  "total_range": {
    "min_fmt": "₹1.4L",
    "max_fmt": "₹1.9L"
  },
  "adjustments_applied": [
    { "factor": "Diabetes", "adjustment": "+15%" }
  ],
  "confidence": {
    "percentage": 81,
    "label": "High",
    "color": "green"
  }
}
```

---

## 🏙️ Supported Cities

| City | Cost Multiplier |
|------|----------------|
| Mumbai | 1.35× |
| Delhi | 1.25× |
| Bangalore | 1.20× |
| Chennai / Pune | 1.15× |
| Hyderabad | 1.10× |
| Kolkata | 1.05× |
| Nagpur / Jaipur | 0.90× |
| Lucknow / Indore | 0.85× |

---

## 🩺 Supported Procedures

Angioplasty · Bypass Surgery (CABG) · Knee Replacement · Hip Replacement · Kidney Stone Surgery (PCNL) · Gallbladder Removal · Breast Cancer Treatment · Stroke Treatment · Dialysis · Chemotherapy · GI Endoscopy · MS Treatment

---

## 🔧 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, CSS Variables, Google Fonts (Syne + DM Sans) |
| Backend | Python 3.11, FastAPI, Uvicorn |
| AI / NLP | Anthropic Claude Sonnet 4 |
| Data | JSON flat-file database |
| API | REST, JSON |

---

## ⚠️ Disclaimer

MediMap is a **decision support tool only** — it does not provide medical diagnoses or treatment recommendations. All cost estimates are indicative ranges based on available data. Always consult a qualified physician before any medical procedure.

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  <p>Built with ❤️ for making healthcare navigation easier in India</p>
  <p>
    <a href="https://github.com/chhavisharma0902/medimap/issues">Report Bug</a> ·
    <a href="https://github.com/chhavisharma0902/medimap/issues">Request Feature</a>
  </p>
</div>