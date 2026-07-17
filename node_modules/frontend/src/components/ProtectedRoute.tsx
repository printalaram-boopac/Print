import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'CUSTOMER';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { firebaseUser, loading, isAdmin } = useAuth();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-gray-500">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Not logged in → redirect to auth page
  if (!firebaseUser) {
    return <Navigate to="/auth" replace />;
  }

  // Check role requirement
  if (requiredRole === 'ADMIN' && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
