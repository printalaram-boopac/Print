import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * AdminRoute - Only allows ADMIN users to access the wrapped route.
 * Redirects to /auth if not logged in, or / if not admin.
 */
export default function AdminRoute({ children }: AdminRouteProps) {
  const { firebaseUser, dbUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-gray-500">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!firebaseUser) return <Navigate to="/auth" replace />;
  if (!dbUser || dbUser.role !== 'ADMIN') return <Navigate to="/" replace />;

  return <>{children}</>;
}
