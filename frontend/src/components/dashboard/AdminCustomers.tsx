import { useEffect, useState } from 'react';
import { getClients, getClient, updateClient, deleteClient } from '@/lib/api';

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
      setEditingRole(null);
    } catch {
      alert('Failed to load client details.');
    } finally {
      setDetailLoading(false);
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
          <input type="text" placeholder="Search customers..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="bg-luxury-dark border border-gold-300 text-xs text-luxury-accent rounded px-3 py-1.5 focus:outline-none focus:border-luxury-gold w-52" />
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
              className="px-3 py-1 text-[10px] border border-gold-300 rounded text-luxury-gold disabled:opacity-30 cursor-pointer">← Prev</button>
            <span className="px-3 py-1 text-[10px] text-gray-500">Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}
              className="px-3 py-1 text-[10px] border border-gold-300 rounded text-luxury-gold disabled:opacity-30 cursor-pointer">Next →</button>
          </div>
        )}
      </div>

      {/* ═══ Client Detail Modal ═══ */}
      {(selectedClient || detailLoading) && (
        <div className="fixed inset-0 bg-black/60 z-[300] flex items-center justify-center p-4" onClick={() => setSelectedClient(null)}>
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
                          className="px-3 py-1 bg-luxury-gold text-luxury-accent text-[10px] rounded cursor-pointer font-bold">Save</button>
                        <button onClick={() => setEditingRole(null)}
                          className="px-3 py-1 text-[10px] text-gray-500 cursor-pointer">Cancel</button>
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
                <div className="flex gap-3 pt-2 border-t border-gold-200/30">
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
    </div>
  );
}
