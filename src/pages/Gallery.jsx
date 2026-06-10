import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllGallery } from '../services/firestoreService';
import { formatDate } from '../utils/formatters';
import PageTransition from '../components/PageTransition';

export default function GalleryPage() {
  const [albums,   setAlbums]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);   // Album yang dibuka
  const [lightbox, setLightbox] = useState(null);   // Foto yang di-zoom

  useEffect(() => {
    getAllGallery().then(d => { setAlbums(d); setLoading(false); });
  }, []);

  return (
    <PageTransition>
      <div className="bg-gradient-to-br from-primary-600 to-primary-500 text-white py-20 px-4 text-center">
        <motion.h1 initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          className="text-4xl font-extrabold mb-2">Galeri</motion.h1>
        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}
          className="text-white/80">Dokumentasi kegiatan DEMA</motion.p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-2xl aspect-video" />
            ))}
          </div>
        ) : albums.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">📸</p>
            <p>Belum ada foto galeri</p>
          </div>
        ) : selected ? (
          /* ── Tampilan album yang dipilih ── */
          <div>
            <button onClick={() => setSelected(null)}
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-6">
              ← Kembali ke semua album
            </button>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{selected.title}</h2>
              <p className="text-gray-500 text-sm mt-1">
                {selected.photos?.length || 0} foto · {formatDate(selected.eventDate)}
              </p>
              {selected.description && <p className="text-gray-600 mt-2">{selected.description}</p>}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {(selected.photos || []).map((photo, i) => (
                <motion.div key={i}
                  initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
                  transition={{ delay: i * 0.04 }}
                  className="aspect-square bg-gray-100 rounded-2xl overflow-hidden cursor-pointer group"
                  onClick={() => setLightbox(photo)}>
                  <img src={photo.url} alt={photo.caption || `Foto ${i+1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy" />
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          /* ── Grid album ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {albums.map((album, i) => (
              <motion.div key={album.id}
                initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer
                           hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                onClick={() => setSelected(album)}>
                {/* Cover album */}
                <div className="aspect-video bg-primary-50 overflow-hidden">
                  {album.coverUrl ? (
                    <img src={album.coverUrl} alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">📸</div>
                  )}
                </div>
                {/* Info album */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">{album.title}</h3>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{album.photos?.length || 0} foto</span>
                    <span>{formatDate(album.eventDate, 'd MMM yyyy')}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}>
            <motion.img
              initial={{ scale:0.8 }} animate={{ scale:1 }} exit={{ scale:0.8 }}
              src={lightbox.url}
              alt={lightbox.caption || 'Foto'}
              className="max-w-full max-h-[90vh] rounded-2xl object-contain"
              onClick={e => e.stopPropagation()}
            />
            {lightbox.caption && (
              <p className="absolute bottom-6 left-0 right-0 text-center text-white/80 text-sm">
                {lightbox.caption}
              </p>
            )}
            <button
              className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 transition-colors"
              onClick={() => setLightbox(null)} aria-label="Tutup">
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
