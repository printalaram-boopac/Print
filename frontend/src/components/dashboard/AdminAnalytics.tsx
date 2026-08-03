import { useState, useEffect } from 'react';
import {
  Users,
  MousePointerClick,
  ShoppingCart,
  MessageSquare,
  RefreshCw,
  Trash2,
  AlertCircle,
  Clock,
  Eye,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Smartphone,
  Monitor,
  Tablet,
  MapPin,
  Megaphone,
  Timer,
  ExternalLink,
  BarChart3,
  CheckCircle2,
  Settings
} from 'lucide-react';
import { getAnalyticsEvents, clearAnalyticsEvents, getGaConfig, saveGaConfig, BACKEND_ENABLED } from '@/lib/api';
import { initGoogleAnalytics, logUserEvent } from '@/lib/analytics';
import { auth } from '@/lib/firebase';
import { toast } from 'react-toastify';

interface FunnelData {
  visitors: number;
  pageViews: number;
  customizations: number;
  carts: number;
  whatsappRedirects: number;
  purchases: number;
}

interface AnalyticsSummary {
  totalEvents: number;
  uniqueVisitors: number;
  liveVisitors: number;
  avgSessionDuration: number;
  deviceTypes: Record<string, number>;
  locations: { name: string; count: number }[];
  campaigns: { name: string; clicks: number; conversions: number }[];
  funnel: FunnelData;
  topPages: { path: string; count: number }[];
  eventCounts: Record<string, number>;
}

interface AnalyticsEvent {
  id: string;
  eventName: string;
  path: string;
  sessionId: string;
  userId: string | null;
  meta: Record<string, any>;
  ip: string;
  userAgent: string;
  timestamp: string;
}

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Google Analytics GA4 Config States
  const [gaMeasurementId, setGaMeasurementId] = useState('');
  const [gaPropertyId, setGaPropertyId] = useState('');
  const [isSavingGa, setIsSavingGa] = useState(false);
  const [showGaModal, setShowGaModal] = useState(false);

  useEffect(() => {
    getGaConfig()
      .then((res) => {
        if (res?.config) {
          setGaMeasurementId(res.config.measurementId || '');
          setGaPropertyId(res.config.propertyId || '');
        }
      })
      .catch(() => { });
  }, []);

  const handleSaveGaConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingGa(true);
    try {
      await saveGaConfig(gaMeasurementId, gaPropertyId);
      if (gaMeasurementId) {
        initGoogleAnalytics(gaMeasurementId);
      }
      toast.success('Google Analytics settings updated & tracking active!');
      setShowGaModal(false);
    } catch (err: any) {
      toast.error('Failed to save GA settings');
    } finally {
      setIsSavingGa(false);
    }
  };

  const handleTestGaPing = () => {
    logUserEvent('GA_ADMIN_TEST_EVENT', {
      source: 'Admin Panel Test',
      timestamp: new Date().toISOString(),
    });
    toast.success('Test event sent to Google Analytics & Site Tracker!');
  };

  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Try fetching via api.ts client
      const data = await getAnalyticsEvents();
      setSummary(data.summary);
      setEvents(data.events);
    } catch (apiErr: any) {
      // Direct local-server fallback only ever makes sense in local dev — on the
      // deployed site this would otherwise fetch the visitor's own localhost,
      // triggering a browser "local network access" permission prompt for nothing.
      try {
        if (!BACKEND_ENABLED) throw apiErr;
        console.warn('API client fetch failed, attempting direct local server fetch:', apiErr);
        const token = await auth.currentUser?.getIdToken();
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('http://localhost:5000/api/analytics/events', { headers });
        if (!res.ok) throw new Error('Direct server fetch failed');
        const data = await res.json();
        setSummary(data.summary);
        setEvents(data.events);
      } catch (directErr: any) {
        console.error('All analytics fetches failed:', directErr);
        setError('Could not connect to the analytics server. Please check if the backend service is running.');

        // 3. Fallback to mock data for demonstration/offline preview so dashboard never looks empty
        setSummary({
          totalEvents: 148,
          uniqueVisitors: 42,
          liveVisitors: 3,
          avgSessionDuration: 222,
          deviceTypes: { Mobile: 26, Desktop: 14, Tablet: 2 },
          locations: [
            { name: 'Kolkata', count: 18 },
            { name: 'Mumbai', count: 12 },
            { name: 'Delhi', count: 8 },
            { name: 'Bengaluru', count: 4 },
          ],
          campaigns: [
            { name: 'Instagram Monsoon (social / ig)', clicks: 45, conversions: 8 },
            { name: 'Google Search Ads (cpc / google)', clicks: 32, conversions: 5 },
            { name: 'Direct Traffic (direct / none)', clicks: 12, conversions: 2 },
          ],
          funnel: {
            visitors: 42,
            pageViews: 104,
            customizations: 18,
            carts: 12,
            whatsappRedirects: 5,
            purchases: 0,
          },
          topPages: [
            { path: '/', count: 52 },
            { path: '/templates', count: 32 },
            { path: '/design/1', count: 12 },
            { path: '/design/11', count: 6 },
            { path: '/profile', count: 2 },
          ],
          eventCounts: {
            'PAGE_VIEW': 104,
            'CLICK_TEMPLATE_CARD': 24,
            'CLICK_BUY_NOW': 12,
            'FORM_BLUR_COUPLE_NAME': 5,
            'CLICK_WHATSAPP_ORDER': 3,
          }
        });
        setEvents([
          {
            id: 'mock1',
            eventName: 'CLICK_WHATSAPP_ORDER',
            path: '/design/1',
            sessionId: 'sess_mock123',
            userId: null,
            meta: { templateTitle: 'Royal Gold Wedding Cover', quantity: 100, total: 1250 },
            ip: '127.0.0.1',
            userAgent: 'Mozilla/5.0',
            timestamp: new Date(Date.now() - 500000).toISOString()
          },
          {
            id: 'mock2',
            eventName: 'FORM_BLUR_COUPLE_NAME',
            path: '/design/1',
            sessionId: 'sess_mock123',
            userId: null,
            meta: { length: 5 },
            ip: '127.0.0.1',
            userAgent: 'Mozilla/5.0',
            timestamp: new Date(Date.now() - 600000).toISOString()
          },
          {
            id: 'mock3',
            eventName: 'CLICK_BUY_NOW',
            path: '/design/1',
            sessionId: 'sess_mock123',
            userId: null,
            meta: { quantity: 100 },
            ip: '127.0.0.1',
            userAgent: 'Mozilla/5.0',
            timestamp: new Date(Date.now() - 700000).toISOString()
          },
          {
            id: 'mock4',
            eventName: 'PAGE_VIEW',
            path: '/templates',
            sessionId: 'sess_mock123',
            userId: null,
            meta: {},
            ip: '127.0.0.1',
            userAgent: 'Mozilla/5.0',
            timestamp: new Date(Date.now() - 800000).toISOString()
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearLogs = async () => {
    if (!window.confirm('Are you sure you want to clear all visitor tracking event logs? This cannot be undone.')) {
      return;
    }
    try {
      await clearAnalyticsEvents();
      fetchAnalyticsData();
    } catch (err) {
      // Fallback direct clear
      try {
        const token = await auth.currentUser?.getIdToken();
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        await fetch('http://localhost:5000/api/analytics/clear', {
          method: 'DELETE',
          headers
        });
        fetchAnalyticsData();
      } catch (e) {
        alert('Failed to clear logs: Server unreachable');
      }
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchAnalyticsData();
      }
    });
    return () => unsubscribe();
  }, []);

  const getEventBadgeClass = (eventName: string) => {
    switch (eventName) {
      case 'PAGE_VIEW':
        return 'bg-gray-100 text-gray-700 border-gray-200/50';
      case 'CLICK_TEMPLATE_CARD':
        return 'bg-blue-100 text-blue-800 border-blue-200/50';
      case 'CLICK_BUY_NOW':
        return 'bg-purple-100 text-purple-800 border-purple-200/50';
      case 'CLICK_WHATSAPP_ORDER':
        return 'bg-green-100 text-green-800 border-green-200/50 border';
      case 'CLICK_NAVBAR_WHATSAPP':
        return 'bg-teal-100 text-teal-800 border-teal-200/50';
      default:
        if (eventName.startsWith('FORM_BLUR_')) {
          return 'bg-amber-100 text-amber-800 border-amber-200/50';
        }
        return 'bg-gray-100 text-gray-800 border-gray-200/50';
    }
  };

  const formatEventName = (name: string) => {
    return name.replace(/_/g, ' ');
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  // Pagination
  const totalPages = Math.ceil(events.length / itemsPerPage);
  const paginatedEvents = events.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-8">
      {/* Google Analytics GA4 Live Connection Card */}
      <div className="glass-card-gold p-6 rounded-2xl border border-gold-200/30 bg-gradient-to-r from-luxury-dark via-luxury-black to-luxury-dark shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 z-10 relative">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-luxury-gold/10 text-luxury-gold border border-gold-200/30">
                <BarChart3 className="w-5 h-5 text-luxury-gold" />
              </span>
              <div>
                <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                  Google Analytics GA4 Live
                  {gaMeasurementId ? (
                    <span className="inline-flex items-center gap-1 text-[10px] bg-green-500/10 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full font-sans font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Live Tracking Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-sans font-semibold">
                      GA4 ID Not Set
                    </span>
                  )}
                </h3>
                <p className="text-xs text-gray-400">
                  {gaMeasurementId
                    ? `Connected with Measurement ID: ${gaMeasurementId}`
                    : 'Connect your Google Analytics GA4 Measurement ID to sync live visitor events'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {gaMeasurementId && (
              <button
                onClick={handleTestGaPing}
                className="px-3.5 py-2 bg-luxury-dark border border-gold-200/30 text-xs font-semibold rounded-lg text-luxury-gold hover:bg-luxury-gold hover:text-black transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Test Event Ping
              </button>
            )}

            <a
              href="https://analytics.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-luxury-gold/20 border border-luxury-gold/40 text-luxury-gold text-xs font-semibold rounded-lg hover:bg-luxury-gold hover:text-black transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Launch Live GA4 Dashboard
            </a>

            <button
              onClick={() => setShowGaModal(true)}
              className="px-3.5 py-2 bg-luxury-dark border border-gold-200/30 text-xs font-semibold rounded-lg text-white hover:bg-luxury-gold hover:text-black transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              Configure GA4
            </button>
          </div>
        </div>
      </div>

      {/* GA4 Config Modal */}
      {showGaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-luxury-dark border border-gold-200/40 rounded-2xl p-6 md:p-8 max-w-md w-full space-y-6 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-gold-200/20 pb-4">
              <h3 className="text-lg font-display font-bold text-luxury-accent flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-luxury-gold" />
                Configure Google Analytics
              </h3>
              <button
                onClick={() => setShowGaModal(false)}
                className="text-gray-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveGaConfig} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-luxury-gold uppercase tracking-wider">
                  GA4 Measurement ID (G-8BKDDD6DWX)
                </label>
                <input
                  type="text"
                  placeholder="e.g. G-1234567890"
                  value={gaMeasurementId}
                  onChange={(e) => setGaMeasurementId(e.target.value)}
                  className="w-full bg-luxury-black border border-gold-200/30 rounded-lg p-3 text-sm text-luxury-accent placeholder:text-gray-600 focus:outline-none focus:border-luxury-gold"
                  required
                />
                <p className="text-[11px] text-gray-500">
                  Find this in your Google Analytics Admin → Data Streams → Web Stream details.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-luxury-gold uppercase tracking-wider">
                  GA4 Property ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 382910485"
                  value={gaPropertyId}
                  onChange={(e) => setGaPropertyId(e.target.value)}
                  className="w-full bg-luxury-black border border-gold-200/30 rounded-lg p-3 text-sm text-luxury-accent placeholder:text-gray-600 focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowGaModal(false)}
                  className="px-4 py-2 bg-luxury-gray text-gray-300 text-xs font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingGa}
                  className="px-5 py-2 bg-luxury-gold text-black font-semibold text-xs rounded-lg hover:bg-gold-400 transition-colors disabled:opacity-50"
                >
                  {isSavingGa ? 'Saving...' : 'Save & Activate Tracking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex justify-between items-center bg-luxury-gray/40 border border-gold-200/20 p-4 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-gray-400 font-medium">Real-Time Event Tracking & GA Forwarding Active</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchAnalyticsData}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-luxury-dark border border-gold-200/30 text-xs font-semibold rounded-lg hover:bg-luxury-gold hover:text-white transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleClearLogs}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-red-600/10 border border-red-200/30 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-600 hover:text-white transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Logs
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-xl text-xs">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Notice</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {loading && !summary ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <RefreshCw className="w-8 h-8 text-luxury-gold animate-spin" />
          <p className="text-xs uppercase tracking-widest text-gray-500">Loading visitor analytics...</p>
        </div>
      ) : (
        <>
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-panel p-5 rounded-xl space-y-2 border border-gold-200/20 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Live Visitors</p>
                <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-display font-bold text-luxury-accent">{summary?.liveVisitors || 0}</p>
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              </div>
              <p className="text-[10px] text-gray-500">Active in the last 5 minutes</p>
            </div>

            <div className="glass-panel p-5 rounded-xl space-y-2 border border-gold-200/20">
              <div className="flex justify-between items-start">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Avg. Duration</p>
                <div className="p-2 bg-luxury-gold/10 rounded-lg text-luxury-gold">
                  <Timer className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-display font-bold text-luxury-accent">{formatDuration(summary?.avgSessionDuration || 0)}</p>
              <p className="text-[10px] text-gray-500">Average time spent per session</p>
            </div>

            <div className="glass-panel p-5 rounded-xl space-y-2 border border-gold-200/20">
              <div className="flex justify-between items-start">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Unique Visitors</p>
                <div className="p-2 bg-luxury-gold/10 rounded-lg text-luxury-gold">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-display font-bold text-luxury-accent">{summary?.uniqueVisitors || 0}</p>
              <p className="text-[10px] text-gray-500">Total active browser sessions</p>
            </div>

            <div className="glass-panel p-5 rounded-xl space-y-2 border border-gold-200/20">
              <div className="flex justify-between items-start">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Interactions</p>
                <div className="p-2 bg-luxury-gold/10 rounded-lg text-luxury-gold">
                  <MousePointerClick className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-display font-bold text-luxury-accent">{summary?.totalEvents || 0}</p>
              <p className="text-[10px] text-gray-500">All clicks, views, and edits logged</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversion Funnel */}
            <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-gold-200/20 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-luxury-accent">Visitor Funnel Drop-off Analysis</h3>
                <p className="text-xs text-gray-500 mt-0.5">Find where users are dropping off on their path to purchase</p>
              </div>

              {summary && (
                <div className="space-y-4">
                  {/* Step 1: Sessions */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-gray-400" /> Visitor Landed</span>
                      <span>{summary.funnel.visitors} Visitors (100%)</span>
                    </div>
                    <div className="w-full bg-luxury-dark rounded-full h-4 overflow-hidden border border-gold-200/10">
                      <div className="bg-luxury-gold/70 h-full rounded-full transition-all duration-500" style={{ width: '100%' }} />
                    </div>
                  </div>

                  {/* Step 2: Page Views */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5 text-gray-400" /> Viewed Designs</span>
                      <span>{summary.funnel.pageViews} Pageviews ({summary.funnel.visitors > 0 ? Math.round((summary.funnel.pageViews / summary.funnel.visitors) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full bg-luxury-dark rounded-full h-4 overflow-hidden border border-gold-200/10">
                      <div className="bg-luxury-gold/50 h-full rounded-full transition-all duration-500" style={{ width: `${summary.funnel.visitors > 0 ? Math.min(100, (summary.funnel.pageViews / summary.funnel.visitors) * 100) : 0}%` }} />
                    </div>
                  </div>

                  {/* Step 3: Checkout Initiated */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="flex items-center gap-1.5"><ShoppingCart className="w-3.5 h-3.5 text-gray-400" /> Pressed "Buy Now"</span>
                      <span>{summary.funnel.carts} Clicks ({summary.funnel.visitors > 0 ? Math.round((summary.funnel.carts / summary.funnel.visitors) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full bg-luxury-dark rounded-full h-4 overflow-hidden border border-gold-200/10">
                      <div className="bg-luxury-gold/30 h-full rounded-full transition-all duration-500" style={{ width: `${summary.funnel.visitors > 0 ? (summary.funnel.carts / summary.funnel.visitors) * 100 : 0}%` }} />
                    </div>
                  </div>

                  {/* Step 4: Customized */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-gray-400" /> Customized Text Fields</span>
                      <span>{summary.funnel.customizations} Interactions ({summary.funnel.carts > 0 ? Math.round((summary.funnel.customizations / summary.funnel.carts) * 100) : 0}% of Checkouts)</span>
                    </div>
                    <div className="w-full bg-luxury-dark rounded-full h-4 overflow-hidden border border-gold-200/10">
                      <div className="bg-amber-500/30 h-full rounded-full transition-all duration-500" style={{ width: `${summary.funnel.visitors > 0 ? (summary.funnel.customizations / summary.funnel.visitors) * 100 : 0}%` }} />
                    </div>
                  </div>

                  {/* Step 5: WhatsApp order */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5 text-green-500" /> WhatsApp Redirect</span>
                      <span>{summary.funnel.whatsappRedirects} Redirects ({summary.funnel.visitors > 0 ? Math.round((summary.funnel.whatsappRedirects / summary.funnel.visitors) * 100) : 0}% checkout rate)</span>
                    </div>
                    <div className="w-full bg-luxury-dark rounded-full h-4 overflow-hidden border border-gold-200/10">
                      <div className="bg-green-500/50 h-full rounded-full transition-all duration-500" style={{ width: `${summary.funnel.visitors > 0 ? (summary.funnel.whatsappRedirects / summary.funnel.visitors) * 100 : 0}%` }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Top Active Paths */}
            <div className="glass-panel p-6 rounded-xl border border-gold-200/20 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-luxury-accent">Most Visited Pages</h3>
                <p className="text-xs text-gray-500 mt-0.5">Top locations where ad traffic lands</p>
              </div>

              <div className="divide-y divide-gold-200/10">
                {summary?.topPages.map((page, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2.5 text-xs">
                    <span className="font-mono text-gray-400 truncate max-w-[180px]">{page.path}</span>
                    <span className="px-2.5 py-1 bg-luxury-dark border border-gold-200/20 text-luxury-gold font-bold rounded-lg">
                      {page.count} views
                    </span>
                  </div>
                ))}
                {(!summary?.topPages || summary.topPages.length === 0) && (
                  <p className="text-xs text-gray-500 text-center py-8">No page views recorded yet</p>
                )}
              </div>
            </div>
          </div>

          {/* New Metrics Row: Locations, Devices, and UTM Campaigns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Locations & Devices */}
            <div className="glass-panel p-6 rounded-xl border border-gold-200/20 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-luxury-accent">Devices & Locations</h3>
                <p className="text-xs text-gray-500 mt-0.5">Visitor breakdown by platform & region</p>
              </div>

              {/* Devices */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Device Breakdown</p>
                <div className="space-y-2">
                  {(() => {
                    const devTypes = summary?.deviceTypes || { Mobile: 0, Desktop: 0, Tablet: 0 };
                    const total = Object.values(devTypes).reduce((a, b) => a + b, 0) || 1;
                    return (
                      <>
                        <div>
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span className="flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5 text-luxury-gold" /> Mobile</span>
                            <span>{devTypes.Mobile || 0} ({Math.round(((devTypes.Mobile || 0) / total) * 100)}%)</span>
                          </div>
                          <div className="w-full bg-luxury-dark rounded-full h-1.5 overflow-hidden">
                            <div className="bg-luxury-gold h-full rounded-full" style={{ width: `${((devTypes.Mobile || 0) / total) * 100}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span className="flex items-center gap-1.5"><Monitor className="w-3.5 h-3.5 text-luxury-gold" /> Desktop</span>
                            <span>{devTypes.Desktop || 0} ({Math.round(((devTypes.Desktop || 0) / total) * 100)}%)</span>
                          </div>
                          <div className="w-full bg-luxury-dark rounded-full h-1.5 overflow-hidden">
                            <div className="bg-luxury-gold h-full rounded-full" style={{ width: `${((devTypes.Desktop || 0) / total) * 100}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span className="flex items-center gap-1.5"><Tablet className="w-3.5 h-3.5 text-luxury-gold" /> Tablet</span>
                            <span>{devTypes.Tablet || 0} ({Math.round(((devTypes.Tablet || 0) / total) * 100)}%)</span>
                          </div>
                          <div className="w-full bg-luxury-dark rounded-full h-1.5 overflow-hidden">
                            <div className="bg-luxury-gold h-full rounded-full" style={{ width: `${((devTypes.Tablet || 0) / total) * 100}%` }} />
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Locations */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Top Regions (Timezone)</p>
                <div className="divide-y divide-gold-200/10">
                  {summary?.locations && summary.locations.length > 0 ? (
                    summary.locations.slice(0, 4).map((loc, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2 text-xs">
                        <span className="flex items-center gap-1.5 text-gray-300">
                          <MapPin className="w-3.5 h-3.5 text-luxury-gold" />
                          {loc.name}
                        </span>
                        <span className="font-semibold text-luxury-accent">{loc.count} sessions</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 py-2">No location data captured</p>
                  )}
                </div>
              </div>
            </div>

            {/* UTM Campaigns Table */}
            <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-gold-200/20 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-luxury-accent">Ad Campaign Performance</h3>
                <p className="text-xs text-gray-500 mt-0.5">Performance metrics for custom UTM links</p>
              </div>

              <div className="overflow-x-auto font-sans">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gold-200/10 text-xs text-gray-500 uppercase tracking-wider pb-2">
                      <th className="py-2 font-semibold"><span className="flex items-center gap-1.5"><Megaphone className="w-3.5 h-3.5 text-luxury-gold" /> Campaign (Source/Medium)</span></th>
                      <th className="py-2 font-semibold text-right">Clicks</th>
                      <th className="py-2 font-semibold text-right">Conversions</th>
                      <th className="py-2 font-semibold text-right">Conv. Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-200/10 text-xs">
                    {summary?.campaigns && summary.campaigns.length > 0 ? (
                      summary.campaigns.map((camp, idx) => {
                        const rate = camp.clicks > 0 ? Math.round((camp.conversions / camp.clicks) * 100) : 0;
                        return (
                          <tr key={idx} className="hover:bg-luxury-gray/10 transition-colors">
                            <td className="py-3 text-gray-300 font-mono truncate max-w-[200px]" title={camp.name}>
                              {camp.name}
                            </td>
                            <td className="py-3 text-right font-semibold text-gray-400">{camp.clicks}</td>
                            <td className="py-3 text-right font-semibold text-gray-400">{camp.conversions}</td>
                            <td className="py-3 text-right">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${rate > 15 ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'}`}>
                                {rate}%
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-gray-500">
                          No active ad campaigns detected. Append ?utm_campaign=xyz to urls to test tracking.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Chronological Event Log */}
          <div className="glass-panel p-6 rounded-xl border border-gold-200/20 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-semibold text-luxury-accent">Detailed Interaction Log</h3>
                <p className="text-xs text-gray-500 mt-0.5">Chronological record of visitor behaviors</p>
              </div>
              <span className="text-[10px] text-gray-500">{events.length} events total</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gold-200/10 text-xs text-gray-500 uppercase tracking-wider pb-3">
                    <th className="py-3 font-semibold">Time</th>
                    <th className="py-3 font-semibold">Event</th>
                    <th className="py-3 font-semibold">Path</th>
                    <th className="py-3 font-semibold">Session ID</th>
                    <th className="py-3 font-semibold">Context / Meta details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-200/10 text-xs">
                  {paginatedEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-luxury-gray/10 transition-colors">
                      <td className="py-3 text-gray-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-500" />
                        {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold tracking-wide uppercase ${getEventBadgeClass(event.eventName)}`}>
                          {formatEventName(event.eventName)}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-gray-400">{event.path}</td>
                      <td className="py-3 font-mono text-gray-400" title={event.sessionId}>
                        {event.sessionId.substring(0, 10)}...
                      </td>
                      <td className="py-3">
                        <span className="text-[11px] text-gray-500">
                          {Object.keys(event.meta).length > 0
                            ? JSON.stringify(event.meta)
                              .replace(/[{}"]/g, '')
                              .replace(/:/g, ': ')
                              .replace(/,/g, ' | ')
                            : '—'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {events.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-500">
                        No events captured yet. Run around the website and click cards to populate this list!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center border-t border-gold-200/10 pt-4">
                <span className="text-[10px] text-gray-500">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="p-1.5 border border-gold-200/30 rounded hover:bg-gold-200/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className="p-1.5 border border-gold-200/30 rounded hover:bg-gold-200/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
