import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { logUserEvent } from '@/lib/analytics';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactLenis } from 'lenis/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-loading-skeleton/dist/skeleton.css';
import { SkeletonTheme } from 'react-loading-skeleton';

import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminRoute from '@/components/AdminRoute';
import Navbar from '@/components/Navbar';
import ScrollToTop from '@/components/ScrollToTop';
import FloatingActions from '@/components/landing/FloatingActions';
import Footer from '@/components/landing/Footer';

import Landing from '@/pages/Landing';
import Designer from '@/pages/Designer';
import Templates from '@/pages/Templates';
import DesignDetail from '@/pages/DesignDetail';
import ProductLinePage from '@/pages/ProductLinePage';
import { PRODUCT_LINES } from '@/data/productLines';
import About from '@/pages/About';
import ShagunCoverGuide from '@/pages/ShagunCoverGuide';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import PhotoZineMaker from '@/pages/PhotoZineMaker';

// The magazine studio ships its own editor, canvas and export code. Loading it
// lazily keeps it out of the initial bundle for visitors who never open it.
const MagazineTemplates = lazy(() => import('@/pages/MagazineTemplates'));
const MagazineTemplatePreview = lazy(() => import('@/pages/MagazineTemplatePreview'));
const MagazineEditor = lazy(() => import('@/pages/MagazineEditor'));
const MyMagazines = lazy(() => import('@/pages/MyMagazines'));
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import AdminPanel from '@/pages/AdminPanel';
import Auth from '@/pages/Auth';
import ReturnExchange from '@/pages/ReturnExchange';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsConditions from '@/pages/TermsConditions';
import ShippingPolicy from '@/pages/ShippingPolicy';

const queryClient = new QueryClient();

/** Neutral hold while a lazily loaded route arrives. */
function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-luxury-gold border-t-transparent" />
    </div>
  );
}



import { initGoogleAnalytics } from '@/lib/analytics';
import { getGaConfig } from '@/lib/api';

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    getGaConfig()
      .then((res) => {
        if (res?.config?.measurementId) {
          initGoogleAnalytics(res.config.measurementId);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    logUserEvent('PAGE_VIEW', { path: location.pathname });
  }, [location.pathname]);

  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SkeletonTheme baseColor="#f3eae1" highlightColor="#e8dacb">
        <ReactLenis root>
          <BrowserRouter>
            <AnalyticsTracker />
            <AuthProvider>
              <ScrollToTop />
              <ToastContainer
                position="top-right"
                autoClose={3500}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                toastStyle={{
                  backgroundColor: '#1a1410',
                  color: '#f3e5ab',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  borderRadius: '0.75rem',
                  fontFamily: 'sans-serif',
                }}
              />
              <Routes>
                {/* Admin panel — separate layout without main navbar */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminPanel />
                    </AdminRoute>
                  }
                />

                {/* Magazine editor — full-screen app shell, no site chrome */}
                <Route
                  path="/magazine/editor/:designId"
                  element={
                    <Suspense fallback={<div className="flex h-[100dvh] items-center justify-center bg-luxury-black"><span className="h-8 w-8 animate-spin rounded-full border-2 border-luxury-gold border-t-transparent" /></div>}>
                      <MagazineEditor />
                    </Suspense>
                  }
                />

                {/* Main site layout with navbar */}
                <Route
                  path="*"
                  element={
                    <div className="min-h-screen bg-luxury-black text-luxury-accent flex flex-col">
                      <Navbar />
                      <main className="flex-grow">
                        <Suspense fallback={<RouteFallback />}>
                        <Routes>
                          <Route path="/" element={<Landing />} />
                          <Route path="/designer" element={<Designer />} />
                          <Route path="/templates" element={<Templates />} />
                          <Route path="/design/:id" element={<DesignDetail />} />
                          {PRODUCT_LINES.map((line) => (
                            <Route key={line.slug} path={`/${line.slug}`} element={<ProductLinePage line={line} />} />
                          ))}
                          <Route path="/about" element={<About />} />
                          <Route path="/how-to-choose-a-shagun-cover" element={<ShagunCoverGuide />} />
                          <Route path="/blog" element={<Blog />} />
                          <Route path="/blog/:slug" element={<BlogPost />} />
                          <Route path="/photo-zine-maker" element={<PhotoZineMaker />} />
                          <Route path="/magazine" element={<MagazineTemplates />} />
                          <Route path="/magazine/t/:slug" element={<MagazineTemplatePreview />} />
                          <Route path="/my-magazines" element={<MyMagazines />} />
                          <Route path="/auth" element={<Auth />} />
                          <Route path="/return-exchange" element={<ReturnExchange />} />
                          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                          <Route path="/terms-conditions" element={<TermsConditions />} />
                          <Route path="/shipping-policy" element={<ShippingPolicy />} />
                          <Route
                            path="/dashboard"
                            element={
                              <ProtectedRoute>
                                <Dashboard />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/profile"
                            element={
                              <ProtectedRoute>
                                <Profile />
                              </ProtectedRoute>
                            }
                          />
                        </Routes>
                        </Suspense>
                      </main>
                      <Footer />
                      <FloatingActions />
                    </div>
                  }
                />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </ReactLenis>
      </SkeletonTheme>
    </QueryClientProvider>
  );
}
