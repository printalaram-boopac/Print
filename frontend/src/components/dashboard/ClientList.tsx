import { useEffect, useState } from 'react';
import { getClients } from '@/lib/api';

interface Client {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: string;
  lastLoginAt: string | null;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
  activeOrders: number;
}

export default function ClientList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  return (
    <div className="glass-panel p-6 rounded-lg space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gold-200 pb-4">
        <h2 className="text-lg font-display text-luxury-accent font-semibold">Client Directory</h2>
        <input type="text" placeholder="Search clients..." value={search}
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
          <p className="text-sm">No clients found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gold-200 text-gray-500">
                <th className="py-3 px-2">Client</th>
                <th className="py-3 px-2">Contact</th>
                <th className="py-3 px-2">Orders</th>
                <th className="py-3 px-2">Total Spent</th>
                <th className="py-3 px-2">Active</th>
                <th className="py-3 px-2">Last Seen</th>
                <th className="py-3 px-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-b border-gold-200/50 hover:bg-luxury-gray/30 transition-colors">
                  <td className="py-3 px-2">
                    <p className="font-semibold text-luxury-accent">{c.name}</p>
                    <p className="text-[10px] text-gray-500">Since {new Date(c.createdAt).toLocaleDateString('en-IN')}</p>
                  </td>
                  <td className="py-3 px-2">
                    <p className="text-luxury-accent">{c.email}</p>
                    {c.phone && <p className="text-[10px] text-gray-500">{c.phone}</p>}
                  </td>
                  <td className="py-3 px-2 font-bold">{c.totalOrders}</td>
                  <td className="py-3 px-2 font-bold text-luxury-gold">₹{c.totalSpent.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-2">
                    {c.activeOrders > 0 ? (
                      <span className="px-2 py-0.5 bg-green-50 border border-green-200 text-green-700 text-[10px] rounded font-medium">{c.activeOrders} active</span>
                    ) : (
                      <span className="text-gray-400 text-[10px]">—</span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-gray-500 text-[10px]">
                    {c.lastLoginAt ? new Date(c.lastLoginAt).toLocaleDateString('en-IN') : 'Never'}
                  </td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase border ${
                      c.role === 'ADMIN' ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}>{c.role}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-2">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}
            className="px-3 py-1 text-[10px] border border-gold-300 rounded text-luxury-gold hover:bg-gold-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent cursor-pointer">← Prev</button>
          <span className="px-3 py-1 text-[10px] text-gray-500">Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}
            className="px-3 py-1 text-[10px] border border-gold-300 rounded text-luxury-gold hover:bg-gold-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent cursor-pointer">Next →</button>
        </div>
      )}
    </div>
  );
}
