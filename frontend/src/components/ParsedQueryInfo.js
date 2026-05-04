import React from 'react';

export default function ParsedQueryInfo({ parsed, icdCode, condition, procedure }) {
  const chips = [
    parsed.city && { label: '📍 City', value: parsed.city.charAt(0).toUpperCase() + parsed.city.slice(1) },
    parsed.age && { label: '👤 Age', value: `${parsed.age} years` },
    parsed.gender && { label: '⚧ Gender', value: parsed.gender },
    parsed.budget_inr && { label: '💰 Budget', value: formatINR(parsed.budget_inr) },
    parsed.urgency && { label: '⚡ Urgency', value: parsed.urgency },
    ...(parsed.comorbidities || []).map(c => ({ label: '🩺', value: c.replace(/_/g, ' ') })),
  ].filter(Boolean);

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      padding: '20px 24px',
    }}>
      {/* ICD + Procedure */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <div style={{
          background: 'var(--accent2-dim)',
          border: '1px solid var(--accent2)44',
          borderRadius: 10, padding: '8px 16px',
        }}>
          <div style={{ fontSize: 11, color: 'var(--accent2)', fontWeight: 600, letterSpacing: '0.05em' }}>ICD-10</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>{icdCode}</div>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>Condition Identified</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>{procedure}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{condition}</div>
        </div>
      </div>

      {/* Parsed fields */}
      {chips.length > 0 && (
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 8, letterSpacing: '0.08em', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
            EXTRACTED PARAMETERS
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {chips.map((chip, i) => (
              <div key={i} style={{
                background: 'var(--border)',
                borderRadius: 8,
                padding: '4px 12px',
                fontSize: 13,
                color: 'var(--text)',
              }}>
                <span style={{ color: 'var(--text-muted)', marginRight: 4 }}>{chip.label}</span>
                {chip.value}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function formatINR(amount) {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount}`;
}
