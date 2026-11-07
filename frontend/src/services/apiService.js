export const fetchOrdersApi = async (search = '', status = 'All') => {
  const query = new URLSearchParams({ search, status }).toString();
  const res = await fetch(`/api/orders?${query}`);
  return await res.json();
};

export const createOrderApi = async (formData) => {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  return await res.json();
};

export const updateOrderStatusApi = async (id, nextStatus) => {
  const res = await fetch(`/api/orders/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: nextStatus })
  });
  return await res.json();
};

export const deleteOrderApi = async (id) => {
  const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
  return await res.json();
};