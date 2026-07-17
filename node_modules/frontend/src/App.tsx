import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';

import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminRoute from '@/components/AdminRoute';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';

import Landing from '@/pages/Landing';
import Designer from '@/pages/Designer';
import Templates from '@/pages/Templates';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import AdminPanel from '@/pages/AdminPanel';
import Auth from '@/pages/Auth';

const queryClient = new QueryClient();

// High-performance custom cursor using ref and native 3D translation for GPU acceleration
function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // The inner dot tracks the mouse coordinates instantly
      dot.style.left = '0px';
      dot.style.top = '0px';
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    const animateCursor = () => {
      // Lerp (Linear Interpolation) calculates smooth spring delay for the outer circle ring
      const lerpFactor = 0.15;
      cursorX += (mouseX - cursorX) * lerpFactor;
      cursorY += (mouseY - cursorY) * lerpFactor;

      cursor.style.left = '0px';
      cursor.style.top = '0px';
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      requestAnimationFrame(animateCursor);
    };

    window.addEventListener('mousemove', onMouseMove);
    const animationFrameId = requestAnimationFrame(animateCursor);

    // Expand cursor ring on click
    const handleMouseDown = () => {
      cursor.style.width = '38px';
      cursor.style.height = '38px';
      cursor.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
      cursor.style.borderColor = '#d4af37';
    };

    const handleMouseUp = () => {
      cursor.style.width = '24px';
      cursor.style.height = '24px';
      cursor.style.backgroundColor = 'transparent';
      cursor.style.borderColor = '#d4af37';
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor hidden md:block" />
      <div ref={dotRef} className="custom-cursor-dot hidden md:block" />
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactLenis root>
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
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

                {/* Main site layout with navbar */}
                <Route
                  path="*"
                  element={
                    <div className="min-h-screen bg-luxury-black text-luxury-accent flex flex-col">
                      <CustomCursor />
                      <Navbar />
                      <CartDrawer />
                      <main className="flex-grow">
                        <Routes>
                          <Route path="/" element={<Landing />} />
                          <Route path="/designer" element={<Designer />} />
                          <Route path="/templates" element={<Templates />} />
                          <Route path="/auth" element={<Auth />} />
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
                      </main>
                    </div>
                  }
                />
              </Routes>
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </ReactLenis>
    </QueryClientProvider>
  );
}
