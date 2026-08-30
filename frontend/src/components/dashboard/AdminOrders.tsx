import { useEffect, useState, useCallback } from 'react';
import { getOrders, updateOrderStatus, deleteOrder, getOrder, createOrder, updateOrder, getClients } from '@/lib/api';

interface Order {
  id: string;
  customerName: string | null;
  coupleName: string | null;
  familyName: string | null;
  greetingText: string | null;
  occasion: string | null;
  theme: string | null;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  shippingAddress: string;
  phone: string;
  status: string;
  isExpress: boolean;
  trackingNumber: string | null;
  notes: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string; phone: string | null; address: string | null };
  design: { id: string; title: string; previewUrl: string | null; theme: string | null; occasion: string | null; coupleName: string | null; familyName: string | null; greetingText: string | null } | null;
  payments: { id: string; status: string; amount: number }[];
}

const STATUS_OPTIONS = ['ALL', 'PENDING', 'PAID', 'IN_PRODUCTION', 'PRINTED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const statusBadgeClass: Record<string, string> = {
  PENDING: 'bg-blue-50 border-blue-200 text-blue-700',
  PAID: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  IN_PRODUCTION: 'bg-orange-50 border-orange-200 text-orange-700',
  PRINTED: 'bg-purple-50 border-purple-200 text-purple-700',
  SHIPPED: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  DELIVERED: 'bg-green-50 border-green-200 text-green-700',
  CANCELLED: 'bg-red-50 border-red-200 text-red-700',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Create & Edit Order Modal / Form states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [clients, setClients] = useState<{ id: string; name: string; email: string }[]>([]);
  const [clientsLoading, setClientsLoading] = useState(false);

  const [createForm, setCreateForm] = useState({
    userId: '',
    quantity: 1,
    unitPrice: 200,
    shippingAddress: '',
    phone: '',
    customerName: '',
    coupleName: '',
    familyName: '',
    greetingText: '',
    occasion: '',
    theme: '',
    isExpress: false,
    shippingName: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [editForm, setEditForm] = useState({
    quantity: 1,
    unitPrice: 200,
    shippingAddress: '',
    phone: '',
    customerName: '',
    coupleName: '',
    familyName: '',
    greetingText: '',
    occasion: '',
    theme: '',
    isExpress: false,
    trackingNumber: '',
    notes: '',
    status: 'PENDING',
  });

  const loadClients = async () => {
    setClientsLoading(true);
    try {
      const res = await getClients({ page: 1 });
      setClients(res.clients || []);
    } catch (err) {
      console.error('Failed to load clients', err);
    } finally {
      setClientsLoading(false);
    }
  };

  useEffect(() => {
    if (showCreateModal) {
      loadClients();
    }
  }, [showCreateModal]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getOrders({ status: filter !== 'ALL' ? filter : undefined, search: search || undefined, page });
      setOrders(res.orders);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [filter, search, page]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, { status: newStatus });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => prev ? { ...prev, status: newStatus } : null);
      }
    } catch {
      alert('Failed to update status.');
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm('Delete this order? This cannot be undone.')) return;
    try {
      await deleteOrder(orderId);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      setSelectedOrder(null);
    } catch {
      alert('Failed to delete order.');
    }
  };

  const openOrderDetail = async (orderId: string) => {
    setDetailLoading(true);
    try {
      const res = await getOrder(orderId);
      setSelectedOrder(res.order);
      setEditForm({
        quantity: res.order.quantity || 1,
        unitPrice: res.order.unitPrice || 200,
        shippingAddress: res.order.shippingAddress || '',
        phone: res.order.phone || '',
        customerName: res.order.customerName || res.order.user?.name || '',
        coupleName: res.order.coupleName || '',
        familyName: res.order.familyName || '',
        greetingText: res.order.greetingText || '',
        occasion: res.order.occasion || '',
        theme: res.order.theme || '',
        isExpress: res.order.isExpress || false,
        trackingNumber: res.order.trackingNumber || '',
        notes: res.order.notes || '',
        status: res.order.status || 'PENDING',
      });
    } catch {
      alert('Failed to load order details.');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.userId) {
      alert('Please select a customer.');
      return;
    }
    if (!createForm.shippingAddress || !createForm.phone) {
      alert('Shipping Address and Phone are required.');
      return;
    }
    try {
      await createOrder({
        ...createForm,
        quantity: Number(createForm.quantity),
        unitPrice: Number(createForm.unitPrice),
      });
      alert('Order created successfully!');
      setShowCreateModal(false);
      setCreateForm({
        userId: '',
        quantity: 1,
        unitPrice: 200,
        shippingAddress: '',
        phone: '',
        customerName: '',
        coupleName: '',
        familyName: '',
        greetingText: '',
        occasion: '',
        theme: '',
        isExpress: false,
        shippingName: '',
        city: '',
        state: '',
        pincode: '',
      });
      fetchOrders();
    } catch (err: any) {
      alert(err.message || 'Failed to create order');
    }
  };

  const handleEditOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      await updateOrder(selectedOrder.id, {
        ...editForm,
        quantity: Number(editForm.quantity),
        unitPrice: Number(editForm.unitPrice),
      });
      alert('Order updated successfully!');
      setShowEditModal(false);
      openOrderDetail(selectedOrder.id);
      fetchOrders();
    } catch (err: any) {
      alert(err.message || 'Failed to update order');
    }
  };

  return (
    <div className="space-y-5">
      {/* Header + Filters */}
      <div className="glass-panel p-6 rounded-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gold-200 pb-4 mb-5">
          <h2 className="text-lg font-display text-luxury-accent font-semibold">Order Management</h2>
          <div className="flex flex-wrap gap-2 items-center">
            <input type="text" placeholder="Search orders..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="bg-luxury-dark border border-gold-300 text-xs text-luxury-accent rounded px-3 py-1.5 focus:outline-none focus:border-luxury-gold w-48" />
            <select value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }}
              className="bg-luxury-dark border border-gold-300 text-xs text-luxury-accent rounded px-2 py-1.5 focus:outline-none focus:border-luxury-gold">
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s === 'ALL' ? 'All Status' : s.replace('_', ' ')}</option>)}
            </select>
            <button onClick={() => setShowCreateModal(true)}
              className="bg-luxury-gold text-luxury-black text-xs font-bold rounded px-4 py-1.5 hover:bg-luxury-gold/80 transition-colors cursor-pointer whitespace-nowrap">
              + Create Order
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-100/50 rounded animate-pulse" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-sm">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gold-200 text-gray-500">
                  <th className="py-3 px-2">Order ID</th>
                  <th className="py-3 px-2">Customer</th>
                  <th className="py-3 px-2">Design Details</th>
                  <th className="py-3 px-2">Qty</th>
                  <th className="py-3 px-2">Amount</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-gold-200/50 hover:bg-luxury-gray/30 transition-colors cursor-pointer"
                    onClick={() => openOrderDetail(o.id)}>
                    <td className="py-4 px-2">
                      <span className="font-mono font-bold text-luxury-gold text-[11px]">{o.id.slice(0, 8)}</span>
                      {o.isExpress && <span className="ml-1 text-[9px] text-orange-600">⚡</span>}
                      <p className="text-[10px] text-gray-500 mt-0.5">{new Date(o.createdAt).toLocaleDateString('en-IN')}</p>
                    </td>
                    <td className="py-4 px-2">
                      <p className="font-semibold text-luxury-accent">{o.customerName || o.user.name}</p>
                      <p className="text-[10px] text-gray-500">{o.user.email}</p>
                    </td>
                    <td className="py-4 px-2">
                      <p className="text-luxury-accent font-medium">{o.design?.title || 'Custom Design'}</p>
                      <div className="flex gap-2 mt-0.5">
                        {o.occasion && <span className="text-[9px] text-gray-500">🎉{o.occasion}</span>}
                        {o.theme && <span className="text-[9px] text-gray-500">🎨{o.theme}</span>}
                      </div>
                      {o.coupleName && <p className="text-[10px] text-luxury-gold">💑 {o.coupleName}</p>}
                    </td>
                    <td className="py-4 px-2 font-bold">{o.quantity}</td>
                    <td className="py-4 px-2 font-bold text-luxury-accent">₹{o.totalAmount.toLocaleString('en-IN')}</td>
                    <td className="py-4 px-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider border ${statusBadgeClass[o.status] || 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                        {o.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-right" onClick={(e) => e.stopPropagation()}>
                      <select value={o.status} onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        className="bg-luxury-dark border border-gold-300 text-[10px] text-luxury-accent rounded p-1 focus:outline-none focus:border-luxury-gold cursor-pointer">
                        {STATUS_OPTIONS.filter((s) => s !== 'ALL').map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-4">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}
              className="px-3 py-1 text-[10px] border border-gold-300 rounded text-luxury-gold hover:bg-gold-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent cursor-pointer">← Prev</button>
            <span className="px-3 py-1 text-[10px] text-gray-500">Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}
              className="px-3 py-1 text-[10px] border border-gold-300 rounded text-luxury-gold hover:bg-gold-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent cursor-pointer">Next →</button>
          </div>
        )}
      </div>

      {/* ═══ Order Detail Modal ═══ */}
      {(selectedOrder || detailLoading) && (
        <div className="fixed inset-0 bg-black/60 z-[300] flex items-center justify-center p-4 cursor-pointer" onClick={() => setSelectedOrder(null)}>
          <div className="bg-luxury-dark border border-gold-200 rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}>
            {detailLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
              </div>
            ) : selectedOrder && (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-display font-bold text-gold-gradient">Order Detail</h3>
                    <p className="text-xs font-mono text-luxury-gold">{selectedOrder.id}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-luxury-accent text-lg cursor-pointer">✕</button>
                </div>

                {/* Status */}
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded text-xs font-medium uppercase border ${statusBadgeClass[selectedOrder.status] || ''}`}>
                    {selectedOrder.status.replace('_', ' ')}
                  </span>
                  <select value={selectedOrder.status} onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                    className="bg-luxury-dark border border-gold-300 text-xs text-luxury-accent rounded px-2 py-1 cursor-pointer">
                    {STATUS_OPTIONS.filter((s) => s !== 'ALL').map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                  </select>
                </div>

                {/* Customer Info */}
                <div className="glass-card p-4 rounded-lg space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-luxury-gold">👤 Customer</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-gray-500">Name:</span> <span className="text-luxury-accent font-medium">{selectedOrder.customerName || selectedOrder.user.name}</span></div>
                    <div><span className="text-gray-500">Email:</span> <span className="text-luxury-accent">{selectedOrder.user.email}</span></div>
                    <div><span className="text-gray-500">Phone:</span> <span className="text-luxury-accent">{selectedOrder.phone}</span></div>
                    <div><span className="text-gray-500">Date:</span> <span className="text-luxury-accent">{new Date(selectedOrder.createdAt).toLocaleDateString('en-IN')}</span></div>
                  </div>
                </div>

                {/* Design Details */}
                <div className="glass-card p-4 rounded-lg space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-luxury-gold">🎨 Card Design Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-gray-500">Template:</span> <span className="text-luxury-accent font-medium">{selectedOrder.design?.title || 'Custom'}</span></div>
                    <div><span className="text-gray-500">Occasion:</span> <span className="text-luxury-accent">{selectedOrder.occasion || selectedOrder.design?.occasion || '—'}</span></div>
                    <div><span className="text-gray-500">Theme:</span> <span className="text-luxury-accent">{selectedOrder.theme || selectedOrder.design?.theme || '—'}</span></div>
                    <div><span className="text-gray-500">Quantity:</span> <span className="text-luxury-accent font-bold">{selectedOrder.quantity} pcs</span></div>
                  </div>
                  {(selectedOrder.coupleName || selectedOrder.design?.coupleName) && (
                    <p className="text-xs"><span className="text-gray-500">💑 Couple Name:</span> <span className="text-luxury-gold font-medium">{selectedOrder.coupleName || selectedOrder.design?.coupleName}</span></p>
                  )}
                  {(selectedOrder.familyName || selectedOrder.design?.familyName) && (
                    <p className="text-xs"><span className="text-gray-500">👨‍👩‍👦 Family:</span> <span className="text-luxury-accent">{selectedOrder.familyName || selectedOrder.design?.familyName}</span></p>
                  )}
                  {(selectedOrder.greetingText || selectedOrder.design?.greetingText) && (
                    <p className="text-xs"><span className="text-gray-500">✉️ Greeting:</span> <span className="text-luxury-accent italic">"{selectedOrder.greetingText || selectedOrder.design?.greetingText}"</span></p>
                  )}
                </div>

                {/* Shipping */}
                <div className="glass-card p-4 rounded-lg space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-luxury-gold">📍 Shipping Address</h4>
                  <p className="text-xs text-luxury-accent">{selectedOrder.shippingAddress}</p>
                  <p className="text-xs text-gray-500">📞 {selectedOrder.phone}</p>
                  {selectedOrder.trackingNumber && (
                    <p className="text-xs text-green-600 font-medium">🚚 Tracking: {selectedOrder.trackingNumber}</p>
                  )}
                </div>

                {/* Pricing */}
                <div className="glass-card p-4 rounded-lg space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-luxury-gold">💰 Payment</h4>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">₹{selectedOrder.unitPrice} × {selectedOrder.quantity}</span>
                    <span className="text-luxury-accent font-bold">₹{selectedOrder.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  {selectedOrder.payments.length > 0 && (
                    <div className="border-t border-gold-200/30 pt-2 space-y-1">
                      {selectedOrder.payments.map((p) => (
                        <div key={p.id} className="flex justify-between text-[10px]">
                          <span className="text-gray-500">Payment {p.id.slice(0, 6)}</span>
                          <span className={p.status === 'SUCCESS' ? 'text-green-600' : 'text-yellow-600'}>{p.status} — ₹{p.amount}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                 {/* Actions */}
                <div className="flex justify-between items-center pt-2">
                  <button onClick={() => setShowEditModal(true)}
                    className="px-4 py-2 bg-luxury-gold text-luxury-black font-bold text-xs rounded hover:bg-luxury-gold/80 cursor-pointer transition-colors">
                    ✏️ Edit Details
                  </button>
                  <button onClick={() => handleDelete(selectedOrder.id)}
                    className="px-4 py-2 bg-red-50 border border-red-300 text-xs text-red-700 rounded hover:bg-red-100 cursor-pointer transition-colors">
                    🗑️ Delete Order
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ═══ Create Order Modal ═══ */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 z-[300] flex items-center justify-center p-4 cursor-pointer" onClick={() => setShowCreateModal(false)}>
          <div className="bg-luxury-dark border border-gold-200 rounded-xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 text-left"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gold-200/30 pb-3">
              <h3 className="text-base font-display font-bold text-gold-gradient">Create New Order</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-luxury-accent text-lg cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleCreateOrder} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-500 mb-1">Select Customer *</label>
                {clientsLoading ? (
                  <p className="text-xs text-gray-400">Loading customers...</p>
                ) : (
                  <select required value={createForm.userId} onChange={(e) => {
                    const selected = clients.find(c => c.id === e.target.value);
                    setCreateForm({
                      ...createForm,
                      userId: e.target.value,
                      customerName: selected ? selected.name : ''
                    });
                  }}
                    className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold">
                    <option value="">-- Choose Customer --</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                    ))}
                  </select>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 mb-1">Quantity *</label>
                  <input type="number" required min="1" value={createForm.quantity} onChange={(e) => setCreateForm({...createForm, quantity: parseInt(e.target.value) || 1})}
                    className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Unit Price (Rs) *</label>
                  <input type="number" required min="0" value={createForm.unitPrice} onChange={(e) => setCreateForm({...createForm, unitPrice: parseInt(e.target.value) || 200})}
                    className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 mb-1">Phone *</label>
                  <input type="text" required value={createForm.phone} onChange={(e) => setCreateForm({...createForm, phone: e.target.value})}
                    className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold" />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 text-luxury-accent cursor-pointer">
                    <input type="checkbox" checked={createForm.isExpress} onChange={(e) => setCreateForm({...createForm, isExpress: e.target.checked})}
                      className="accent-luxury-gold" />
                    <span>⚡ Express Shipping (+₹100)</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Shipping Address *</label>
                <textarea required value={createForm.shippingAddress} onChange={(e) => setCreateForm({...createForm, shippingAddress: e.target.value})}
                  className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold h-16 resize-none" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-gray-500 mb-1">City</label>
                  <input type="text" value={createForm.city} onChange={(e) => setCreateForm({...createForm, city: e.target.value})}
                    className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">State</label>
                  <input type="text" value={createForm.state} onChange={(e) => setCreateForm({...createForm, state: e.target.value})}
                    className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Pincode</label>
                  <input type="text" value={createForm.pincode} onChange={(e) => setCreateForm({...createForm, pincode: e.target.value})}
                    className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold" />
                </div>
              </div>
              <div className="border-t border-gold-200/20 pt-3 space-y-3">
                <h4 className="text-[10px] font-bold text-luxury-gold uppercase tracking-wider">Personalization</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-500 mb-1">Couple Name (optional)</label>
                    <input type="text" placeholder="e.g. Rahul & Neha" value={createForm.coupleName} onChange={(e) => setCreateForm({...createForm, coupleName: e.target.value})}
                      className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">Occasion (optional)</label>
                    <input type="text" placeholder="e.g. Wedding, Anniversary" value={createForm.occasion} onChange={(e) => setCreateForm({...createForm, occasion: e.target.value})}
                      className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-500 mb-1">Theme (optional)</label>
                    <input type="text" placeholder="e.g. Golden Royal, Floral" value={createForm.theme} onChange={(e) => setCreateForm({...createForm, theme: e.target.value})}
                      className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">Greeting Text (optional)</label>
                    <input type="text" placeholder="e.g. Happy Married Life" value={createForm.greetingText} onChange={(e) => setCreateForm({...createForm, greetingText: e.target.value})}
                      className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-gold-200/30">
                <button type="button" onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gold-300 rounded text-gray-500 hover:text-luxury-accent transition-colors cursor-pointer">Cancel</button>
                <button type="submit"
                  className="px-4 py-2 bg-luxury-gold text-luxury-black font-bold rounded hover:bg-luxury-gold/80 transition-colors cursor-pointer">Create Order</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ Edit Order Modal ═══ */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 z-[310] flex items-center justify-center p-4 cursor-pointer" onClick={() => setShowEditModal(false)}>
          <div className="bg-luxury-dark border border-gold-200 rounded-xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 text-left"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gold-200/30 pb-3">
              <h3 className="text-base font-display font-bold text-gold-gradient">Edit Order Details</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-luxury-accent text-lg cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleEditOrder} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 mb-1">Quantity *</label>
                  <input type="number" required min="1" value={editForm.quantity} onChange={(e) => setEditForm({...editForm, quantity: parseInt(e.target.value) || 1})}
                    className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Unit Price (Rs) *</label>
                  <input type="number" required min="0" value={editForm.unitPrice} onChange={(e) => setEditForm({...editForm, unitPrice: parseInt(e.target.value) || 200})}
                    className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 mb-1">Phone *</label>
                  <input type="text" required value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Status *</label>
                  <select value={editForm.status} onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                    className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold">
                    <option value="PENDING">PENDING</option>
                    <option value="PAID">PAID</option>
                    <option value="IN_PRODUCTION">IN_PRODUCTION</option>
                    <option value="PRINTED">PRINTED</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Shipping Address *</label>
                <textarea required value={editForm.shippingAddress} onChange={(e) => setEditForm({...editForm, shippingAddress: e.target.value})}
                  className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold h-16 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 mb-1">Tracking Number</label>
                  <input type="text" value={editForm.trackingNumber} onChange={(e) => setEditForm({...editForm, trackingNumber: e.target.value})}
                    className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold" />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 text-luxury-accent cursor-pointer">
                    <input type="checkbox" checked={editForm.isExpress} onChange={(e) => setEditForm({...editForm, isExpress: e.target.checked})}
                      className="accent-luxury-gold" />
                    <span>⚡ Express Shipping (+₹100)</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Internal Admin Notes</label>
                <textarea value={editForm.notes} onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                  className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold h-16 resize-none" />
              </div>
              <div className="border-t border-gold-200/20 pt-3 space-y-3">
                <h4 className="text-[10px] font-bold text-luxury-gold uppercase tracking-wider">Personalization</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-500 mb-1">Couple Name</label>
                    <input type="text" value={editForm.coupleName} onChange={(e) => setEditForm({...editForm, coupleName: e.target.value})}
                      className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">Occasion</label>
                    <input type="text" value={editForm.occasion} onChange={(e) => setEditForm({...editForm, occasion: e.target.value})}
                      className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-500 mb-1">Theme</label>
                    <input type="text" value={editForm.theme} onChange={(e) => setEditForm({...editForm, theme: e.target.value})}
                      className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">Greeting Text</label>
                    <input type="text" value={editForm.greetingText} onChange={(e) => setEditForm({...editForm, greetingText: e.target.value})}
                      className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-gold-200/30">
                <button type="button" onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gold-300 rounded text-gray-500 hover:text-luxury-accent transition-colors cursor-pointer">Cancel</button>
                <button type="submit"
                  className="px-4 py-2 bg-luxury-gold text-luxury-black font-bold rounded hover:bg-luxury-gold/80 transition-colors cursor-pointer">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
