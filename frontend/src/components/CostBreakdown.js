import React from 'react';

export default function CostBreakdown({ breakdown, totalRange, adjustments }) {
  const pcts = {
    procedure: 52,
    hospital_stay: 15,
    doctor_fees: 10,
    diagnostics: 10,
    medicines: 8,
    contingency: 5,
  };

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      overflow: 'hidden',
    }}>
      {/* Total header */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(135deg, #0d2040 0%, transparent 100%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.08em', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
            TOTAL ESTIMATED COST
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'var(--text)', marginTop: 4 }}>
            {totalRange.min_fmt}
            <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 20 }}> – {totalRange.max_fmt}</span>
          </div>
        </div>
        {adjustments.length > 0 && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>Adjustments Applied</div>
            {adjustments.map((adj, i) => (
              <div key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'var(--warn)22', color: 'var(--warn)',
                border: '1px solid var(--warn)44',
                borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 600,
                marginLeft: 6, marginBottom: 4,
              }}>
                {adj.factor} <span>{adj.adjustment}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Breakdown rows */}
      <div style={{ padding: '8px 0' }}>
        {Object.entries(breakdown).map(([key, comp], i) => {
          const pct = pcts[key] || 10;
          return (
            <div key={key} style={{
              padding: '12px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              borderBottom: i < Object.keys(breakdown).length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: 'var(--text)', marginBottom: 6 }}>{comp.label}</div>
                <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: 'linear-gradient(90deg, var(--accent2)88, var(--accent))',
                    borderRadius: 2,
                  }} />
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 140 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>
                  {comp.min_fmt}
                </span>
                <span style={{ color: 'var(--text-dim)', fontSize: 13 }}> – {comp.max_fmt}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
