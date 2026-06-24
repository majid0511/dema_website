import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

export default function NotFoundPage() {
  return (
    <PageTransition>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-lg">

          {/* Animated 404 Number */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="relative inline-block mb-8"
          >
            <span className="text-[10rem] sm:text-[12rem] font-black leading-none bg-gradient-to-br from-primary-600 via-primary-400 to-primary-600 bg-clip-text text-transparent select-none">
              404
            </span>
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="absolute top-6 -right-4 text-5xl sm:text-6xl"
            >
              🔍
            </motion.div>
          </motion.div>

          {/* Text */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-3"
          >
            Halaman Tidak Ditemukan
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-500 mb-10 text-base sm:text-lg leading-relaxed"
          >
            Maaf, halaman yang Anda cari tidak ada atau sudah dipindahkan.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              to="/"
              className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm"
            >
              ← Kembali ke Beranda
            </Link>
            <Link
              to="/pengumuman"
              className="btn-outline inline-flex items-center gap-2 px-6 py-3 text-sm"
            >
              📢 Lihat Pengumuman
            </Link>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
