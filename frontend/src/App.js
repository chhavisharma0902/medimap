import React, { useState } from 'react';
import Header from './components/Header';
import SearchBox from './components/SearchBox';
import HospitalCard from './components/HospitalCard';
import CostBreakdown from './components/CostBreakdown';
import ConfidenceBar from './components/ConfidenceBar';
import ParsedQueryInfo from './components/ParsedQueryInfo';
import Disclaimer from './components/Disclaimer';
import LoadingSkeleton from './components/LoadingSkeleton';
import { analyzeQuery } from './utils/api';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [lastQuery, setLastQuery] = useState('');

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setLastQuery(query);
    try {
      const data = await analyzeQuery(query);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ flex: 1, padding: '40px 20px', maxWidth: 900, margin: '0 auto', width: '100%' }}>
        {/* Hero */}
        {!result && !loading && !error && (
          <div style={{ textAlign: 'center', marginBottom: 48 }} className="fade-up">
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(32px, 5vw, 52px)',
              lineHeight: 1.1,
              letterSpacing: '-1px',
              marginBottom: 16,
            }}>
              Find the right care,{' '}
              <span style={{
                background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>at the right cost</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 17, maxWidth: 540, margin: '0 auto 40px', lineHeight: 1.7 }}>
              Describe your medical need in plain language. MediMap uses AI to match you with the best hospitals and estimate treatment costs across India.
            </p>
          </div>
        )}

        {/* Search box always visible */}
        <div className="fade-up-1">
          <SearchBox onSearch={handleSearch} loading={loading} />
        </div>

        {/* Loading */}
        {loading && <LoadingSkeleton />}

        {/* Error */}
        {error && (
          <div style={{
            marginTop: 32,
            background: '#1a0008',
            border: '1px solid var(--danger)44',
            borderRadius: 12,
            padding: '16px 20px',
            color: '#f87171',
            fontSize: 14,
          }}>
            ❌ {error}
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Row 1: Parsed info + Confidence */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(280px, 320px)', gap: 16, alignItems: 'start' }} className="fade-up-1">
              <ParsedQueryInfo
                parsed={result.parsed_query}
                icdCode={result.icd_code}
                condition={result.condition}
                procedure={result.procedure}
              />
              <ConfidenceBar confidence={result.confidence} />
            </div>

            {/* Row 2: Hospital cards */}
            <section className="fade-up-2">
              <SectionLabel>🏥 Top Hospital Matches</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {result.hospitals.map((h, i) => (
                  <HospitalCard
                    key={h.id}
                    hospital={h}
                    rank={i + 1}
                    isBest={i === 0}
                  />
                ))}
              </div>
            </section>

            {/* Row 3: Cost breakdown */}
            <section className="fade-up-3">
              <SectionLabel>💰 Cost Breakdown</SectionLabel>
              <CostBreakdown
                breakdown={result.cost_breakdown}
                totalRange={result.total_range}
                adjustments={result.adjustments_applied}
              />
            </section>

            {/* Disclaimer */}
            <div className="fade-up-4">
              <Disclaimer text={result.disclaimer} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        padding: '20px 32px',
        borderTop: '1px solid var(--border)',
        textAlign: 'center',
        fontSize: 12,
        color: 'var(--text-dim)',
      }}>
        MediMap · AI Healthcare Navigator for India · Not a substitute for medical advice
      </footer>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 16,
      color: 'var(--text)',
      marginBottom: 12,
    }}>{children}</div>
  );
}
