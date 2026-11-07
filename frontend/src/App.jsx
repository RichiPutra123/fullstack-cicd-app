import React, { useState, useEffect } from 'react';

export default function App() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [toast, setToast] = useState('');
  
  // State Form
  const [form, setForm] = useState({ title: '', category: 'IT & Network', customer_name: '', priority: 'Medium' });

  // State Modal Verifikasi Hapus Data
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

  useEffect(() => {
    fetchOrders();
  }, [search, statusFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.customer_name) return;
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ title: '', category: 'IT & Network', customer_name: '', priority: 'Medium' });
    showToast('✅ Tiket Work Order berhasil dibuat!');
    fetchOrders();
  };

  const updateStatus = async (id, nextStatus) => {
    await fetch(`/api/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    });
    showToast(`🔄 Status tiket diubah ke ${nextStatus}`);
    fetchOrders();
  };

  const confirmDelete = async () => {
    if (!deleteModal.item) return;
    await fetch(`/api/orders/${deleteModal.item.id}`, { method: 'DELETE' });
    showToast('🗑️ Work Order berhasil dihapus dari sistem');
    setDeleteModal({ open: false, item: null });
    fetchOrders();
  };

  return (
    <div style={styles.container}>
      {/* Toast Notification */}
      {toast && <div style={styles.toast}>{toast}</div>}

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>ServiTask Enterprise</h1>
          <p style={styles.subtitle}>Work Order & Ticket Management System (Containerized 3-Tier)</p>
        </div>
        <div style={styles.badgeVersion}>CI/CD Pipeline Connected</div>
      </div>

      {/* KPI Cards */}
      <div style={styles.kpiGrid}>
        <div style={{ ...styles.kpiCard, borderLeft: '4px solid #6366f1' }}>
          <span style={styles.kpiLabel}>Total Orders</span>
          <span style={styles.kpiVal}>{orders.length}</span>
        </div>
        <div style={{ ...styles.kpiCard, borderLeft: '4px solid #f59e0b' }}>
          <span style={styles.kpiLabel}>Pending</span>
          <span style={styles.kpiVal}>{orders.filter(o => o.status === 'Pending').length}</span>
        </div>
        <div style={{ ...styles.kpiCard, borderLeft: '4px solid #3b82f6' }}>
          <span style={styles.kpiLabel}>In Progress</span>
          <span style={styles.kpiVal}>{orders.filter(o => o.status === 'In Progress').length}</span>
        </div>
        <div style={{ ...styles.kpiCard, borderLeft: '4px solid #10b981' }}>
          <span style={styles.kpiLabel}>Completed</span>
          <span style={styles.kpiVal}>{orders.filter(o => o.status === 'Completed').length}</span>
        </div>
      </div>

      {/* Control Bar (Search & Filter) */}
      <div style={styles.controlBar}>
        <input
          type="text"
          placeholder="🔍 Cari berdasarkan judul atau nama pelapor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="All">Semua Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Main Grid */}
      <div style={styles.mainGrid}>
        {/* Form Input */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>+ Buat Tiket Baru</h3>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Judul Layanan / Masalah</label>
              <input
                type="text"
                placeholder="mis. Troubleshooting Server"
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
              <label style={styles.label}>Nama Pelapor / Klien</label>
              <input
                type="text"
                placeholder="Nama Klien"
                value={form.customer_name}
                onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                style={styles.input}
              />
            </div>
            <button type="submit" style={styles.submitBtn}>Submit Ticket</button>
          </form>
        </div>

        {/* Tabel Data */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Daftar Work Orders</h3>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Order Detail</th>
                <th style={styles.th}>Prioritas</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Aksi & Verifikasi</th>
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
                  <tr key={item.id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.title}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        {item.category} • Pelapor: <b>{item.customer_name}</b>
                      </div>
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
                        background: item.status === 'Completed' ? '#d1fae5' : item.status === 'In Progress' ? '#dbeafe' : '#f1f5f9',
                        color: item.status === 'Completed' ? '#065f46' : item.status === 'In Progress' ? '#1e40af' : '#475569'
                      }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {item.status === 'Pending' && (
                          <button onClick={() => updateStatus(item.id, 'In Progress')} style={styles.btnAction}>Proses</button>
                        )}
                        {item.status === 'In Progress' && (
                          <button onClick={() => updateStatus(item.id, 'Completed')} style={{ ...styles.btnAction, background: '#10b981' }}>Selesai</button>
                        )}
                        <button
                          onClick={() => setDeleteModal({ open: true, item })}
                          style={styles.btnDelete}
                          title="Hapus Order"
                        >
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
      </div>

      {/* MODAL VERIFIKASI HAPUS DATA */}
      {deleteModal.open && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h3 style={{ marginTop: 0, color: '#991b1b' }}>⚠️ Konfirmasi Verifikasi Hapus</h3>
            <p>Apakah Anda yakin ingin menghapus tiket ini dari sistem?</p>
            <div style={styles.modalDetailBox}>
              <b>{deleteModal.item?.title}</b>
              <br />
              <small>Pelapor: {deleteModal.item?.customer_name} | Kategori: {deleteModal.item?.category}</small>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setDeleteModal({ open: false, item: null })} style={styles.btnCancel}>
                Batal
              </button>
              <button onClick={confirmDelete} style={styles.btnConfirmDelete}>
                Ya, Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline Styling (Enterprise Clean UI)
const styles = {
  container: { padding: '30px', maxWidth: '1200px', margin: '0 auto', fontFamily: "'Inter', sans-serif", color: '#334155' },
  toast: { position: 'fixed', top: '20px', right: '20px', background: '#0f172a', color: 'white', padding: '12px 24px', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)', zIndex: 9999 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
  title: { margin: 0, fontSize: '26px', color: '#0f172a', fontWeight: 700 },
  subtitle: { margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' },
  badgeVersion: { background: '#e0f2fe', color: '#0369a1', padding: '6px 14px', borderRadius: '20px', fontWeight: 600, fontSize: '13px' },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '25px' },
  kpiCard: { background: 'white', padding: '18px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' },
  kpiLabel: { color: '#64748b', fontSize: '13px', fontWeight: 500 },
  kpiVal: { fontSize: '24px', fontWeight: 700, marginTop: '6px', color: '#0f172a' },
  controlBar: { display: 'flex', gap: '15px', marginBottom: '25px' },
  searchInput: { flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' },
  filterSelect: { padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', background: 'white' },
  mainGrid: { display: 'grid', gridTemplateColumns: '320px 1fr', gap: '25px' },
  card: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  cardTitle: { marginTop: 0, marginBottom: '15px', fontSize: '16px', color: '#0f172a' },
  formGroup: { marginBottom: '12px' },
  label: { display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: '#475569' },
  input: { width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '13px' },
  submitBtn: { width: '100%', background: '#2563eb', color: 'white', padding: '10px', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', marginTop: '10px' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  tableHeader: { borderBottom: '2px solid #f1f5f9' },
  th: { padding: '10px', fontSize: '12px', color: '#64748b', fontWeight: 600 },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '12px 10px', fontSize: '13px' },
  badge: { padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 },
  btnAction: { background: '#2563eb', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  btnDelete: { background: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 },
  modalBox: { background: 'white', padding: '25px', borderRadius: '12px', width: '420px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' },
  modalDetailBox: { background: '#f8fafc', padding: '12px', borderRadius: '6px', borderLeft: '4px solid #ef4444', margin: '15px 0' },
  btnCancel: { background: '#e2e8f0', color: '#475569', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 },
  btnConfirmDelete: { background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }
};