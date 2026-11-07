import React from 'react';

export default function Header() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '26px', color: '#0f172a', fontWeight: 700 }}>ServiTask Enterprise</h1>
        <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>Work Order & IT Service Ticketing System (3-Tier Containerized)</p>
      </div>
      <div style={{ background: '#e0f2fe', color: '#0369a1', padding: '6px 14px', borderRadius: '20px', fontWeight: 600, fontSize: '13px' }}>
        CI/CD Active v2.5
      </div>
    </div>
  );
}