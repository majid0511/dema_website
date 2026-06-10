/**
 * Tombol scroll ke atas — muncul setelah user scroll ke bawah.
 * Memakai useScrollPosition hook.
 */
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollPosition } from '../hooks/useScrollPosition';

export default function ScrollToTop() {
  const { showScrollTop } = useScrollPosition();

  return (
    <AnimatePresence>
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 w-11 h-11 bg-primary-500 text-white
                     rounded-2xl shadow-lg flex items-center justify-center text-xl
                     hover:bg-primary-600 transition-colors"
          aria-label="Scroll ke atas"
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
}
