import React from 'react';

export default function Header() {
  return (
    <header style={{
      padding: '20px 32px',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      background: 'rgba(10,14,26,0.8)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        width: 36, height: 36,
        background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
        borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18,
      }}>⚕</div>
      <div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 20,
          letterSpacing: '-0.5px',
          background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>MediMap</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.05em', marginTop: -2 }}>
          AI HEALTHCARE NAVIGATOR · INDIA
        </div>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{
          width: 7, height: 7, borderRadius: '50%',
          background: 'var(--accent)',
          animation: 'pulse-dot 2s infinite',
        }} />
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Live</span>
      </div>
    </header>
  );
}
