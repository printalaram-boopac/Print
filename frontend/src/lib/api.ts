import { getIdToken } from './firebase';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const BACKEND_ENABLED = true;

/**
 * Authenticated JSON fetch against the Express API. Exported so feature-level
 * services can reuse the auth + error handling instead of re-implementing it.
 */
export async function apiFetch(endpoint: string, _options: RequestInit = {}): Promise<any> {
  if (!BACKEND_ENABLED) {
    throw new Error('Backend is not available in this environment.');
  }

  const token = await getIdToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(_options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, { ..._options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'API request failed');
  return data;
}

// ─── Auth ───
export const syncUser = (body: { name?: string; phone?: string; avatarUrl?: string }) =>
  apiFetch('/api/auth/sync', { method: 'POST', body: JSON.stringify(body) });

export const getMe = () => apiFetch('/api/auth/me');

export const updateProfile = (body: {
  name?: string; phone?: string; address?: string;
  shippingName?: string; shippingPhone?: string;
  city?: string; state?: string; pincode?: string;
  avatarUrl?: string;
}) =>
  apiFetch('/api/auth/profile', { method: 'PATCH', body: JSON.stringify(body) });

export const getMyOrders = () => apiFetch('/api/auth/profile/orders');

export const getMyDesigns = () => apiFetch('/api/auth/profile/designs');

// ─── Orders ───
export const getOrders = (params?: { status?: string; search?: string; page?: number }) => {
  const q = new URLSearchParams();
  if (params?.status) q.set('status', params.status);
  if (params?.search) q.set('search', params.search);
  if (params?.page) q.set('page', String(params.page));
  return apiFetch(`/api/orders?${q.toString()}`);
};

export const getOrder = (id: string) => apiFetch(`/api/orders/${id}`);

export const createOrder = (body: {
  designId?: string;
  templateId?: string;
  quantity: number;
  unitPrice: number;
  shippingAddress: string;
  phone: string;
  customerName?: string;
  coupleName?: string;
  familyName?: string;
  greetingText?: string;
  isExpress?: boolean;
  theme?: string;
  occasion?: string;
  photoUrl?: string;
  designTitle?: string;
  shippingName?: string;
  city?: string;
  state?: string;
  pincode?: string;
}) =>
  apiFetch('/api/orders', { method: 'POST', body: JSON.stringify(body) });

export const updateOrderStatus = (id: string, body: { status: string; trackingNumber?: string; notes?: string }) =>
  apiFetch(`/api/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify(body) });

export const deleteOrder = (id: string) =>
  apiFetch(`/api/orders/${id}`, { method: 'DELETE' });

export const updateOrder = (id: string, body: any) =>
  apiFetch(`/api/orders/${id}`, { method: 'PATCH', body: JSON.stringify(body) });

// ─── Clients (Admin) ───
export const getClients = (params?: { search?: string; page?: number }) => {
  const q = new URLSearchParams();
  if (params?.search) q.set('search', params.search);
  if (params?.page) q.set('page', String(params.page));
  return apiFetch(`/api/clients?${q.toString()}`);
};

export const getClient = (id: string) => apiFetch(`/api/clients/${id}`);

export const createClient = (body: {
  name: string; email: string; phone?: string; address?: string; role?: string;
  shippingName?: string; shippingPhone?: string;
  city?: string; state?: string; pincode?: string;
}) =>
  apiFetch('/api/clients', { method: 'POST', body: JSON.stringify(body) });

export const updateClient = (id: string, body: {
  name?: string; phone?: string; address?: string; role?: string;
  shippingName?: string; shippingPhone?: string;
  city?: string; state?: string; pincode?: string;
}) =>
  apiFetch(`/api/clients/${id}`, { method: 'PATCH', body: JSON.stringify(body) });

export const updateClientRole = (id: string, role: string) =>
  apiFetch(`/api/clients/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) });

export const deleteClient = (id: string) =>
  apiFetch(`/api/clients/${id}`, { method: 'DELETE' });

// ─── Products (Admin CRUD) ───
export const getProducts = (params?: { category?: string; featured?: boolean; search?: string; page?: number }) => {
  const q = new URLSearchParams();
  if (params?.category) q.set('category', params.category);
  if (params?.featured) q.set('featured', 'true');
  if (params?.search) q.set('search', params.search);
  if (params?.page) q.set('page', String(params.page));
  return apiFetch(`/api/products?${q.toString()}`);
};

export const createProduct = (body: {
  title: string; description?: string; category: string;
  price: number; thumbnail: string; configJson?: string; isFeatured?: boolean;
}) =>
  apiFetch('/api/products', { method: 'POST', body: JSON.stringify(body) });

export const updateProduct = (id: string, body: any) =>
  apiFetch(`/api/products/${id}`, { method: 'PATCH', body: JSON.stringify(body) });

export const deleteProduct = (id: string) =>
  apiFetch(`/api/products/${id}`, { method: 'DELETE' });

// ─── Templates ───
export const getTemplates = (params?: { category?: string; featured?: boolean }) => {
  const q = new URLSearchParams();
  if (params?.category) q.set('category', params.category);
  if (params?.featured) q.set('featured', 'true');
  return apiFetch(`/api/templates?${q.toString()}`);
};

export const createTemplate = (body: any) =>
  apiFetch('/api/templates', { method: 'POST', body: JSON.stringify(body) });

export const updateTemplate = (id: string, body: any) =>
  apiFetch(`/api/templates/${id}`, { method: 'PATCH', body: JSON.stringify(body) });

export const deleteTemplate = (id: string) =>
  apiFetch(`/api/templates/${id}`, { method: 'DELETE' });

// ─── Payments ───
export const getPayments = (params?: { status?: string; page?: number }) => {
  const q = new URLSearchParams();
  if (params?.status) q.set('status', params.status);
  if (params?.page) q.set('page', String(params.page));
  return apiFetch(`/api/payments?${q.toString()}`);
};

// ─── Audit Logs ───
export const getAuditLogs = (page?: number) =>
  apiFetch(`/api/audit-logs?page=${page || 1}`);

// ─── Stats ───
export const getStats = () => apiFetch('/api/stats');

// ─── Analytics ───
export const getAnalyticsEvents = () => apiFetch('/api/analytics/events');
export const clearAnalyticsEvents = () => apiFetch('/api/analytics/clear', { method: 'DELETE' });
export const getGaConfig = () => apiFetch('/api/analytics/ga-config');
export const saveGaConfig = (measurementId: string, propertyId?: string) =>
  apiFetch('/api/analytics/ga-config', {
    method: 'POST',
    body: JSON.stringify({ measurementId, propertyId }),
  });

