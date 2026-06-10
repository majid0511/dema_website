import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { siteConfig } from '../../config/siteConfig';

export default function AdminLogin() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const { login }               = useAuth();
  const navigate                = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError('Email atau password salah. Coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500
                    flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center
                          text-white font-extrabold text-2xl mx-auto mb-4 shadow-lg">D</div>
          <h1 className="text-xl font-bold text-gray-800">Panel Admin</h1>
          <p className="text-gray-500 text-sm mt-1">{siteConfig.demaName}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              required placeholder="admin@email.com"
              className="input" autoComplete="email" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              required placeholder="••••••••"
              className="input" autoComplete="current-password" />
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl border border-red-100">
              ⚠️ {error}
            </p>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-primary-500 text-white py-3.5 rounded-xl font-semibold
                       hover:bg-primary-600 disabled:opacity-50 transition-colors mt-2">
            {loading ? 'Masuk...' : 'Masuk ke Dashboard'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Akses terbatas untuk pengurus DEMA
        </p>
      </div>
    </div>
  );
}
