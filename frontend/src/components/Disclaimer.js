import React from 'react';

export default function Disclaimer({ text }) {
  return (
    <div style={{
      background: '#1a1000',
      border: '1px solid var(--warn)44',
      borderRadius: 12,
      padding: '14px 20px',
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
    }}>
      <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
      <p style={{ fontSize: 13, color: '#c9a84c', lineHeight: 1.6 }}>
        {text.replace('⚠️ ', '')}
      </p>
    </div>
  );
}
