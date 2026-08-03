import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getOrders } from '@/lib/api';
import { logUserEvent } from '@/lib/analytics';

// Admin dashboard components
import AdminStats from '@/components/dashboard/AdminStats';
import OrderTable from '@/components/dashboard/OrderTable';
import ClientList from '@/components/dashboard/ClientList';
import PaymentHistory from '@/components/dashboard/PaymentHistory';
import AuditLog from '@/components/dashboard/AuditLog';

// ─── Pricing Tiers (normal print covers) ───
const PRICING_TIERS = [
  { minQty: 1, maxQty: 50, pricePerPiece: 13 },
  { minQty: 51, maxQty: 100, pricePerPiece: 12 },
  { minQty: 101, maxQty: 200, pricePerPiece: 13 },
];

function getPricePerPiece(qty: number): number {
  const tier = PRICING_TIERS.find((t) => qty >= t.minQty && qty <= t.maxQty);
  return tier ? tier.pricePerPiece : 13;
}

// ─── Admin Tab Type ───
type AdminTab = 'orders' | 'clients' | 'payments' | 'audit';

const ADMIN_TABS: { key: AdminTab; label: string; icon: string }[] = [
  { key: 'orders', label: 'Orders', icon: '📦' },
  { key: 'clients', label: 'Clients', icon: '👥' },
  { key: 'payments', label: 'Payments', icon: '💳' },
  { key: 'audit', label: 'Audit Log', icon: '📋' },
];

// ─── Customer Order Interface ───
interface CustomerOrder {
  id: string;
  status: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  customerName: string | null;
  coupleName: string | null;
  greetingText: string | null;
  createdAt: string;
  design: { title: string; previewUrl: string | null } | null;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { dbUser, isAdmin, logout, loading: authLoading } = useAuth();

  const [adminTab, setAdminTab] = useState<AdminTab>('orders');
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
  const [customerLoading, setCustomerLoading] = useState(true);

  // Fetch customer's own orders
  useEffect(() => {
    if (dbUser && !isAdmin) {
      setCustomerLoading(true);
      getOrders()
        .then((res) => setCustomerOrders(res.orders || []))
        .catch(() => setCustomerOrders([]))
        .finally(() => setCustomerLoading(false));
    }
  }, [dbUser, isAdmin]);

  const handleLogout = async () => {
    logUserEvent('CLICK_LOGOUT', { source: 'dashboard' });
    await logout();
    navigate('/auth');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-gray-500">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black text-luxury-accent pt-28 md:pt-32 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ─── Header ─── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gold-200/30 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-display text-gold-gradient font-bold">
                {isAdmin ? 'Royal Command Center' : 'Customer Lounge'}
              </h1>
              <span className="text-[10px] uppercase bg-luxury-gold/10 border border-luxury-gold/30 px-2.5 py-0.5 rounded text-luxury-gold font-bold">
                {dbUser?.role || 'CUSTOMER'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Welcome back, <span className="text-luxury-accent font-medium">{dbUser?.name || 'User'}</span>
              <span className="mx-2 text-gray-300">•</span>
              <span className="text-gray-400">{dbUser?.email}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Admin Panel Button - ONLY VISIBLE TO ADMIN USERS */}
            {isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="px-4 py-2 bg-luxury-gold text-black text-xs font-bold uppercase tracking-wider hover:bg-gold-400 transition-all rounded-lg cursor-pointer flex items-center gap-2 shadow-lg shadow-gold-500/10"
              >
                <span>👑</span> Admin Panel
              </button>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600/10 border border-red-300/30 text-xs text-red-500 uppercase tracking-wider hover:bg-red-600 hover:text-white transition-all rounded-lg cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* ════════════════ ADMIN DASHBOARD ════════════════ */}
        {isAdmin && (
          <div className="space-y-8">
            {/* Stats */}
            <AdminStats />

            {/* Tab Navigation */}
            <div className="flex gap-1 bg-luxury-gray/50 p-1 rounded-lg w-fit">
              {ADMIN_TABS.map((tab) => (
                <button key={tab.key} onClick={() => setAdminTab(tab.key)}
                  className={`px-4 py-2 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center gap-2 ${
                    adminTab === tab.key
                      ? 'bg-white text-luxury-accent shadow-sm border border-gold-200'
                      : 'text-gray-500 hover:text-luxury-accent'
                  }`}>
                  <span>{tab.icon}</span> {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {adminTab === 'orders' && <OrderTable />}
            {adminTab === 'clients' && <ClientList />}
            {adminTab === 'payments' && <PaymentHistory />}
            {adminTab === 'audit' && <AuditLog />}
          </div>
        )}

        {/* ════════════════ CUSTOMER DASHBOARD ════════════════ */}
        {!isAdmin && (
          <div className="space-y-8">

            {/* Pricing Info Banner */}
            <div className="glass-card-gold p-5 rounded-lg">
              <h3 className="text-sm uppercase tracking-widest text-luxury-gold font-bold mb-3">Cover Pricing</h3>
              <div className="grid grid-cols-3 gap-4">
                {PRICING_TIERS.map((tier, i) => (
                  <div key={i} className="text-center p-3 bg-luxury-dark/30 rounded border border-gold-200/30">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                      {tier.minQty === 1 ? 'Up to' : ''} {tier.maxQty} Covers
                    </p>
                    <p className="text-xl font-bold text-luxury-gold mt-1">₹{tier.pricePerPiece}</p>
                    <p className="text-[9px] text-gray-400">per piece</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Order Tracking */}
            <div className="glass-panel p-6 rounded-lg space-y-6">
              <h2 className="text-lg font-display text-luxury-accent font-semibold">My Orders</h2>

              {customerLoading ? (
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => <div key={i} className="h-24 bg-gray-100/50 rounded animate-pulse" />)}
                </div>
              ) : customerOrders.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <p className="text-4xl mb-3">🎨</p>
                  <p>You don't have any orders yet.</p>
                  <button onClick={() => { logUserEvent('CLICK_START_DESIGNING', { source: 'dashboard_orders_empty' }); navigate('/designer'); }}
                    className="mt-3 text-luxury-gold text-xs underline cursor-pointer">
                    Start your first design
                  </button>
                </div>
              ) : (
                customerOrders.map((ord) => {
                  const statusSteps = ['PENDING', 'PAID', 'IN_PRODUCTION', 'PRINTED', 'SHIPPED', 'DELIVERED'];
                  const stepLabels = ['Received', 'Paid', 'Printing', 'Printed', 'Shipped', 'Delivered'];
                  const currentIndex = statusSteps.indexOf(ord.status);

                  return (
                    <div key={ord.id} className="space-y-5 border border-gold-200 p-4 rounded-lg bg-luxury-dark/30">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div>
                          <p className="text-xs text-luxury-gold font-mono font-bold">{ord.id.slice(0, 8)}...</p>
                          <h3 className="text-sm font-semibold text-luxury-accent">{ord.design?.title || 'Custom Design'}</h3>
                          <p className="text-[10px] text-gray-500">
                            Ordered: {new Date(ord.createdAt).toLocaleDateString('en-IN')} • Qty: {ord.quantity}
                            • ₹{getPricePerPiece(ord.quantity)}/pc
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Total</p>
                          <p className="text-sm font-bold text-luxury-accent">₹{ord.totalAmount.toLocaleString('en-IN')}</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {ord.status !== 'CANCELLED' && (
                        <div className="relative pt-4 pb-2">
                          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gold-200 -translate-y-1/2 rounded" />
                          <div className="absolute top-1/2 left-0 h-1 bg-luxury-gold -translate-y-1/2 rounded transition-all duration-500"
                            style={{ width: `${Math.max(0, (currentIndex / (statusSteps.length - 1)) * 100)}%` }} />
                          <div className="relative flex justify-between">
                            {stepLabels.map((stepName, stepIdx) => (
                              <div key={stepName} className="flex flex-col items-center gap-1.5">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${
                                  stepIdx <= currentIndex
                                    ? 'bg-luxury-gold text-luxury-accent border-luxury-gold'
                                    : 'bg-luxury-dark text-gray-500 border-gold-300'
                                }`}>{stepIdx + 1}</div>
                                <span className={`text-[8px] sm:text-[9px] uppercase tracking-wider ${
                                  stepIdx === currentIndex ? 'text-luxury-gold font-bold' : 'text-gray-500'
                                }`}>{stepName}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {ord.status === 'CANCELLED' && (
                        <div className="text-center py-3">
                          <span className="px-3 py-1 bg-red-50 border border-red-200 text-red-700 text-xs rounded font-medium">
                            ❌ Order Cancelled
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Referral Panel */}
            <div className="glass-panel p-6 rounded-lg space-y-4">
              <h3 className="text-sm uppercase tracking-widest text-luxury-gold font-bold">Invite Friends & Earn</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Share your luxury invite code. They get <span className="text-luxury-accent font-semibold">10% off</span>, you earn <span className="text-luxury-accent font-semibold">₹500 cash back</span> per wedding order.
              </p>
              <div className="flex gap-2 items-center bg-luxury-dark border border-gold-300 p-3 rounded">
                <div className="flex-1">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">Your Referral Code</p>
                  <p className="text-base font-bold text-luxury-accent tracking-widest">PA-{dbUser?.id?.slice(0, 6)?.toUpperCase() || 'XXXXXX'}</p>
                </div>
                <button onClick={() => {
                  logUserEvent('CLICK_COPY_REFERRAL_CODE', { source: 'dashboard' });
                  navigator.clipboard.writeText(`PA-${dbUser?.id?.slice(0, 6)?.toUpperCase() || 'XXXXXX'}`);
                }}
                  className="px-4 py-2 bg-gold-50 border border-gold-300 text-xs text-luxury-gold hover:bg-luxury-gold hover:text-luxury-accent transition-colors rounded cursor-pointer">
                  Copy Code
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
