import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from './CountUp';
import { siteConfig } from '../config/siteConfig';

export default function LoadingScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleEnd = () => {
    // Beri sedikit jeda di 100% sebelum mulai menghilang
    setTimeout(() => {
      setIsVisible(false);
      // Panggil onComplete setelah animasi exit selesai
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 800); 
    }, 400); 
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ backgroundColor: siteConfig.primaryColor }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center text-white overflow-hidden"
        >
          {/* Efek gradient di background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.8),transparent_70%)]" />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-10">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex flex-col items-center gap-5"
            >
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-3xl p-3 shadow-2xl flex items-center justify-center">
                <img 
                  src={siteConfig.logo} 
                  alt="Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              {/* <div className="text-center">
                <h2 className="text-2xl sm:text-4xl font-bold tracking-widest">{siteConfig.shortName}</h2>
                <p className="text-sm sm:text-lg text-white/80 mt-1">{siteConfig.campusName}</p>
              </div> */}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="flex items-baseline gap-1">
                <CountUp
                  from={0}
                  to={103}
                  duration={2.5}
                  onEnd={handleEnd}
                  className="text-6xl sm:text-8xl font-bold font-mono tracking-tighter"
                  style={{ color: siteConfig.accentColor }}
                />
                <span className="text-3xl sm:text-5xl font-bold opacity-60" style={{ color: siteConfig.accentColor }}>%</span>
              </div>
              
              <div className="w-64 sm:w-80 h-1.5 bg-white/10 rounded-full overflow-hidden relative">
                <motion.div 
                  className="absolute top-0 left-0 h-full rounded-full"
                  style={{ backgroundColor: siteConfig.accentColor }}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.5, ease: "linear" }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
