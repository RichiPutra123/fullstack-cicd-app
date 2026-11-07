import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// Inisialisasi Socket.io Client
const socket = io('/', { path: '/socket.io' });

export default function App() {
  const [role, setRole] = useState('client');
  const [token, setToken] = useState(localStorage.getItem('jwt_token') || '');
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [toast, setToast] = useState('');

  // State Form Klien
  const [form, setForm] = useState({ title: '', category: 'IT & Network', customer_name: '', priority: 'Medium' });
  const [imageFile, setImageFile] = useState(null);

  // State Modal Verifikasi Hapus Admin
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchOrders = async () => {
    try {
      const query = new URLSearchParams({ search, status: statusFilter }).toString();
      const res = await fetch(`/api/orders?${query}`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  // Efek Real-Time Socket.io
  useEffect(() => {
    fetchOrders();

    socket.on('order_created', (newOrder) => {
      setOrders((prev) => [newOrder, ...prev]);
      showToast(`🔔 Tiket baru masuk: "${newOrder.title}"`);
    });

    socket.on('order_updated', (updatedOrder) => {
      setOrders((prev) => prev.map((item) => (item.id === updatedOrder.id ? updatedOrder : item)));
      showToast(`🔄 Status tiket #${updatedOrder.id} diperbarui`);
    });

    socket.on('order_deleted', ({ id }) => {
      setOrders((prev) => prev.filter((item) => item.id !== id));
      showToast(`🗑️ Tiket #${id} dihapus dari server`);
    });

    return () => {
      socket.off('order_created');
      socket.off('order_updated');
      socket.off('order_deleted');
    };
  }, [search, statusFilter]);

  // Login JWT Demo Handler
  const handleLogin = async (selectedRole) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: selectedRole, password: selectedRole, role: selectedRole })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('jwt_token', data.token);
        setToken(data.token);
        setRole(selectedRole);
        showToast(`🔑 Berhasil Login JWT sebagai ${selectedRole.toUpperCase()}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Tiket Baru (dengan Multipart Form Data foto)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.customer_name) return;

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('category', form.category);
    formData.append('customer_name', form.customer_name);
    formData.append('priority', form.priority);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    await fetch('/api/orders', {
      method: 'POST',
      body: formData
    });

    setForm({ title: '', category: 'IT & Network', customer_name: '', priority: 'Medium' });
    setImageFile(null);
  };

  const updateStatus = async (id, nextStatus) => {
    await fetch(`/api/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status: nextStatus })
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.item) return;
    await fetch(`/api/orders/${deleteModal.item.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    setDeleteModal({ open: false, item: null });
  };

  return (
    <div style={styles.appContainer}>
      {toast && <div style={styles.toast}>{toast}</div>}

      <header style={styles.navbar}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a', fontSize: '20px' }}>ServiTask Enterprise</h2>
          <span style={{ fontSize: '12px', color: '#64748b' }}>WebSocket Real-Time + Redis Cache + JWT Auth</span>
        </div>

        <div style={styles.roleSwitchContainer}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Peran Token:</span>
          <button
            onClick={() => handleLogin('client')}
            style={{
              ...styles.roleBtn,
              background: role === 'client' ? '#2563eb' : '#e2e8f0',
              color: role === 'client' ? 'white' : '#475569'
            }}
          >
            👤 Klien Portal
          </button>
          <button
            onClick={() => handleLogin('admin')}
            style={{
              ...styles.roleBtn,
              background: role === 'admin' ? '#0f172a' : '#e2e8f0',
              color: role === 'admin' ? 'white' : '#475569'
            }}
          >
            🛠️ Server/Admin Control
          </button>
        </div>
      </header>

      {/* PORTAL KLIEN */}
      {role === 'client' && (
        <div style={styles.portalContent}>
          <div style={styles.heroBanner}>
            <h1 style={{ margin: 0, fontSize: '24px', color: '#1e3a8a' }}>Pengajuan Tiket Layanan & Upload Lampiran</h1>
            <p style={{ margin: '6px 0 0 0', color: '#3b82f6', fontSize: '14px' }}>
              Pembaruan data diproses secara <b>Real-time via Socket.io</b> dan di-cache oleh <b>Redis Engine</b>.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '25px', marginTop: '25px' }}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>📝 Form Laporan + Upload Foto</h3>
              <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Judul Permintaan / Kendala</label>
                  <input
                    type="text"
                    placeholder="mis. Kerusakan Kabel LAN"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Kategori</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    style={styles.input}
                  >
                    <option value="IT & Network">IT & Network</option>
                    <option value="Elektronik">Elektronik</option>
                    <option value="Kelistrikan">Kelistrikan</option>
                    <option value="Fasilitas">Fasilitas</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Prioritas</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    style={styles.input}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Nama Pelapor</label>
                  <input
                    type="text"
                    placeholder="Nama Anda"
                    value={form.customer_name}
                    onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>📷 Unggah Foto Kendala (Opsional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    style={{ fontSize: '12px' }}
                  />
                </div>
                <button type="submit" style={styles.btnClientSubmit}>Kirim Tiket Real-Time</button>
              </form>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>🔍 Status Tiket Real-time</h3>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.th}>Kendala & Lampiran</th>
                    <th style={styles.th}>Prioritas</th>
                    <th style={styles.th}>Status Server</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((item) => (
                    <tr key={item.id} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.title}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{item.category} • {item.customer_name}</div>
                        {item.image_url && (
                          <a href={item.image_url} target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: '#2563eb' }}>
                            🖼️ Lihat Foto Lampiran
                          </a>
                        )}
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          background: item.priority === 'High' ? '#fee2e2' : item.priority === 'Medium' ? '#fef3c7' : '#e0e7ff',
                          color: item.priority === 'High' ? '#991b1b' : item.priority === 'Medium' ? '#92400e' : '#3730a3'
                        }}>
                          {item.priority}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          background: item.status === 'Completed' ? '#d1fae5' : item.status === 'In Progress' ? '#dbeafe' : item.status === 'Rejected' ? '#fee2e2' : '#fef3c7',
                          color: item.status === 'Completed' ? '#065f46' : item.status === 'In Progress' ? '#1e40af' : item.status === 'Rejected' ? '#991b1b' : '#92400e'
                        }}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PORTAL ADMIN */}
      {role === 'admin' && (
        <div style={styles.portalContent}>
          <div style={styles.kpiGrid}>
            <div style={{ ...styles.kpiCard, borderLeft: '4px solid #6366f1' }}>
              <span style={styles.kpiLabel}>Total Masuk (Cached)</span>
              <span style={styles.kpiVal}>{orders.length}</span>
            </div>
            <div style={{ ...styles.kpiCard, borderLeft: '4px solid #f59e0b' }}>
              <span style={styles.kpiLabel}>Pending</span>
              <span style={styles.kpiVal}>{orders.filter(o => o.status === 'Pending').length}</span>
            </div>
            <div style={{ ...styles.kpiCard, borderLeft: '4px solid #3b82f6' }}>
              <span style={styles.kpiLabel}>Sedang Diproses</span>
              <span style={styles.kpiVal}>{orders.filter(o => o.status === 'In Progress').length}</span>
            </div>
            <div style={{ ...styles.kpiCard, borderLeft: '4px solid #10b981' }}>
              <span style={styles.kpiLabel}>Selesai Dikerjakan</span>
              <span style={styles.kpiVal}>{orders.filter(o => o.status === 'Completed').length}</span>
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🖥️ Control Room Live Broadcast</h3>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Tiket & Lampiran</th>
                  <th style={styles.th}>Prioritas</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Aksi Kontrol</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((item) => (
                  <tr key={item.id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.title}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Pelapor: {item.customer_name}</div>
                      {item.image_url && (
                        <a href={item.image_url} target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: '#2563eb' }}>
                          🖼️ Bukti Foto
                        </a>
                      )}
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        background: item.priority === 'High' ? '#fee2e2' : item.priority === 'Medium' ? '#fef3c7' : '#e0e7ff',
                        color: item.priority === 'High' ? '#991b1b' : item.priority === 'Medium' ? '#92400e' : '#3730a3'
                      }}>
                        {item.priority}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        background: item.status === 'Completed' ? '#d1fae5' : item.status === 'In Progress' ? '#dbeafe' : '#fef3c7',
                        color: item.status === 'Completed' ? '#065f46' : item.status === 'In Progress' ? '#1e40af' : '#92400e'
                      }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {item.status === 'Pending' && (
                          <button onClick={() => updateStatus(item.id, 'In Progress')} style={styles.btnProcess}>▶ Proses</button>
                        )}
                        {item.status === 'In Progress' && (
                          <button onClick={() => updateStatus(item.id, 'Completed')} style={styles.btnComplete}>✔ Selesai</button>
                        )}
                        <button onClick={() => setDeleteModal({ open: true, item })} style={styles.btnDelete}>🗑️ Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {deleteModal.open && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h3 style={{ marginTop: 0, color: '#991b1b' }}>⚠️ Verifikasi Otentikasi Hapus</h3>
            <p style={{ fontSize: '14px' }}>Hapus tiket dari database & invalidasi cache Redis?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setDeleteModal({ open: false, item: null })} style={styles.btnCancel}>Batal</button>
              <button onClick={confirmDelete} style={styles.btnConfirmDelete}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  appContainer: { minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" },
  toast: { position: 'fixed', top: '20px', right: '20px', background: '#0f172a', color: 'white', padding: '12px 24px', borderRadius: '8px', zIndex: 9999 },
  navbar: { background: 'white', borderBottom: '1px solid #e2e8f0', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  roleSwitchContainer: { display: 'flex', alignItems: 'center', gap: '10px' },
  roleBtn: { border: 'none', padding: '8px 16px', borderRadius: '20px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' },
  portalContent: { maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' },
  heroBanner: { background: '#eff6ff', border: '1px solid #bfdbfe', padding: '20px 25px', borderRadius: '12px' },
  card: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  cardTitle: { marginTop: 0, marginBottom: '15px', fontSize: '16px' },
  formGroup: { marginBottom: '12px' },
  label: { display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' },
  input: { width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' },
  btnClientSubmit: { width: '100%', background: '#2563eb', color: 'white', padding: '10px', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', marginTop: '10px' },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '25px' },
  kpiCard: { background: 'white', padding: '18px', borderRadius: '10px', display: 'flex', flexDirection: 'column' },
  kpiLabel: { color: '#64748b', fontSize: '13px' },
  kpiVal: { fontSize: '24px', fontWeight: 700, marginTop: '6px' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  tableHeader: { borderBottom: '2px solid #f1f5f9' },
  th: { padding: '10px', fontSize: '12px', color: '#64748b' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '12px 10px', fontSize: '13px' },
  badge: { padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 },
  btnProcess: { background: '#2563eb', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' },
  btnComplete: { background: '#10b981', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' },
  btnDelete: { background: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 },
  modalBox: { background: 'white', padding: '25px', borderRadius: '12px', width: '400px' },
  btnCancel: { background: '#e2e8f0', color: '#475569', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' },
  btnConfirmDelete: { background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }
};