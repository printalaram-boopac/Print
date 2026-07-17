import { useEffect, useState } from 'react';
import { getPayments } from '@/lib/api';

interface Payment {
  id: string;
  razorpayOrderId: string;
  razorpayPaymentId: string | null;
  amount: number;
  status: string;
  createdAt: string;
  order: {
    id: string;
    customerName: string | null;
    totalAmount: number;
    status: string;
    user: { name: string; email: string };
  };
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  SUCCESS: 'bg-green-50 border-green-200 text-green-700',
  FAILED: 'bg-red-50 border-red-200 text-red-700',
  REFUNDED: 'bg-purple-50 border-purple-200 text-purple-700',
};

export default function PaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    setLoading(true);
    getPayments({ status: filter !== 'ALL' ? filter : undefined })
      .then((res) => setPayments(res.payments))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="glass-panel p-6 rounded-lg space-y-5">
      <div className="flex justify-between items-center border-b border-gold-200 pb-4">
        <h2 className="text-lg font-display text-luxury-accent font-semibold">Payment Records</h2>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          className="bg-luxury-dark border border-gold-300 text-xs text-luxury-accent rounded px-2 py-1.5 focus:outline-none focus:border-luxury-gold">
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="SUCCESS">Success</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-gray-100/50 rounded animate-pulse" />)}
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <p className="text-3xl mb-2">💳</p>
          <p className="text-sm">No payment records found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gold-200 text-gray-500">
                <th className="py-3 px-2">Razorpay ID</th>
                <th className="py-3 px-2">Customer</th>
                <th className="py-3 px-2">Amount</th>
                <th className="py-3 px-2">Payment Status</th>
                <th className="py-3 px-2">Order Status</th>
                <th className="py-3 px-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-gold-200/50 hover:bg-luxury-gray/30 transition-colors">
                  <td className="py-3 px-2">
                    <p className="font-mono text-[11px] text-luxury-gold">{p.razorpayOrderId}</p>
                    {p.razorpayPaymentId && (
                      <p className="font-mono text-[9px] text-gray-400">{p.razorpayPaymentId}</p>
                    )}
                  </td>
                  <td className="py-3 px-2">
                    <p className="font-semibold text-luxury-accent">{p.order.customerName || p.order.user.name}</p>
                    <p className="text-[10px] text-gray-500">{p.order.user.email}</p>
                  </td>
                  <td className="py-3 px-2 font-bold text-luxury-accent">₹{p.amount.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase border ${statusColors[p.status] || ''}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-[10px] text-gray-500">{p.order.status.replace('_', ' ')}</td>
                  <td className="py-3 px-2 text-[10px] text-gray-500">
                    {new Date(p.createdAt).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
