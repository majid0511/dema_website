import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getLatestAnnouncements } from '../services/firestoreService';
import PageTransition   from '../components/PageTransition';
import SectionHeader    from '../components/SectionHeader';
import AnnouncementCard from '../components/AnnouncementCard';

const CATEGORIES = ['Semua', 'Akademik', 'Kegiatan', 'Umum', 'Penting'];

export default function AnnouncementsPage() {
  const [all,      setAll]      = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('Semua');

  useEffect(() => {
    getLatestAnnouncements(50).then(data => { setAll(data); setLoading(false); });
  }, []);

  const filtered = all.filter(a => {
    const matchSearch = a.title?.toLowerCase().includes(search.toLowerCase()) ||
                        a.content?.toLowerCase().includes(search.toLowerCase());
    const matchCat    = category === 'Semua' || a.category?.toLowerCase() === category.toLowerCase();
    return matchSearch && matchCat;
  });

  return (
    <PageTransition>
      <div className="bg-gradient-to-br from-primary-600 to-primary-500 text-white py-20 px-4 text-center">
        <motion.h1 initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          className="text-4xl font-extrabold mb-2">Pengumuman</motion.h1>
        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}
          className="text-white/80">Informasi resmi dari DEMA</motion.p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input type="search" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍  Cari pengumuman..."
            className="input flex-1" />
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  category === c ? 'bg-primary-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300'
                }`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-44" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">📭</p>
            <p>Tidak ada pengumuman ditemukan</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-4">{filtered.length} pengumuman</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((a, i) => (
                <motion.div key={a.id}
                  initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay: i * 0.04 }}>
                  <AnnouncementCard announcement={a} />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </PageTransition>
  );
}
