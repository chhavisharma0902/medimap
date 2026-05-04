# MediMap — AI Healthcare Navigator & Cost Estimator

AI-powered tool to find hospitals and estimate treatment costs across India.

## Project Structure

```
medimap/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── routes/
│   │   └── analyze.py
│   ├── services/
│   │   ├── nlp_parser.py
│   │   ├── icd_mapper.py
│   │   ├── cost_estimator.py
│   │   ├── hospital_ranker.py
│   │   └── confidence_scorer.py
│   └── data/
│       ├── hospitals.json
│       ├── procedures.json
│       └── cost_config.json
├── frontend/
│   ├── package.json
│   ├── public/index.html
│   └── src/
│       ├── App.js, index.js, index.css
│       ├── utils/api.js
│       └── components/ (Header, SearchBox, HospitalCard, CostBreakdown, ConfidenceBar, ParsedQueryInfo, LoadingSkeleton, Disclaimer)
└── README.md
```

## Prerequisites
- Python 3.11+
- Node.js 18+
- Anthropic API key

## Run Backend

```bash
cd backend
pip install -r requirements.txt
export ANTHROPIC_API_KEY=your_key_here
uvicorn main:app --reload
```

Runs at: http://localhost:8000  
Docs: http://localhost:8000/docs

## Run Frontend

```bash
cd frontend
npm install
npm start
```

Runs at: http://localhost:3000

## API Usage

POST http://localhost:8000/api/analyze

```json
{ "query": "angioplasty near Nagpur for diabetic patient under 3L" }
```

## Zip

```bash
zip -r medimap.zip medimap/
```

## Disclaimer

Decision support only — not a diagnosis or treatment recommendation.
