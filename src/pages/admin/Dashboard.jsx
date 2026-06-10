import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { siteConfig } from '../../config/siteConfig';
import { formatDate } from '../../utils/formatters';

const MENUS = [
  { icon: '📢', label: 'Pengumuman',   path: '/admin/pengumuman', color: 'bg-blue-50   border-blue-200   text-blue-700' },
  { icon: '📰', label: 'Artikel',      path: '/admin/artikel',    color: 'bg-green-50  border-green-200  text-green-700' },
  { icon: '👥', label: 'Pengurus',     path: '/admin/anggota',    color: 'bg-purple-50 border-purple-200 text-purple-700' },
  { icon: '📸', label: 'Galeri',       path: '/admin/galeri',     color: 'bg-pink-50   border-pink-200   text-pink-700' },
  { icon: '📋', label: 'Program Kerja',path: '/admin/program',    color: 'bg-orange-50 border-orange-200 text-orange-700' },
  { icon: '📅', label: 'Kegiatan',     path: '/admin/kegiatan',   color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
  { icon: '🗣️', label: 'Aspirasi',    path: '/admin/aspirasi',   color: 'bg-red-50    border-red-200    text-red-700' },
];

export default function AdminDashboard() {
  const [stats, setStats]   = useState({ announcements:0, articles:0, aspirations:0, members:0 });
  const [recAsp, setRecAsp] = useState([]);

  useEffect(() => {
    async function load() {
      const cols = ['announcements','articles','aspirations','members'];
      const counts = {};
      for (const c of cols) { counts[c] = (await getDocs(collection(db, c))).size; }
      setStats(counts);
      const aspSnap = await getDocs(query(collection(db, 'aspirations'), orderBy('submittedAt', 'desc'), limit(5)));
      setRecAsp(aspSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
    load();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* Salam */}
      <div className="mb-8">
        <p className="font-arabic text-2xl text-primary-600 mb-1">بِسْمِ اللَّهِ</p>
        <h1 className="text-xl font-bold text-gray-800">Dashboard Admin</h1>
        <p className="text-gray-500 text-sm mt-0.5">{siteConfig.demaName} · Periode {siteConfig.periodYear}</p>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Pengumuman', value: stats.announcements, icon: '📢', color: 'bg-blue-50' },
          { label: 'Artikel',    value: stats.articles,      icon: '📰', color: 'bg-green-50' },
          { label: 'Aspirasi',   value: stats.aspirations,   icon: '🗣️', color: 'bg-red-50' },
          { label: 'Pengurus',   value: stats.members,       icon: '👥', color: 'bg-purple-50' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-2xl p-5 border border-white shadow-sm`}>
            <p className="text-3xl mb-2">{s.icon}</p>
            <p className="text-3xl font-extrabold text-gray-800">{s.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Menu kelola konten */}
      <h2 className="text-base font-semibold text-gray-700 mb-4">Kelola Konten</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
        {MENUS.map(m => (
          <Link key={m.path} to={m.path}
            className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border
                        ${m.color} hover:scale-105 active:scale-95 transition-transform text-center`}>
            <span className="text-3xl">{m.icon}</span>
            <span className="text-sm font-semibold">{m.label}</span>
          </Link>
        ))}
      </div>

      {/* Aspirasi terbaru */}
      <h2 className="text-base font-semibold text-gray-700 mb-4">Aspirasi Terbaru</h2>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {recAsp.length === 0 ? (
          <p className="text-center py-8 text-gray-400 text-sm">Belum ada aspirasi</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {recAsp.map(asp => (
              <div key={asp.id} className="px-5 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{asp.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {asp.category} · {asp.upvotes || 0} dukungan · {formatDate(asp.submittedAt, 'd MMM')}
                  </p>
                </div>
                <span className={`badge flex-shrink-0 ${
                  asp.status === 'completed'  ? 'bg-green-100 text-green-600' :
                  asp.status === 'processing' ? 'bg-yellow-100 text-yellow-600' :
                                                'bg-gray-100 text-gray-500'
                }`}>
                  {asp.status === 'completed' ? 'Selesai' : asp.status === 'processing' ? 'Diproses' : 'Diterima'}
                </span>
              </div>
            ))}
          </div>
        )}
        <div className="px-5 py-3 border-t border-gray-50 bg-gray-50">
          <Link to="/admin/aspirasi" className="text-sm text-primary-600 font-medium hover:underline">
            Kelola semua aspirasi →
          </Link>
        </div>
      </div>
    </div>
  );
}
