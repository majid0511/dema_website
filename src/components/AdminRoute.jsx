/**
 * Guard komponen: redirect ke /admin/login jika belum login.
 * Memakai useAuth hook.
 */
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks';

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-primary-200
                          border-t-primary-600 rounded-full mx-auto mb-3" />
          <p className="text-sm text-gray-400">Memeriksa sesi...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  return children;
}
