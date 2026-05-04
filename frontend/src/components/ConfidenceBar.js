import React from 'react';

export default function ConfidenceBar({ confidence }) {
  const { percentage, label, color, factors } = confidence;
  const barColor = color === 'green' ? 'var(--accent)' : color === 'yellow' ? 'var(--warn)' : 'var(--danger)';

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      padding: '20px 24px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
          DATA CONFIDENCE
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22,
            color: barColor,
          }}>{percentage}%</span>
          <span style={{
            background: barColor + '22',
            color: barColor,
            padding: '2px 10px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
          }}>{label}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, marginBottom: 16, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${percentage}%`,
          background: `linear-gradient(90deg, ${barColor}88, ${barColor})`,
          borderRadius: 3,
          transition: 'width 0.8s ease',
        }} />
      </div>

      {/* Factors */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {Object.entries(factors).map(([key, val]) => (
          <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: val >= 0.75 ? 'var(--accent)' : val >= 0.5 ? 'var(--warn)' : 'var(--danger)' }}>
              {Math.round(val * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
