import React from 'react';

export default function KPICards({ orders }) {
  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const inProgressCount = orders.filter(o => o.status === 'In Progress').length;
  const completedCount = orders.filter(o => o.status === 'Completed').length;

  const cardStyle = { background: 'white', padding: '18px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' };
  const labelStyle = { color: '#64748b', fontSize: '13px', fontWeight: 500 };
  const valStyle = { fontSize: '24px', fontWeight: 700, marginTop: '6px', color: '#0f172a' };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '25px' }}>
      <div style={{ ...cardStyle, borderLeft: '4px solid #6366f1' }}>
        <span style={labelStyle}>Total Orders</span>
        <span style={valStyle}>{orders.length}</span>
      </div>
      <div style={{ ...cardStyle, borderLeft: '4px solid #f59e0b' }}>
        <span style={labelStyle}>Pending</span>
        <span style={valStyle}>{pendingCount}</span>
      </div>
      <div style={{ ...cardStyle, borderLeft: '4px solid #3b82f6' }}>
        <span style={labelStyle}>In Progress</span>
        <span style={valStyle}>{inProgressCount}</span>
      </div>
      <div style={{ ...cardStyle, borderLeft: '4px solid #10b981' }}>
        <span style={labelStyle}>Completed</span>
        <span style={valStyle}>{completedCount}</span>
      </div>
    </div>
  );
}