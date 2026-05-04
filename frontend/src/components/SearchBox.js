import React, { useState, useRef } from 'react';

const EXAMPLES = [
  "angioplasty near Nagpur for diabetic patient under 3L",
  "knee replacement in Pune, 65 year old patient, budget 2 lakh",
  "bypass surgery Mumbai hypertension patient",
  "kidney stone surgery in Delhi under 1L",
];

export default function SearchBox({ onSearch, loading }) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef(null);

  const handleSubmit = () => {
    if (!query.trim() || loading) return;
    onSearch(query.trim());
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const useExample = (ex) => {
    setQuery(ex);
    textareaRef.current?.focus();
  };

  return (
    <div style={{ width: '100%', maxWidth: 760, margin: '0 auto' }}>
      {/* Main input */}
      <div style={{
        background: 'var(--bg-card)',
        border: `1px solid ${focused ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 16,
        padding: '16px 20px',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: focused ? '0 0 0 3px var(--accent-dim)' : 'none',
      }}>
        <textarea
          ref={textareaRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKey}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Describe your medical need... (e.g. angioplasty near Nagpur for diabetic patient under 3L)"
          rows={3}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text)',
            fontFamily: 'var(--font-body)',
            fontSize: 15,
            lineHeight: 1.6,
            resize: 'none',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>
            Enter ↵ to analyze
          </span>
          <button
            onClick={handleSubmit}
            disabled={!query.trim() || loading}
            style={{
              background: loading ? 'var(--border)' : 'linear-gradient(135deg, var(--accent), var(--accent2))',
              color: loading ? 'var(--text-muted)' : '#0a0e1a',
              border: 'none',
              borderRadius: 10,
              padding: '9px 24px',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 14,
              cursor: loading || !query.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              letterSpacing: '0.02em',
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <LoadingDots /> Analyzing...
              </span>
            ) : 'Analyze →'}
          </button>
        </div>
      </div>

      {/* Example queries */}
      <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontSize: 12, color: 'var(--text-dim)', paddingTop: 4 }}>Try:</span>
        {EXAMPLES.map((ex, i) => (
          <button
            key={i}
            onClick={() => useExample(ex)}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 20,
              padding: '4px 12px',
              fontSize: 12,
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.color = 'var(--accent)'; }}
            onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-muted)'; }}
          >
            {ex.length > 45 ? ex.slice(0, 45) + '…' : ex}
          </button>
        ))}
      </div>
    </div>
  );
}

function LoadingDots() {
  return (
    <span style={{ display: 'flex', gap: 3 }}>
      {[0,1,2].map(i => (
        <span key={i} style={{
          width: 4, height: 4, borderRadius: '50%',
          background: 'var(--text-muted)',
          display: 'inline-block',
          animation: `pulse-dot 1s ${i * 0.2}s infinite`,
        }} />
      ))}
    </span>
  );
}
