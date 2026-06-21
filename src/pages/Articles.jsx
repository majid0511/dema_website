import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { collection, query, orderBy, limit, startAfter, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import PageTransition from '../components/PageTransition';
import ArticleCard    from '../components/ArticleCard';

const CATS = ['Semua', 'Berita', 'Opini', 'Kegiatan', 'Prestasi'];
const PAGE_SIZE = 9;

export default function ArticlesPage() {
  const [all,     setAll]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [cat,     setCat]     = useState('Semua');

  // Pagination states
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const lastDocRef = useRef(null);

  async function fetchInitial() {
    setLoading(true);
    const q = query(collection(db, 'articles'), where('isPublished', '==', true), orderBy('publishedAt', 'desc'), limit(PAGE_SIZE));
    const snap = await getDocs(q);
    setAll(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    lastDocRef.current = snap.docs[snap.docs.length - 1] ?? null;
    setHasMore(snap.docs.length === PAGE_SIZE);
    setLoading(false);
  }

  async function fetchMore() {
    if (!hasMore || loadingMore || !lastDocRef.current) return;
    setLoadingMore(true);
    const q = query(
      collection(db, 'articles'), 
      where('isPublished', '==', true),
      orderBy('publishedAt', 'desc'), 
      startAfter(lastDocRef.current), 
      limit(PAGE_SIZE)
    );
    const snap = await getDocs(q);
    setAll(prev => [...prev, ...snap.docs.map(d => ({ id: d.id, ...d.data() }))]);
    lastDocRef.current = snap.docs[snap.docs.length - 1] ?? null;
    setHasMore(snap.docs.length === PAGE_SIZE);
    setLoadingMore(false);
  }

  useEffect(() => {
    fetchInitial();
  }, []);

  const filtered = all.filter(a => {
    const matchS = a.title?.toLowerCase().includes(search.toLowerCase());
    const matchC = cat === 'Semua' || a.category?.toLowerCase() === cat.toLowerCase();
    return matchS && matchC;
  });

  return (
    <PageTransition>
      <div className="bg-gradient-to-br from-primary-600 to-primary-500 text-white py-20 px-4 text-center">
        <motion.h1 initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          className="text-4xl font-extrabold mb-2">Artikel</motion.h1>
        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}
          className="text-white/80">Tulisan dan berita dari DEMA</motion.p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input type="search" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍  Cari artikel..." className="input flex-1" />
          <div className="flex gap-2 flex-wrap">
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  cat === c ? 'bg-primary-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300'
                }`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map(i => <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-72" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">📭</p><p>Tidak ada artikel ditemukan</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((a, i) => (
                <motion.div key={a.id}
                  initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay: i * 0.04 }}>
                  <ArticleCard article={a} />
                </motion.div>
              ))}
            </div>

            {/* Tombol Load More */}
            {hasMore && (
              <div className="text-center mt-10">
                <button
                  onClick={fetchMore}
                  disabled={loadingMore}
                  className="btn-outline disabled:opacity-50"
                >
                  {loadingMore ? 'Memuat...' : 'Muat Lebih Banyak'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </PageTransition>
  );
}
