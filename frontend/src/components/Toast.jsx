import React from 'react';

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#0f172a', color: 'white', padding: '12px 24px', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)', zIndex: 9999, fontSize: '14px' }}>
      {message}
    </div>
  );
}