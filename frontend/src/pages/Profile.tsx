import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { updateProfile, getMyOrders, getMyDesigns } from '@/lib/api';

interface Order {
  id: string;
  status: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  customerName: string | null;
  coupleName: string | null;
  familyName: string | null;
  greetingText: string | null;
  occasion: string | null;
  theme: string | null;
  shippingAddress: string;
  phone: string;
  createdAt: string;
  design: {
    id: string; title: string; previewUrl: string | null;
    theme: string | null; occasion: string | null;
    coupleName: string | null; familyName: string | null;
    greetingText: string | null;
  } | null;
  payments: { id: string; status: string; amount: number; createdAt: string }[];
}

interface Design {
  id: string;
  title: string;
  previewUrl: string | null;
  theme: string | null;
  occasion: string | null;
  coupleName: string | null;
  familyName: string | null;
  greetingText: string | null;
  createdAt: string;
  template: { id: string; title: string; thumbnail: string; category: string } | null;
}

type ProfileTab = 'orders' | 'designs' | 'payments' | 'settings';

const TABS: { key: ProfileTab; label: string; icon: string }[] = [
  { key: 'orders', label: 'My Orders', icon: '📦' },
  { key: 'designs', label: 'My Designs', icon: '🎨' },
  { key: 'payments', label: 'Payments', icon: '💳' },
  { key: 'settings', label: 'Settings', icon: '⚙️' },
];

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-blue-50 border-blue-200 text-blue-700',
  PAID: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  IN_PRODUCTION: 'bg-orange-50 border-orange-200 text-orange-700',
  PRINTED: 'bg-purple-50 border-purple-200 text-purple-700',
  SHIPPED: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  DELIVERED: 'bg-green-50 border-green-200 text-green-700',
  CANCELLED: 'bg-red-50 border-red-200 text-red-700',
};

export default function Profile() {
  const navigate = useNavigate();
  const { dbUser, logout, loading: authLoading } = useAuth();

  const [tab, setTab] = useState<ProfileTab>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingDesigns, setLoadingDesigns] = useState(true);

  // Profile edit state
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editState, setEditState] = useState('');
  const [editPincode, setEditPincode] = useState('');
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    if (dbUser) {
      setEditName(dbUser.name || '');
      setEditPhone(dbUser.phone || '');
      setEditAddress(dbUser.address || '');
      setEditCity(dbUser.city || '');
      setEditState(dbUser.state || '');
      setEditPincode(dbUser.pincode || '');
    }
  }, [dbUser]);

  // Fetch orders
  useEffect(() => {
    setLoadingOrders(true);
    getMyOrders()
      .then((res) => setOrders(res.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false));
  }, []);

  // Fetch designs
  useEffect(() => {
    setLoadingDesigns(true);
    getMyDesigns()
      .then((res) => setDesigns(res.designs || []))
      .catch(() => setDesigns([]))
      .finally(() => setLoadingDesigns(false));
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveMsg('');
    try {
      await updateProfile({
        name: editName,
        phone: editPhone,
        address: editAddress,
        city: editCity,
        state: editState,
        pincode: editPincode,
      });
      setSaveMsg('Profile updated successfully!');
      setEditing(false);
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      setSaveMsg('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-gray-500">Loading Profile...</p>
        </div>
      </div>
    );
  }

  const totalSpent = orders.reduce((s, o) => s + o.totalAmount, 0);
  const activeOrders = orders.filter((o) => !['DELIVERED', 'CANCELLED'].includes(o.status)).length;

  return (
    <div className="min-h-screen bg-luxury-black text-luxury-accent pt-28 md:pt-32 pb-16 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* ─── Profile Header ─── */}
        <div className="glass-card-gold p-6 rounded-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-luxury-gold flex items-center justify-center text-2xl font-bold text-luxury-accent shadow-lg flex-shrink-0">
              {dbUser?.avatarUrl ? (
                <img src={dbUser.avatarUrl} alt={dbUser.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                dbUser?.name?.charAt(0)?.toUpperCase() || '?'
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-display font-bold text-gold-gradient">{dbUser?.name || 'User'}</h1>
              <p className="text-xs text-gray-500">{dbUser?.email}</p>
              {dbUser?.phone && <p className="text-xs text-gray-400 mt-0.5">📞 {dbUser.phone}</p>}
              <p className="text-[10px] text-gray-500 mt-1">Member since {dbUser?.createdAt ? new Date(dbUser.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' }) : '—'}</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => navigate('/dashboard')} className="px-4 py-2 text-xs border border-gold-300 text-luxury-gold rounded hover:bg-gold-50 transition-colors cursor-pointer">
                Dashboard
              </button>
              <button onClick={handleLogout} className="px-4 py-2 text-xs border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors cursor-pointer">
                Sign Out
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-gold-200/30">
            <div className="text-center">
              <p className="text-xl font-bold text-luxury-gold">{orders.length}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Total Orders</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-luxury-accent">₹{totalSpent.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Total Spent</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-green-600">{activeOrders}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Active Orders</p>
            </div>
          </div>
        </div>

        {/* ─── Shipping Address Card ─── */}
        <div className="glass-panel p-5 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm uppercase tracking-widest text-luxury-gold font-bold">📍 Saved Shipping Address</h3>
            {!editing && (
              <button onClick={() => setEditing(true)} className="text-[10px] text-luxury-gold border border-gold-300 px-3 py-1 rounded hover:bg-gold-50 transition-colors cursor-pointer">
                Edit
              </button>
            )}
          </div>

          {saveMsg && (
            <p className={`text-xs mb-3 ${saveMsg.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{saveMsg}</p>
          )}

          {editing ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500">Name</label>
                  <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-luxury-dark border border-gold-300 p-2 text-xs text-luxury-accent focus:outline-none focus:border-luxury-gold rounded" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500">Phone</label>
                  <input type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full bg-luxury-dark border border-gold-300 p-2 text-xs text-luxury-accent focus:outline-none focus:border-luxury-gold rounded" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-500">Street Address</label>
                <textarea rows={2} value={editAddress} onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full bg-luxury-dark border border-gold-300 p-2 text-xs text-luxury-accent focus:outline-none focus:border-luxury-gold rounded resize-none" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500">City</label>
                  <input type="text" value={editCity} onChange={(e) => setEditCity(e.target.value)}
                    className="w-full bg-luxury-dark border border-gold-300 p-2 text-xs text-luxury-accent focus:outline-none focus:border-luxury-gold rounded" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500">State</label>
                  <input type="text" value={editState} onChange={(e) => setEditState(e.target.value)}
                    className="w-full bg-luxury-dark border border-gold-300 p-2 text-xs text-luxury-accent focus:outline-none focus:border-luxury-gold rounded" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500">Pincode</label>
                  <input type="text" value={editPincode} onChange={(e) => setEditPincode(e.target.value)}
                    className="w-full bg-luxury-dark border border-gold-300 p-2 text-xs text-luxury-accent focus:outline-none focus:border-luxury-gold rounded" />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleSaveProfile} disabled={saving}
                  className="px-4 py-2 bg-luxury-gold text-luxury-accent text-xs font-bold rounded cursor-pointer disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={() => setEditing(false)}
                  className="px-4 py-2 text-xs text-gray-500 border border-gold-300 rounded cursor-pointer hover:text-luxury-accent">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-xs text-gray-400 space-y-1">
              {dbUser?.address ? (
                <>
                  <p className="text-luxury-accent font-medium">{dbUser.name}</p>
                  <p>{dbUser.address}</p>
                  <p>{[dbUser.city, dbUser.state, dbUser.pincode].filter(Boolean).join(', ') || ''}</p>
                  {dbUser.phone && <p>📞 {dbUser.phone}</p>}
                </>
              ) : (
                <p className="text-gray-500 italic">No shipping address saved yet. Click "Edit" to add one.</p>
              )}
            </div>
          )}
        </div>

        {/* ─── Tab Navigation ─── */}
        <div className="flex gap-1 bg-luxury-gray/50 p-1 rounded-lg w-fit">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center gap-2 ${
                tab === t.key
                  ? 'bg-white text-luxury-accent shadow-sm border border-gold-200'
                  : 'text-gray-500 hover:text-luxury-accent'
              }`}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* ─── Tab Content ─── */}
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

          {/* ═══ Orders Tab ═══ */}
          {tab === 'orders' && (
            <div className="glass-panel p-6 rounded-lg space-y-4">
              <h2 className="text-lg font-display text-luxury-accent font-semibold">Order History</h2>
              {loadingOrders ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-100/50 rounded animate-pulse" />)}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-4xl mb-3">📭</p>
                  <p>No orders yet. Start designing!</p>
                  <button onClick={() => navigate('/designer')} className="mt-3 text-luxury-gold text-xs underline cursor-pointer">
                    Create your first design
                  </button>
                </div>
              ) : (
                orders.map((ord) => (
                  <div key={ord.id} className="border border-gold-200/50 rounded-lg p-4 space-y-3 hover:bg-luxury-gray/20 transition-colors">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-luxury-gold font-mono font-bold">{ord.id.slice(0, 8)}...</p>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase border ${STATUS_COLORS[ord.status] || 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                            {ord.status.replace('_', ' ')}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-luxury-accent mt-1">{ord.design?.title || 'Custom Design'}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                          {ord.occasion && <p className="text-[10px] text-gray-500">🎉 {ord.occasion}</p>}
                          {ord.theme && <p className="text-[10px] text-gray-500">🎨 {ord.theme}</p>}
                          {ord.coupleName && <p className="text-[10px] text-gray-500">💑 {ord.coupleName}</p>}
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1">
                          Ordered: {new Date(ord.createdAt).toLocaleDateString('en-IN')} • Qty: {ord.quantity} • ₹{ord.unitPrice}/pc
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="text-sm font-bold text-luxury-accent">₹{ord.totalAmount.toLocaleString('en-IN')}</p>
                      </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="border-t border-gold-200/30 pt-2 text-[10px] text-gray-500">
                      <p>📍 {ord.shippingAddress}</p>
                      <p>📞 {ord.phone}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ═══ Designs Tab ═══ */}
          {tab === 'designs' && (
            <div className="glass-panel p-6 rounded-lg space-y-4">
              <h2 className="text-lg font-display text-luxury-accent font-semibold">My Designs</h2>
              {loadingDesigns ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => <div key={i} className="aspect-square bg-gray-100/50 rounded animate-pulse" />)}
                </div>
              ) : designs.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-4xl mb-3">🎨</p>
                  <p>No designs created yet.</p>
                  <button onClick={() => navigate('/designer')} className="mt-3 text-luxury-gold text-xs underline cursor-pointer">
                    Start designing
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {designs.map((d) => (
                    <div key={d.id} className="border border-gold-200/50 rounded-lg overflow-hidden hover:border-luxury-gold transition-colors">
                      <div className="aspect-square bg-luxury-dark flex items-center justify-center">
                        {d.template?.thumbnail ? (
                          <img src={d.template.thumbnail} alt={d.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-4xl">🎨</span>
                        )}
                      </div>
                      <div className="p-3 space-y-1">
                        <h4 className="text-xs font-semibold text-luxury-accent truncate">{d.title}</h4>
                        <div className="flex flex-wrap gap-1">
                          {d.occasion && <span className="text-[9px] bg-gold-50 border border-gold-200 px-1.5 py-0.5 rounded text-luxury-gold">{d.occasion}</span>}
                          {d.theme && <span className="text-[9px] bg-luxury-gray border border-gold-200 px-1.5 py-0.5 rounded text-gray-500">{d.theme}</span>}
                        </div>
                        {d.coupleName && <p className="text-[10px] text-gray-500">💑 {d.coupleName}</p>}
                        <p className="text-[9px] text-gray-500">{new Date(d.createdAt).toLocaleDateString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══ Payments Tab ═══ */}
          {tab === 'payments' && (
            <div className="glass-panel p-6 rounded-lg space-y-4">
              <h2 className="text-lg font-display text-luxury-accent font-semibold">Payment History</h2>
              {orders.length === 0 ? (
                <p className="text-center py-10 text-gray-500 text-sm">No payments yet.</p>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div key={ord.id} className="flex items-center justify-between border border-gold-200/50 rounded-lg p-3">
                      <div>
                        <p className="text-xs font-semibold text-luxury-accent">{ord.design?.title || 'Order'}</p>
                        <p className="text-[10px] text-gray-500">{new Date(ord.createdAt).toLocaleDateString('en-IN')} • Qty: {ord.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-luxury-gold">₹{ord.totalAmount.toLocaleString('en-IN')}</p>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded border ${
                          ord.status === 'PAID' || ord.status === 'DELIVERED' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'
                        }`}>
                          {ord.payments.length > 0 ? ord.payments[0].status : 'PENDING'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══ Settings Tab ═══ */}
          {tab === 'settings' && (
            <div className="glass-panel p-6 rounded-lg space-y-6">
              <h2 className="text-lg font-display text-luxury-accent font-semibold">Account Settings</h2>

              {/* Referral */}
              <div className="space-y-3">
                <h3 className="text-sm uppercase tracking-widest text-luxury-gold font-bold">🎁 Referral Program</h3>
                <p className="text-xs text-gray-500">Share your code. They get <span className="text-luxury-accent font-semibold">10% off</span>, you earn <span className="text-luxury-accent font-semibold">₹500 cashback</span> per order.</p>
                <div className="flex gap-2 items-center bg-luxury-dark border border-gold-300 p-3 rounded">
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Your Referral Code</p>
                    <p className="text-base font-bold text-luxury-accent tracking-widest">PA-{dbUser?.id?.slice(0, 6)?.toUpperCase() || 'XXXXXX'}</p>
                  </div>
                  <button onClick={() => navigator.clipboard.writeText(`PA-${dbUser?.id?.slice(0, 6)?.toUpperCase() || 'XXXXXX'}`)}
                    className="px-4 py-2 bg-gold-50 border border-gold-300 text-xs text-luxury-gold hover:bg-luxury-gold hover:text-luxury-accent transition-colors rounded cursor-pointer">
                    Copy
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="border-t border-gold-200/30 pt-5 space-y-3">
                <h3 className="text-sm uppercase tracking-widest text-red-500 font-bold">Danger Zone</h3>
                <button onClick={handleLogout}
                  className="px-4 py-2 bg-red-50 border border-red-300 text-xs text-red-700 rounded hover:bg-red-100 transition-colors cursor-pointer">
                  Sign Out of Account
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
