import React from 'react';

export default function DeleteModal({ isOpen, item, onClose, onConfirm }) {
  if (!isOpen || !item) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 }}>
      <div style={{ background: 'white', padding: '25px', borderRadius: '12px', width: '420px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
        <h3 style={{ marginTop: 0, color: '#991b1b' }}>⚠️ Konfirmasi Verifikasi Hapus</h3>
        <p style={{ fontSize: '14px', color: '#475569' }}>Apakah Anda yakin ingin menghapus tiket ini secara permanen dari sistem?</p>
        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', borderLeft: '4px solid #ef4444', margin: '15px 0', fontSize: '13px' }}>
          <b>{item.title}</b>
          <br />
          <small style={{ color: '#64748b' }}>Pelapor: {item.customer_name} | Kategori: {item.category}</small>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button onClick={onClose} style={{ background: '#e2e8f0', color: '#475569', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
            Batal
          </button>
          <button onClick={onConfirm} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
            Ya, Hapus Data
          </button>
        </div>
      </div>
    </div>
  );
}