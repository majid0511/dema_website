import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { siteConfig } from '../config/siteConfig';
import PageTransition   from '../components/PageTransition';
import SectionHeader    from '../components/SectionHeader';
import AnnouncementCard from '../components/AnnouncementCard';
import ArticleCard      from '../components/ArticleCard';
import EventCard        from '../components/EventCard';

const QUICK_MENU = [
  { icon: '📢', label: 'Pengumuman',  path: '/pengumuman',    color: 'bg-blue-50   text-blue-700' },
  { icon: '📰', label: 'Artikel',     path: '/artikel',       color: 'bg-emerald-50 text-emerald-700' },
  { icon: '📅', label: 'Kegiatan',    path: '/kegiatan',      color: 'bg-yellow-50 text-yellow-700' },
  { icon: '🏛️', label: 'Struktur',   path: '/struktur',      color: 'bg-purple-50 text-purple-700' },
  { icon: '🗣️', label: 'Aspirasi',   path: '/aspirasi',      color: 'bg-red-50    text-red-700' },
  { icon: '📸', label: 'Galeri',      path: '/galeri',        color: 'bg-pink-50   text-pink-700' },
  { icon: '📋', label: 'Program',     path: '/program-kerja', color: 'bg-orange-50 text-orange-700' },
  { icon: '📞', label: 'Kontak',      path: '/kontak',        color: 'bg-teal-50   text-teal-700' },
];

const stagger = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0 },
};

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-gray-100 rounded-2xl p-5 h-44">
      <div className="h-3 bg-gray-200 rounded mb-3 w-1/3" />
      <div className="h-4 bg-gray-200 rounded mb-2 w-4/5" />
      <div className="h-3 bg-gray-200 rounded mb-2 w-full" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
    </div>
  );
}

export default function HomePage() {
  const [announcements, setAnnouncements] = useState([]);
  const [articles,      setArticles]      = useState([]);
  const [events,        setEvents]        = useState([]);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [annSnap, artSnap, evtSnap] = await Promise.all([
          getDocs(query(collection(db, 'announcements'), orderBy('publishedAt', 'desc'), limit(3))),
          getDocs(query(collection(db, 'articles'), where('isPublished', '==', true), orderBy('publishedAt', 'desc'), limit(3))),
          getDocs(query(collection(db, 'events'), where('status', '==', 'upcoming'), orderBy('startDate', 'asc'), limit(3))),
        ]);
        setAnnouncements(annSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setArticles(artSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setEvents(evtSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error('Gagal fetch beranda:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  return (
    <PageTransition>

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-gradient-to-br from-primary-700 via-primary-500 to-primary-400">
        {/* Pola islami background */}
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 w-full">
          <div className="max-w-3xl mx-auto text-center text-white">

            {/* Badge periode */}
            <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25
                         text-white text-sm px-5 py-2 rounded-full mb-8">
              🌙 Kepengurusan {siteConfig.periodYear}
            </motion.div>

            {/* Ayat */}
            <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.25 }}
              className="font-arabic text-3xl sm:text-4xl text-yellow-200 mb-1 leading-relaxed">
              {siteConfig.heroAyat}
            </motion.p>
            <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.35 }}
              className="text-white/60 text-sm italic mb-10">
              "{siteConfig.heroAyatTrans}" — {siteConfig.heroAyatSource}
            </motion.p>

            {/* Judul */}
            <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
              {siteConfig.heroTitle}
            </motion.h1>
            <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
              className="text-lg sm:text-xl text-white/80 mb-2">
              {siteConfig.heroSubtitle}
            </motion.p>
            <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.55 }}
              className="text-white/50 text-sm mb-10">
              {siteConfig.campusName}
            </motion.p>

            {/* CTA */}
            <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.65 }}
              className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/tentang"
                className="bg-white text-primary-600 px-8 py-3.5 rounded-2xl font-bold
                           hover:bg-primary-50 transition-colors shadow-lg text-sm sm:text-base">
                Tentang DEMA →
              </Link>
              <Link to="/aspirasi"
                className="border-2 border-white/60 text-white px-8 py-3.5 rounded-2xl font-semibold
                           hover:bg-white/10 transition-colors text-sm sm:text-base">
                💬 Kirim Aspirasi
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Gelombang bawah */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 70" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 70L1440 70L1440 20C1200 70 960 0 720 35C480 70 240 5 0 35L0 70Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      {/* ═══ QUICK MENU ═══ */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader title="Akses Cepat" subtitle="Temukan informasi yang kamu butuhkan" />
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once:true }}
            className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-3 mt-8">
            {QUICK_MENU.map(m => (
              <motion.div key={m.path} variants={fadeUp}>
                <Link to={m.path}
                  className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl ${m.color}
                              hover:scale-105 active:scale-95 transition-transform text-center`}>
                  <span className="text-2xl sm:text-3xl">{m.icon}</span>
                  <span className="text-[11px] sm:text-xs font-semibold leading-tight">{m.label}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ PENGUMUMAN ═══ */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader title="Pengumuman Terbaru" subtitle="Informasi resmi dari DEMA"
            linkTo="/pengumuman" linkLabel="Lihat semua" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
            {loading
              ? [1,2,3].map(i => <SkeletonCard key={i} />)
              : announcements.length > 0
                ? announcements.map(a => <AnnouncementCard key={a.id} announcement={a} />)
                : <p className="col-span-3 text-center text-gray-400 py-10">Belum ada pengumuman</p>
            }
          </div>
        </div>
      </section>

      {/* ═══ ARTIKEL ═══ */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader title="Artikel Terbaru" subtitle="Tulisan dan berita dari DEMA"
            linkTo="/artikel" linkLabel="Lihat semua" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
            {!loading && (articles.length > 0
              ? articles.map(a => <ArticleCard key={a.id} article={a} />)
              : <p className="col-span-3 text-center text-gray-400 py-10">Belum ada artikel</p>
            )}
          </div>
        </div>
      </section>

      {/* ═══ KEGIATAN ═══ */}
      {events.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <SectionHeader title="Kegiatan Mendatang" subtitle="Jangan sampai ketinggalan"
              linkTo="/kegiatan" linkLabel="Lihat semua" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
              {events.map(e => <EventCard key={e.id} event={e} />)}
            </div>
          </div>
        </section>
      )}

      {/* ═══ VISI MISI ═══ */}
      <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="text-center mb-10">
            <p className="font-arabic text-2xl text-yellow-200 mb-6">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
            <h2 className="text-3xl font-bold mb-3">Visi Kami</h2>
            <p className="text-white/85 text-lg leading-relaxed max-w-2xl mx-auto">{siteConfig.visi}</p>
          </motion.div>

          <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            transition={{ delay:0.2 }}>
            <h3 className="text-xl font-semibold text-center mb-6">Misi Kami</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {siteConfig.misi.map((m, i) => (
                <div key={i} className="flex items-start gap-3 bg-white/10 rounded-2xl p-4">
                  <span className="text-yellow-300 font-bold text-lg mt-0.5">{i+1}.</span>
                  <p className="text-white/90 text-sm leading-relaxed">{m}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="text-center mt-10">
            <Link to="/tentang"
              className="inline-flex items-center gap-2 bg-white text-primary-600 px-7 py-3
                         rounded-2xl font-semibold hover:bg-primary-50 transition-colors shadow">
              Pelajari lebih lanjut →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ CTA ASPIRASI ═══ */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
            <p className="text-5xl mb-5">🗣️</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
              Ada aspirasi untuk DEMA?
            </h2>
            <p className="text-gray-500 mb-7 leading-relaxed">
              Sampaikan aspirasimu secara anonim. Kami berkomitmen mendengar dan merespons setiap masukan.
            </p>
            <Link to="/aspirasi" className="btn-primary text-base inline-block">
              Kirim Aspirasi Sekarang
            </Link>
          </motion.div>
        </div>
      </section>

    </PageTransition>
  );
}
