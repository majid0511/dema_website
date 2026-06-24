import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase/firebaseConfig';

export default function AnnouncementTicker() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(
      collection(db, 'announcements'),
      where('isUrgent', '==', true),
      orderBy('publishedAt', 'desc'),
      limit(5)
    );
    const unsub = onSnapshot(q, snap => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const tickerHeight = (items.length > 0 && !dismissed) ? 32 : 0;
    document.documentElement.style.setProperty('--ticker-h', `${tickerHeight}px`);
  }, [items, dismissed]);

  if (loading || items.length === 0) return null;

  const duration = Math.max(16, items.length * 8);
  const displayItems = [...items, ...items]; // Duplicate array for seamless loop

  return (
    <>
      <style>{`
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .ticker-track {
          animation: ticker-scroll ${duration}s linear infinite;
          will-change: transform;
          display: inline-flex;
          white-space: nowrap;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      <AnimatePresence>
        {!dismissed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 32, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden bg-red-600 relative flex items-center w-full"
          >
            {/* Ticker Content container */}
            <div className="flex-1 overflow-hidden relative h-full flex items-center pl-28 pr-10">
              <div className="ticker-track items-center h-full">
                {displayItems.map((item, idx) => (
                  <span 
                    key={`${item.id}-${idx}`} 
                    className="text-white text-xs font-medium cursor-pointer hover:underline flex-shrink-0"
                    onClick={() => navigate(`/pengumuman/${item.id}`)}
                  >
                    {item.title}
                    {idx < displayItems.length - 1 && (
                      <span className="text-yellow-400 no-underline inline-block">{"\u00A0·\u00A0"}</span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Left Badge (Sticky) */}
            <div className="absolute left-0 top-0 bottom-0 flex items-center bg-red-600 px-4 z-10 shadow-[10px_0_15px_-3px_rgba(220,38,38,1)]">
              <span className="bg-white text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide border border-white/20">
                📢 Penting
              </span>
            </div>

            {/* Right Close Button (Sticky) */}
            <div className="absolute right-0 top-0 bottom-0 flex items-center bg-red-600 px-3 z-10 shadow-[-10px_0_15px_-3px_rgba(220,38,38,1)]">
              <button 
                onClick={() => setDismissed(true)}
                className="text-white/80 hover:text-white p-1 rounded transition-colors flex items-center justify-center"
                aria-label="Tutup ticker"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
