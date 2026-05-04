import React, { useState } from 'react';

export default function HospitalCard({ hospital, rank, isBest }) {
  const [hovered, setHovered] = useState(false);

  const scoreColor = hospital.score >= 80 ? 'var(--accent)' : hospital.score >= 65 ? 'var(--accent2)' : 'var(--warn)';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--bg-card-hover)' : 'var(--bg-card)',
        border: `1px solid ${isBest ? 'var(--accent)' : hovered ? 'var(--border-bright)' : 'var(--border)'}`,
        borderRadius: 16,
        padding: '20px',
        position: 'relative',
        transition: 'all 0.2s',
        boxShadow: isBest ? '0 0 20px var(--accent-dim)' : 'none',
      }}
    >
      {isBest && (
        <div style={{
          position: 'absolute',
          top: -1, right: 20,
          background: 'var(--accent)',
          color: '#0a0e1a',
          fontSize: 11,
          fontWeight: 800,
          fontFamily: 'var(--font-display)',
          padding: '3px 12px',
          borderRadius: '0 0 8px 8px',
          letterSpacing: '0.05em',
        }}>★ BEST MATCH</div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 11,
              color: 'var(--text-dim)',
              letterSpacing: '0.1em',
            }}>#{rank}</span>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 17,
              color: 'var(--text)',
              lineHeight: 1.2,
            }}>{hospital.name}</h3>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>
            📍 {hospital.city} · {hospital.distance_km} km away
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
            {hospital.tags.map((tag, i) => (
              <span key={i} style={{
                fontSize: 11,
                padding: '3px 10px',
                borderRadius: 20,
                fontWeight: 600,
                background: tag.includes('Best') ? 'var(--accent-dim)' :
                            tag === 'NABH' ? 'var(--accent2-dim)' : 'var(--border)',
                color: tag.includes('Best') ? 'var(--accent)' :
                       tag === 'NABH' ? 'var(--accent2)' : 'var(--text-muted)',
                border: `1px solid ${tag.includes('Best') ? 'var(--accent)' : tag === 'NABH' ? 'var(--accent2)' : 'transparent'}`,
              }}>{tag}</span>
            ))}
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 20 }}>
            <Stat label="Rating" value={`⭐ ${hospital.rating}`} />
            <Stat label="Beds" value={hospital.bed_count?.toLocaleString() ?? 'N/A'} />
            {hospital.nabh && <Stat label="NABH" value="✓" accent />}
            {hospital.nabl && <Stat label="NABL" value="✓" accent />}
          </div>
        </div>

        {/* Score + Cost */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{
            width: 56, height: 56,
            borderRadius: '50%',
            border: `2px solid ${scoreColor}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 10,
            marginLeft: 'auto',
            background: scoreColor + '11',
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, color: scoreColor }}>
              {hospital.score}
            </span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 4 }}>Est. Cost</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>
            {hospital.estimated_cost_min_fmt}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            – {hospital.estimated_cost_max_fmt}
          </div>
        </div>
      </div>

      {/* Phone + Insurance */}
      <div style={{
        marginTop: 14,
        paddingTop: 14,
        borderTop: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
      }}>
        <a href={`tel:${hospital.phone}`} style={{
          fontSize: 13, color: 'var(--accent2)',
          textDecoration: 'none', fontWeight: 500,
        }}>📞 {hospital.phone}</a>
        <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>
          {hospital.insurance_accepted.slice(0, 3).join(' · ')}
          {hospital.insurance_accepted.length > 3 && ` +${hospital.insurance_accepted.length - 3}`}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: accent ? 'var(--accent)' : 'var(--text)' }}>{value}</div>
    </div>
  );
}
