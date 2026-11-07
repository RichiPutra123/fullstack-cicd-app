import React from 'react';

export default function TicketTable({ orders, onUpdateStatus, onDeleteClick }) {
  const badgeStyle = { padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 };

  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '16px', color: '#0f172a' }}>Daftar Work Orders</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
            <th style={{ padding: '10px', fontSize: '12px', color: '#64748b' }}>Order Detail</th>
            <th style={{ padding: '10px', fontSize: '12px', color: '#64748b' }}>Prioritas</th>
            <th style={{ padding: '10px', fontSize: '12px', color: '#64748b' }}>Status</th>
            <th style={{ padding: '10px', fontSize: '12px', color: '#64748b' }}>Aksi & Verifikasi</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                Tidak ada work order yang ditemukan.
              </td>
            </tr>
          ) : (
            orders.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 10px', fontSize: '13px' }}>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {item.category} • Pelapor: <b>{item.customer_name}</b>
                  </div>
                </td>
                <td style={{ padding: '12px 10px' }}>
                  <span style={{
                    ...badgeStyle,
                    background: item.priority === 'High' ? '#fee2e2' : item.priority === 'Medium' ? '#fef3c7' : '#e0e7ff',
                    color: item.priority === 'High' ? '#991b1b' : item.priority === 'Medium' ? '#92400e' : '#3730a3'
                  }}>
                    {item.priority}
                  </span>
                </td>
                <td style={{ padding: '12px 10px' }}>
                  <span style={{
                    ...badgeStyle,
                    background: item.status === 'Completed' ? '#d1fae5' : item.status === 'In Progress' ? '#dbeafe' : '#f1f5f9',
                    color: item.status === 'Completed' ? '#065f46' : item.status === 'In Progress' ? '#1e40af' : '#475569'
                  }}>
                    {item.status}
                  </span>
                </td>
                <td style={{ padding: '12px 10px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {item.status === 'Pending' && (
                      <button onClick={() => onUpdateStatus(item.id, 'In Progress')} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                        Proses
                      </button>
                    )}
                    {item.status === 'In Progress' && (
                      <button onClick={() => onUpdateStatus(item.id, 'Completed')} style={{ background: '#10b981', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                        Selesai
                      </button>
                    )}
                    <button onClick={() => onDeleteClick(item)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                      🗑️ Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}