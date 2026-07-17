import { useEffect, useState, useCallback } from 'react';
import { getOrders, updateOrderStatus } from '@/lib/api';

interface Order {
  id: string;
  customerName: string | null;
  coupleName: string | null;
  familyName: string | null;
  greetingText: string | null;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: string;
  isExpress: boolean;
  trackingNumber: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string; phone: string | null };
  design: { id: string; title: string; previewUrl: string | null };
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

export default function OrderTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
    } catch (err) {
      alert('Failed to update status. Please try again.');
    }
  };

  return (
    <div className="glass-panel p-6 rounded-lg space-y-5">
      {/* Header + Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gold-200 pb-4">
        <h2 className="text-lg font-display text-luxury-accent font-semibold">Order Management</h2>
        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="text" placeholder="Search orders..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="bg-luxury-dark border border-gold-300 text-xs text-luxury-accent rounded px-3 py-1.5 focus:outline-none focus:border-luxury-gold w-48"
          />
          <select value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }}
            className="bg-luxury-dark border border-gold-300 text-xs text-luxury-accent rounded px-2 py-1.5 focus:outline-none focus:border-luxury-gold">
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s === 'ALL' ? 'All Status' : s.replace('_', ' ')}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100/50 rounded animate-pulse" />
          ))}
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
                <th className="py-3 px-2">Details</th>
                <th className="py-3 px-2">Qty</th>
                <th className="py-3 px-2">Amount</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-gold-200/50 hover:bg-luxury-gray/30 transition-colors">
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
                    {o.coupleName && <p className="text-luxury-accent font-medium">{o.coupleName}</p>}
                    {o.greetingText && <p className="text-[10px] text-luxury-gold italic">"{o.greetingText}"</p>}
                    <p className="text-[10px] text-gray-500">{o.design?.title || 'Custom Design'}</p>
                  </td>
                  <td className="py-4 px-2">{o.quantity}</td>
                  <td className="py-4 px-2 font-bold text-luxury-accent">₹{o.totalAmount.toLocaleString('en-IN')}</td>
                  <td className="py-4 px-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider border ${statusBadgeClass[o.status] || 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                      {o.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <select value={o.status} onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className="bg-luxury-dark border border-gold-300 text-[10px] text-luxury-accent rounded p-1 focus:outline-none focus:border-luxury-gold cursor-pointer">
                      {STATUS_OPTIONS.filter((s) => s !== 'ALL').map((s) => (
                        <option key={s} value={s}>{s.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-2">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}
            className="px-3 py-1 text-[10px] border border-gold-300 rounded text-luxury-gold disabled:opacity-30 cursor-pointer hover:bg-gold-50 transition-colors">
            ← Prev
          </button>
          <span className="px-3 py-1 text-[10px] text-gray-500">Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}
            className="px-3 py-1 text-[10px] border border-gold-300 rounded text-luxury-gold disabled:opacity-30 cursor-pointer hover:bg-gold-50 transition-colors">
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
