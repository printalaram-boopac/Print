import { useEffect, useState } from 'react';
import { getClients, getClient, updateClient, deleteClient, createClient } from '@/lib/api';

interface ClientSummary {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  address: string | null;
  role: string;
  city: string | null;
  state: string | null;
  pincode: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
  activeOrders: number;
}

interface ClientDetail {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  address: string | null;
  avatarUrl: string | null;
  role: string;
  shippingName: string | null;
  shippingPhone: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  orders: any[];
  designs: any[];
  reviews: any[];
  referrals: any[];
}

export default function AdminCustomers() {
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedClient, setSelectedClient] = useState<ClientDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [editingRole, setEditingRole] = useState<string | null>(null);

  // Modals and forms state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '', email: '', phone: '', address: '', role: 'CUSTOMER',
    shippingName: '', shippingPhone: '', city: '', state: '', pincode: ''
  });
  const [editForm, setEditForm] = useState({
    name: '', email: '', phone: '', address: '', role: 'CUSTOMER',
    shippingName: '', shippingPhone: '', city: '', state: '', pincode: ''
  });

  useEffect(() => {
    setLoading(true);
    getClients({ search: search || undefined, page })
      .then((res) => {
        setClients(res.clients);
        setTotalPages(res.pagination?.totalPages || 1);
      })
      .catch(() => setClients([]))
      .finally(() => setLoading(false));
  }, [search, page]);

  const openClientDetail = async (clientId: string) => {
    setDetailLoading(true);
    try {
      const res = await getClient(clientId);
      setSelectedClient(res.client);
      setEditForm({
        name: res.client.name || '',
        email: res.client.email || '',
        phone: res.client.phone || '',
        address: res.client.address || '',
        role: res.client.role || 'CUSTOMER',
        shippingName: res.client.shippingName || '',
        shippingPhone: res.client.shippingPhone || '',
        city: res.client.city || '',
        state: res.client.state || '',
        pincode: res.client.pincode || '',
      });
      setEditingRole(null);
    } catch {
      alert('Failed to load client details.');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name || !createForm.email) {
      alert('Name and Email are required.');
      return;
    }
    try {
      await createClient(createForm);
      alert('Customer created successfully!');
      setShowCreateModal(false);
      setCreateForm({
        name: '', email: '', phone: '', address: '', role: 'CUSTOMER',
        shippingName: '', shippingPhone: '', city: '', state: '', pincode: ''
      });
      // Refresh list
      setPage(1);
      const resList = await getClients({ search: search || undefined, page: 1 });
      setClients(resList.clients);
      setTotalPages(resList.pagination?.totalPages || 1);
    } catch (err: any) {
      alert(err.message || 'Failed to create customer');
    }
  };

  const handleEditCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;
    try {
      await updateClient(selectedClient.id, editForm);
      alert('Customer updated successfully!');
      setShowEditModal(false);
      // Reload details and list
      openClientDetail(selectedClient.id);
      const resList = await getClients({ search: search || undefined, page });
      setClients(resList.clients);
    } catch (err: any) {
      alert(err.message || 'Failed to update customer');
    }
  };

  const handleRoleChange = async (clientId: string, newRole: string) => {
    try {
      await updateClient(clientId, { role: newRole });
      setClients((prev) => prev.map((c) => c.id === clientId ? { ...c, role: newRole } : c));
      if (selectedClient?.id === clientId) {
        setSelectedClient((prev) => prev ? { ...prev, role: newRole } : null);
      }
      setEditingRole(null);
    } catch {
      alert('Failed to update role.');
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Delete this customer? This will remove ALL their data including orders. Cannot be undone!')) return;
    try {
      await deleteClient(clientId);
      setClients((prev) => prev.filter((c) => c.id !== clientId));
      setSelectedClient(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete client.');
    }
  };

  const statusBadge: Record<string, string> = {
    PENDING: 'bg-blue-50 border-blue-200 text-blue-700',
    PAID: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    IN_PRODUCTION: 'bg-orange-50 border-orange-200 text-orange-700',
    PRINTED: 'bg-purple-50 border-purple-200 text-purple-700',
    SHIPPED: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    DELIVERED: 'bg-green-50 border-green-200 text-green-700',
    CANCELLED: 'bg-red-50 border-red-200 text-red-700',
  };

  return (
    <div className="space-y-5">
      <div className="glass-panel p-6 rounded-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gold-200 pb-4 mb-5">
          <h2 className="text-lg font-display text-luxury-accent font-semibold">Customer Directory</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <input type="text" placeholder="Search customers..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="bg-luxury-dark border border-gold-300 text-xs text-luxury-accent rounded px-3 py-1.5 focus:outline-none focus:border-luxury-gold w-full sm:w-52" />
            <button onClick={() => setShowCreateModal(true)}
              className="bg-luxury-gold text-luxury-black text-xs font-bold rounded px-4 py-1.5 hover:bg-luxury-gold/80 transition-colors cursor-pointer whitespace-nowrap">
              + Add Customer
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-gray-100/50 rounded animate-pulse" />)}
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p className="text-3xl mb-2">👤</p>
            <p className="text-sm">No customers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gold-200 text-gray-500">
                  <th className="py-3 px-2">Customer</th>
                  <th className="py-3 px-2">Contact</th>
                  <th className="py-3 px-2">Location</th>
                  <th className="py-3 px-2">Orders</th>
                  <th className="py-3 px-2">Total Spent</th>
                  <th className="py-3 px-2">Active</th>
                  <th className="py-3 px-2">Role</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.id} className="border-b border-gold-200/50 hover:bg-luxury-gray/30 transition-colors cursor-pointer"
                    onClick={() => openClientDetail(c.id)}>
                    <td className="py-3 px-2">
                      <p className="font-semibold text-luxury-accent">{c.name}</p>
                      <p className="text-[10px] text-gray-500">Since {new Date(c.createdAt).toLocaleDateString('en-IN')}</p>
                    </td>
                    <td className="py-3 px-2">
                      <p className="text-luxury-accent">{c.email}</p>
                      {c.phone && <p className="text-[10px] text-gray-500">{c.phone}</p>}
                    </td>
                    <td className="py-3 px-2 text-[10px] text-gray-500">
                      {[c.city, c.state].filter(Boolean).join(', ') || '—'}
                    </td>
                    <td className="py-3 px-2 font-bold">{c.totalOrders}</td>
                    <td className="py-3 px-2 font-bold text-luxury-gold">₹{c.totalSpent.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-2">
                      {c.activeOrders > 0 ? (
                        <span className="px-2 py-0.5 bg-green-50 border border-green-200 text-green-700 text-[10px] rounded font-medium">{c.activeOrders} active</span>
                      ) : <span className="text-gray-400 text-[10px]">—</span>}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase border ${
                        c.role === 'ADMIN' ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-gray-50 border-gray-200 text-gray-600'
                      }`}>{c.role}</span>
                    </td>
                    <td className="py-3 px-2 text-right" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => openClientDetail(c.id)}
                        className="px-2 py-1 text-[10px] border border-gold-300 text-luxury-gold rounded hover:bg-gold-50 cursor-pointer">
                        View
                      </button>
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

      {/* ═══ Client Detail Modal ═══ */}
      {(selectedClient || detailLoading) && (
        <div className="fixed inset-0 bg-black/60 z-[300] flex items-center justify-center p-4 cursor-pointer" onClick={() => setSelectedClient(null)}>
          <div className="bg-luxury-dark border border-gold-200 rounded-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}>
            {detailLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
              </div>
            ) : selectedClient && (
              <>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-luxury-gold flex items-center justify-center text-lg font-bold text-luxury-accent">
                      {selectedClient.avatarUrl ? (
                        <img src={selectedClient.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : selectedClient.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-bold text-gold-gradient">{selectedClient.name}</h3>
                      <p className="text-xs text-gray-500">{selectedClient.email}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedClient(null)} className="text-gray-500 hover:text-luxury-accent text-lg cursor-pointer">✕</button>
                </div>

                {/* Profile Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-4 rounded-lg space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-luxury-gold">Contact Info</h4>
                    <div className="text-xs space-y-1">
                      <p><span className="text-gray-500">Phone:</span> <span className="text-luxury-accent">{selectedClient.phone || '—'}</span></p>
                      <p><span className="text-gray-500">Member Since:</span> <span className="text-luxury-accent">{new Date(selectedClient.createdAt).toLocaleDateString('en-IN')}</span></p>
                      <p><span className="text-gray-500">Last Login:</span> <span className="text-luxury-accent">{selectedClient.lastLoginAt ? new Date(selectedClient.lastLoginAt).toLocaleDateString('en-IN') : 'Never'}</span></p>
                    </div>
                  </div>
                  <div className="glass-card p-4 rounded-lg space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-luxury-gold">Shipping Address</h4>
                    <div className="text-xs space-y-1 text-luxury-accent">
                      {selectedClient.address ? (
                        <>
                          <p>{selectedClient.address}</p>
                          <p>{[selectedClient.city, selectedClient.state, selectedClient.pincode].filter(Boolean).join(', ')}</p>
                        </>
                      ) : <p className="text-gray-500 italic">No address saved</p>}
                    </div>
                  </div>
                </div>

                {/* Role Management */}
                <div className="glass-card p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-luxury-gold">Role</h4>
                      <span className={`mt-1 inline-block px-3 py-1 rounded text-xs font-medium uppercase border ${
                        selectedClient.role === 'ADMIN' ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-gray-50 border-gray-200 text-gray-600'
                      }`}>{selectedClient.role}</span>
                    </div>
                    {editingRole !== null ? (
                      <div className="flex items-center gap-2">
                        <select value={editingRole} onChange={(e) => setEditingRole(e.target.value)}
                          className="bg-luxury-dark border border-gold-300 text-xs text-luxury-accent rounded px-2 py-1">
                          {['CUSTOMER', 'DESIGNER', 'PRINTER', 'ADMIN'].map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <button onClick={() => handleRoleChange(selectedClient.id, editingRole)}
                          className="px-3 py-1 bg-luxury-gold text-luxury-accent text-[10px] rounded cursor-pointer font-bold hover:bg-luxury-gold/80 transition-colors">Save</button>
                        <button onClick={() => setEditingRole(null)}
                          className="px-3 py-1 text-[10px] text-gray-500 cursor-pointer hover:text-luxury-accent transition-colors">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setEditingRole(selectedClient.role)}
                        className="px-3 py-1 text-[10px] border border-gold-300 text-luxury-gold rounded cursor-pointer hover:bg-gold-50">
                        Change Role
                      </button>
                    )}
                  </div>
                </div>

                {/* Orders */}
                <div className="glass-card p-4 rounded-lg space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-luxury-gold">📦 Orders ({selectedClient.orders.length})</h4>
                  {selectedClient.orders.length === 0 ? (
                    <p className="text-xs text-gray-500 italic">No orders yet</p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {selectedClient.orders.map((o: any) => (
                        <div key={o.id} className="flex items-center justify-between border border-gold-200/30 rounded p-2 text-xs">
                          <div>
                            <p className="font-mono text-luxury-gold text-[10px]">{o.id.slice(0, 8)}</p>
                            <p className="text-luxury-accent">{o.design?.title || 'Custom'} • Qty: {o.quantity}</p>
                            {o.coupleName && <p className="text-[10px] text-gray-500">💑 {o.coupleName}</p>}
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-luxury-accent">₹{o.totalAmount?.toLocaleString('en-IN')}</p>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] border ${statusBadge[o.status] || 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                              {o.status?.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Designs */}
                {selectedClient.designs.length > 0 && (
                  <div className="glass-card p-4 rounded-lg space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-luxury-gold">🎨 Designs ({selectedClient.designs.length})</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedClient.designs.map((d: any) => (
                        <div key={d.id} className="border border-gold-200/30 rounded p-2 text-center">
                          <p className="text-[10px] text-luxury-accent font-medium truncate">{d.title}</p>
                          <div className="flex gap-1 justify-center mt-1">
                            {d.occasion && <span className="text-[8px] bg-gold-50 px-1 rounded">{d.occasion}</span>}
                            {d.theme && <span className="text-[8px] bg-luxury-gray px-1 rounded">{d.theme}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center pt-2 border-t border-gold-200/30">
                  <button onClick={() => setShowEditModal(true)}
                    className="px-4 py-2 bg-luxury-gold text-luxury-black font-bold text-xs rounded hover:bg-luxury-gold/80 cursor-pointer transition-colors">
                    ✏️ Edit Details
                  </button>
                  <button onClick={() => handleDeleteClient(selectedClient.id)}
                    className="px-4 py-2 bg-red-50 border border-red-300 text-xs text-red-700 rounded hover:bg-red-100 cursor-pointer transition-colors">
                    🗑️ Delete Customer
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ═══ Create Customer Modal ═══ */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 z-[300] flex items-center justify-center p-4 cursor-pointer" onClick={() => setShowCreateModal(false)}>
          <div className="bg-luxury-dark border border-gold-200 rounded-xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 text-left"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gold-200/30 pb-3">
              <h3 className="text-base font-display font-bold text-gold-gradient">Create New Customer</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-luxury-accent text-lg cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 mb-1">Name *</label>
                  <input type="text" required value={createForm.name} onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                    className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Email *</label>
                  <input type="email" required value={createForm.email} onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                    className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 mb-1">Phone</label>
                  <input type="text" value={createForm.phone} onChange={(e) => setCreateForm({...createForm, phone: e.target.value})}
                    className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Role</label>
                  <select value={createForm.role} onChange={(e) => setCreateForm({...createForm, role: e.target.value})}
                    className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold">
                    <option value="CUSTOMER">CUSTOMER</option>
                    <option value="DESIGNER">DESIGNER</option>
                    <option value="PRINTER">PRINTER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Address</label>
                <textarea value={createForm.address} onChange={(e) => setCreateForm({...createForm, address: e.target.value})}
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
                <h4 className="text-[10px] font-bold text-luxury-gold uppercase tracking-wider">Default Shipping Contact</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-500 mb-1">Shipping Name</label>
                    <input type="text" value={createForm.shippingName} onChange={(e) => setCreateForm({...createForm, shippingName: e.target.value})}
                      className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">Shipping Phone</label>
                    <input type="text" value={createForm.shippingPhone} onChange={(e) => setCreateForm({...createForm, shippingPhone: e.target.value})}
                      className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-gold-200/30">
                <button type="button" onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gold-300 rounded text-gray-500 hover:text-luxury-accent transition-colors cursor-pointer">Cancel</button>
                <button type="submit"
                  className="px-4 py-2 bg-luxury-gold text-luxury-black font-bold rounded hover:bg-luxury-gold/80 transition-colors cursor-pointer">Create Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ Edit Customer Modal ═══ */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 z-[310] flex items-center justify-center p-4 cursor-pointer" onClick={() => setShowEditModal(false)}>
          <div className="bg-luxury-dark border border-gold-200 rounded-xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 text-left"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gold-200/30 pb-3">
              <h3 className="text-base font-display font-bold text-gold-gradient">Edit Customer Details</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-luxury-accent text-lg cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleEditCustomer} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 mb-1">Name *</label>
                  <input type="text" required value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Email *</label>
                  <input type="email" required value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 mb-1">Phone</label>
                  <input type="text" value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Role</label>
                  <select value={editForm.role} onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                    className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold">
                    <option value="CUSTOMER">CUSTOMER</option>
                    <option value="DESIGNER">DESIGNER</option>
                    <option value="PRINTER">PRINTER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Address</label>
                <textarea value={editForm.address} onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                  className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold h-16 resize-none" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-gray-500 mb-1">City</label>
                  <input type="text" value={editForm.city} onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                    className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">State</label>
                  <input type="text" value={editForm.state} onChange={(e) => setEditForm({...editForm, state: e.target.value})}
                    className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Pincode</label>
                  <input type="text" value={editForm.pincode} onChange={(e) => setEditForm({...editForm, pincode: e.target.value})}
                    className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold" />
                </div>
              </div>
              <div className="border-t border-gold-200/20 pt-3 space-y-3">
                <h4 className="text-[10px] font-bold text-luxury-gold uppercase tracking-wider">Default Shipping Contact</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-500 mb-1">Shipping Name</label>
                    <input type="text" value={editForm.shippingName} onChange={(e) => setEditForm({...editForm, shippingName: e.target.value})}
                      className="w-full bg-luxury-black border border-gold-300 rounded p-2 text-luxury-accent focus:outline-none focus:border-luxury-gold" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">Shipping Phone</label>
                    <input type="text" value={editForm.shippingPhone} onChange={(e) => setEditForm({...editForm, shippingPhone: e.target.value})}
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
