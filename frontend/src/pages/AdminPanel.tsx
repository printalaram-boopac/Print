import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

// Admin components
import AdminStats from '@/components/dashboard/AdminStats';
import AdminOrders from '@/components/dashboard/AdminOrders';
import AdminCustomers from '@/components/dashboard/AdminCustomers';
import AdminProductManager from '@/components/dashboard/AdminProductManager';
import PaymentHistory from '@/components/dashboard/PaymentHistory';
import AuditLog from '@/components/dashboard/AuditLog';
import AdminAnalytics from '@/components/dashboard/AdminAnalytics';

type AdminTab = 'overview' | 'orders' | 'customers' | 'products' | 'payments' | 'audit' | 'analytics';

const ADMIN_TABS: { key: AdminTab; label: string; icon: string }[] = [
  { key: 'overview', label: 'Overview', icon: '📊' },
  { key: 'analytics', label: 'Visitor Events', icon: '📈' },
  { key: 'orders', label: 'Orders', icon: '📦' },
  { key: 'customers', label: 'Customers', icon: '👥' },
  { key: 'products', label: 'Products', icon: '🛍️' },
  { key: 'payments', label: 'Payments', icon: '💳' },
  { key: 'audit', label: 'Audit Log', icon: '📋' },
];

export default function AdminPanel() {
  const navigate = useNavigate();
  const { dbUser, logout, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-gray-500">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black text-luxury-accent">
      <div className="flex">
        {/* ─── Sidebar ─── */}
        <aside className="fixed left-0 top-0 w-64 h-full bg-luxury-dark border-r border-gold-200/30 z-50 flex flex-col">
          {/* Logo Area */}
          <div className="p-6 border-b border-gold-200/30">
            <h1 className="text-xl font-display font-bold text-gold-gradient">PrintAlarm</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Admin Control Center</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {ADMIN_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  activeTab === tab.key
                    ? 'bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/30'
                    : 'text-gray-500 hover:text-luxury-accent hover:bg-luxury-gray/50'
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Admin User Info */}
          <div className="p-4 border-t border-gold-200/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-luxury-gold flex items-center justify-center text-xs font-bold text-luxury-accent flex-shrink-0">
                {dbUser?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-luxury-accent truncate">{dbUser?.name || 'Admin'}</p>
                <p className="text-[9px] text-gray-500 truncate">{dbUser?.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate('/')} className="flex-1 px-2 py-1.5 text-[10px] border border-gold-300 text-gray-500 rounded hover:text-luxury-accent cursor-pointer transition-colors">
                View Site
              </button>
              <button onClick={handleLogout} className="flex-1 px-2 py-1.5 text-[10px] border border-red-300 text-red-500 rounded hover:bg-red-50 cursor-pointer transition-colors">
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* ─── Main Content ─── */}
        <main className="ml-64 flex-1 min-h-screen p-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-display font-bold text-luxury-accent">
                {ADMIN_TABS.find((t) => t.key === activeTab)?.icon}{' '}
                {ADMIN_TABS.find((t) => t.key === activeTab)?.label}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {activeTab === 'overview' && 'Dashboard overview with key business metrics'}
                {activeTab === 'analytics' && 'Track user events, clicks, and checkout funnels'}
                {activeTab === 'orders' && 'Manage all customer orders and update their status'}
                {activeTab === 'customers' && 'View and manage all registered customers'}
                {activeTab === 'products' && 'Manage your product catalog and templates'}
                {activeTab === 'payments' && 'Track all payment transactions'}
                {activeTab === 'audit' && 'View all system activity and admin actions'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <AdminStats />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-panel p-5 rounded-lg">
                  <h3 className="text-sm font-semibold text-luxury-accent mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setActiveTab('orders')} className="p-4 bg-luxury-gray/50 border border-gold-200/30 rounded-lg text-left hover:border-luxury-gold transition-colors cursor-pointer">
                      <span className="text-2xl">📦</span>
                      <p className="text-xs font-semibold text-luxury-accent mt-2">Manage Orders</p>
                      <p className="text-[10px] text-gray-500">View & update orders</p>
                    </button>
                    <button onClick={() => setActiveTab('customers')} className="p-4 bg-luxury-gray/50 border border-gold-200/30 rounded-lg text-left hover:border-luxury-gold transition-colors cursor-pointer">
                      <span className="text-2xl">👥</span>
                      <p className="text-xs font-semibold text-luxury-accent mt-2">View Customers</p>
                      <p className="text-[10px] text-gray-500">Customer profiles</p>
                    </button>
                    <button onClick={() => setActiveTab('products')} className="p-4 bg-luxury-gray/50 border border-gold-200/30 rounded-lg text-left hover:border-luxury-gold transition-colors cursor-pointer">
                      <span className="text-2xl">🛍️</span>
                      <p className="text-xs font-semibold text-luxury-accent mt-2">Products</p>
                      <p className="text-[10px] text-gray-500">Add & manage products</p>
                    </button>
                    <button onClick={() => setActiveTab('payments')} className="p-4 bg-luxury-gray/50 border border-gold-200/30 rounded-lg text-left hover:border-luxury-gold transition-colors cursor-pointer">
                      <span className="text-2xl">💳</span>
                      <p className="text-xs font-semibold text-luxury-accent mt-2">Payments</p>
                      <p className="text-[10px] text-gray-500">Transaction history</p>
                    </button>
                  </div>
                </div>
                <AuditLog />
              </div>
            </div>
          )}

          {activeTab === 'orders' && <AdminOrders />}
          {activeTab === 'analytics' && <AdminAnalytics />}
          {activeTab === 'customers' && <AdminCustomers />}
          {activeTab === 'products' && <AdminProductManager />}
          {activeTab === 'payments' && <PaymentHistory />}
          {activeTab === 'audit' && <AuditLog />}
        </main>
      </div>
    </div>
  );
}
