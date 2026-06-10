/**
 * Layout untuk semua halaman admin.
 * Sidebar navigasi di kiri (desktop) / drawer di mobile.
 */
import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { siteConfig } from '../config/siteConfig';
import { useAuth } from '../hooks/useAuth';
import { HiMenu, HiX } from 'react-icons/hi';

const MENU = [
  { icon: '🏠', label: 'Dashboard',      path: '/admin' },
  { icon: '📢', label: 'Pengumuman',     path: '/admin/pengumuman' },
  { icon: '📰', label: 'Artikel',        path: '/admin/artikel' },
  { icon: '👥', label: 'Pengurus',       path: '/admin/anggota' },
  { icon: '📸', label: 'Galeri',         path: '/admin/galeri' },
  { icon: '📋', label: 'Program Kerja',  path: '/admin/program' },
  { icon: '📅', label: 'Kegiatan',       path: '/admin/kegiatan' },
  { icon: '🗣️', label: 'Aspirasi',       path: '/admin/aspirasi' },
];

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate         = useNavigate();
  const [sideOpen, setSideOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate('/admin/login');
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header sidebar */}
      <div className="p-5 border-b border-primary-700">
        <p className="font-bold text-white text-sm">{siteConfig.demaName}</p>
        <p className="text-primary-200 text-xs mt-0.5">Panel Admin</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {MENU.map(m => (
          <NavLink
            key={m.path}
            to={m.path}
            end={m.path === '/admin'}
            onClick={() => setSideOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-primary-100 hover:bg-primary-700'
              }`
            }
          >
            <span>{m.icon}</span>
            {m.label}
          </NavLink>
        ))}
      </nav>

      {/* User info + logout */}
      <div className="p-4 border-t border-primary-700">
        <p className="text-primary-200 text-xs truncate mb-2">{user?.email}</p>
        <button
          onClick={handleLogout}
          className="w-full text-left text-sm text-primary-200 hover:text-white transition-colors flex items-center gap-2"
        >
          🚪 Keluar
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* ─── Sidebar desktop ─── */}
      <aside className="hidden lg:flex w-56 bg-primary-600 flex-col flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* ─── Drawer mobile ─── */}
      {sideOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-56 bg-primary-600 flex-shrink-0 flex flex-col">
            <div className="flex justify-end p-3">
              <button onClick={() => setSideOpen(false)} className="text-white p-1" aria-label="Tutup menu">
                <HiX className="w-6 h-6" />
              </button>
            </div>
            <SidebarContent />
          </div>
          {/* Overlay */}
          <div className="flex-1 bg-black/40" onClick={() => setSideOpen(false)} />
        </div>
      )}

      {/* ─── Main content ─── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar mobile */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSideOpen(true)} className="text-gray-600" aria-label="Buka menu">
            <HiMenu className="w-6 h-6" />
          </button>
          <p className="font-semibold text-gray-800 text-sm">Admin {siteConfig.shortName}</p>
        </header>

        {/* Konten halaman admin */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
