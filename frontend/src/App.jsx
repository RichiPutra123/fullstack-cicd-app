import React, { useState, useEffect } from 'react';

export default function App() {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ title: '', category: 'IT & Network', customer_name: '' });

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.customer_name) return;
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ title: '', category: 'IT & Network', customer_name: '' });
    fetchOrders();
  };

  const updateStatus = async (id, nextStatus) => {
    await fetch(`/api/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    });
    fetchOrders();
  };

  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const inProgressCount = orders.filter(o => o.status === 'In Progress').length;
  const completedCount = orders.filter(o => o.status === 'Completed').length;

  return (
    <div style={{ padding: '30px', maxWidth: '1100px', margin: '0 auto', color: '#1e293b' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#0f172a' }}>ServiTask Portal</h1>
          <p style={{ margin: '5px 0 0 0', color: '#64748b' }}>Work Order & Service Management System (3-Tier Container Architecture)</p>
        </div>
        <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '6px 14px', borderRadius: '20px', fontWeight: 600, fontSize: '14px' }}>
          CI/CD Active v2.0
        </span>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '5px solid #f59e0b' }}>
          <div style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Pending Tickets</div>
          <div style={{ fontSize: '28px', fontWeight: 700, marginTop: '5px' }}>{pendingCount}</div>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '5px solid #3b82f6' }}>
          <div style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>In Progress</div>
          <div style={{ fontSize: '28px', fontWeight: 700, marginTop: '5px' }}>{inProgressCount}</div>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '5px solid #10b981' }}>
          <div style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Completed</div>
          <div style={{ fontSize: '28px', fontWeight: 700, marginTop: '5px' }}>{completedCount}</div>
        </div>
      </div>

      {/* Grid: Form & List */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        {/* Form Tambah */}
        <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Buat Work Order Baru</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '5px' }}>Judul Layanan / Masalah</label>
              <input
                type="text"
                placeholder="mis. Perbaikan Wifi Lt. 2"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '5px' }}>Kategori</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              >
                <option value="IT & Network">IT & Network</option>
                <option value="Elektronik">Elektronik</option>
                <option value="Kelistrikan">Kelistrikan</option>
                <option value="Renovasi">Renovasi</option>
              </select>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '5px' }}>Nama Pelapor / Klien</label>
              <input
                type="text"
                placeholder="Nama Anda"
                value={form.customer_name}
                onChange={e => setForm({ ...form, customer_name: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              />
            </div>
            <button
              type="submit"
              style={{ width: '100%', background: '#2563eb', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
            >
              Kirim Tiket
            </button>
          </form>
        </div>

        {/* Tabel Work Orders */}
        <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Daftar Work Orders Active</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '13px' }}>
                <th style={{ padding: '10px' }}>Judul & Pelapor</th>
                <th style={{ padding: '10px' }}>Kategori</th>
                <th style={{ padding: '10px' }}>Status</th>
                <th style={{ padding: '10px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 10px' }}>
                    <div style={{ fontWeight: 600 }}>{item.title}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Klien: {item.customer_name}</div>
                  </td>
                  <td style={{ padding: '12px 10px', fontSize: '14px' }}>{item.category}</td>
                  <td style={{ padding: '12px 10px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      background: item.status === 'Completed' ? '#d1fae5' : item.status === 'In Progress' ? '#dbeafe' : '#fef3c7',
                      color: item.status === 'Completed' ? '#065f46' : item.status === 'In Progress' ? '#1e40af' : '#92400e'
                    }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 10px' }}>
                    {item.status === 'Pending' && (
                      <button onClick={() => updateStatus(item.id, 'In Progress')} style={{ padding: '5px 10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Proses</button>
                    )}
                    {item.status === 'In Progress' && (
                      <button onClick={() => updateStatus(item.id, 'Completed')} style={{ padding: '5px 10px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Selesai</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}