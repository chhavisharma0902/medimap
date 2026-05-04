import React from 'react';

function Skeleton({ w = '100%', h = 16, radius = 6, style = {} }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: radius,
      background: 'linear-gradient(90deg, var(--border) 25%, var(--border-bright) 50%, var(--border) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      ...style,
    }} />
  );
}

export default function LoadingSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 32 }}>
      {/* Top row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Skeleton h={20} w="60%" />
          <Skeleton h={14} w="80%" />
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <Skeleton h={28} w={80} radius={8} />
            <Skeleton h={28} w={100} radius={8} />
            <Skeleton h={28} w={70} radius={8} />
          </div>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Skeleton h={14} w="50%" />
          <Skeleton h={6} radius={3} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[0,1,2,3].map(i => <Skeleton key={i} h={12} />)}
          </div>
        </div>
      </div>

      {/* Hospital cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Skeleton h={13} w={120} />
        {[0,1,2].map(i => (
          <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Skeleton h={18} w="55%" />
                <Skeleton h={13} w="40%" />
              </div>
              <Skeleton w={56} h={56} radius="50%" />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Skeleton h={24} w={60} radius={20} />
              <Skeleton h={24} w={80} radius={20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
