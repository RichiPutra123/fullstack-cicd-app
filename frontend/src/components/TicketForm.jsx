import React, { useState } from 'react';

export default function TicketForm({ onSubmit }) {
  const [form, setForm] = useState({ title: '', category: 'IT & Network', customer_name: '', priority: 'Medium' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.customer_name) return;
    onSubmit(form);
    setForm({ title: '', category: 'IT & Network', customer_name: '', priority: 'Medium' });
  };

  const inputStyle = { width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '13px' };
  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: '#475569' };

  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '16px', color: '#0f172a' }}>+ Buat Tiket Baru</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>Judul Layanan / Kendala</label>
          <input
            type="text"
            placeholder="mis. Troubleshooting Wifi"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>Kategori</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            style={inputStyle}
          >
            <option value="IT & Network">IT & Network</option>
            <option value="Elektronik">Elektronik</option>
            <option value="Kelistrikan">Kelistrikan</option>
            <option value="Fasilitas">Fasilitas</option>
          </select>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>Prioritas</label>
          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
            style={inputStyle}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>Nama Pelapor / Klien</label>
          <input
            type="text"
            placeholder="Nama Klien"
            value={form.customer_name}
            onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
            style={inputStyle}
          />
        </div>
        <button type="submit" style={{ width: '100%', background: '#2563eb', color: 'white', padding: '10px', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', marginTop: '10px' }}>
          Submit Ticket
        </button>
      </form>
    </div>
  );
}