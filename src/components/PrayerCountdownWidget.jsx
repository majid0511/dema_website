import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getUpcomingEvents } from '../services/firestoreService';
import { formatDate } from '../utils/formatters';

export default function PrayerCountdownWidget() {
  const [prayer, setPrayer] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [countdown, setCountdown] = useState({ d: '00', h: '00', m: '00', s: '00', done: false });
  const [activePrayer, setActivePrayer] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const date = String(today.getDate()).padStart(2, '0');
        
        // Jombang city ID in MyQuran API is 1614
        const prayerPromise = fetch(`https://api.myquran.com/v2/sholat/jadwal/1614/${year}/${month}/${date}`).then(res => res.json());
        const eventPromise = getUpcomingEvents(1);

        const [prayerRes, eventRes] = await Promise.allSettled([prayerPromise, eventPromise]);

        if (prayerRes.status === 'fulfilled' && prayerRes.value.status) {
          setPrayer(prayerRes.value.data.jadwal);
        } else {
          setError(true);
        }

        if (eventRes.status === 'fulfilled' && eventRes.value.length > 0) {
          setEvent(eventRes.value[0]);
        }
      } catch (err) {
        console.error("Widget fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const parseTimeToday = (timeStr) => {
    if (!timeStr) return new Date();
    const [hours, minutes] = timeStr.split(':').map(Number);
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    return d;
  };

  useEffect(() => {
    if (!prayer) return;

    const checkPrayerTimes = () => {
      const now = new Date();
      const times = [
        { id: 'subuh', label: 'Subuh', time: parseTimeToday(prayer.subuh) },
        { id: 'dzuhur', label: 'Dzuhur', time: parseTimeToday(prayer.dzuhur) },
        { id: 'ashar', label: 'Ashar', time: parseTimeToday(prayer.ashar) },
        { id: 'maghrib', label: 'Maghrib', time: parseTimeToday(prayer.maghrib) },
        { id: 'isya', label: 'Isya', time: parseTimeToday(prayer.isya) },
      ];

      let active = null;
      let next = times[0].label; // Default next is Subuh

      for (let i = 0; i < times.length; i++) {
        if (now >= times[i].time) {
          active = times[i].label;
          next = i + 1 < times.length ? times[i + 1].label : times[0].label;
        }
      }

      // If before Subuh, no active prayer, next is Subuh
      if (now < times[0].time) {
        active = null;
        next = times[0].label;
      }

      setActivePrayer(active);
      setNextPrayer(next);
    };

    checkPrayerTimes();
    const timer = setInterval(checkPrayerTimes, 60000);
    return () => clearInterval(timer);
  }, [prayer]);

  useEffect(() => {
    if (!event || !event.startDate) return;

    const eventDate = event.startDate.toDate ? event.startDate.toDate() : new Date(event.startDate);

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = eventDate.getTime() - now;

      if (distance < 0) {
        setCountdown({ done: true });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const dStr = String(days).padStart(2, '0');
      const hStr = String(hours).padStart(2, '0');
      const mStr = String(minutes).padStart(2, '0');
      const sStr = String(seconds).padStart(2, '0');

      setCountdown({ d: dStr, h: hStr, m: mStr, s: sStr, done: false });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [event]);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-pulse flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="flex justify-between">
             <div className="h-10 bg-gray-200 rounded w-12"></div>
             <div className="h-10 bg-gray-200 rounded w-12"></div>
             <div className="h-10 bg-gray-200 rounded w-12"></div>
             <div className="h-10 bg-gray-200 rounded w-12"></div>
             <div className="h-10 bg-gray-200 rounded w-12"></div>
          </div>
        </div>
        <div className="w-px bg-gray-100 hidden md:block"></div>
        <div className="md:w-1/3 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50/80 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-6 sm:p-10 backdrop-blur-xl"
    >
      {/* Dekorasi Abstract Blob */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* KIRI: Jadwal Sholat */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 text-2xl shadow-sm border border-primary-100/50">
              🕌
            </div>
            <div>
              <h3 className="font-extrabold text-gray-800 text-lg tracking-tight">Jadwal Sholat <span className="text-primary-600">— Jombang</span></h3>
              <p className="text-sm font-medium text-gray-500 mt-0.5">
                {prayer?.tanggal || formatDate(new Date(), 'EEEE, d MMMM yyyy')}
              </p>
            </div>
          </div>

          {error || !prayer ? (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm text-center border border-red-100">
              Jadwal tidak tersedia saat ini.
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-2 sm:gap-3 text-center overflow-x-auto pt-4 pb-4 -mt-4 hide-scrollbar">
              {[
                { id: 'subuh', label: 'Subuh', time: prayer.subuh },
                { id: 'dzuhur', label: 'Dzuhur', time: prayer.dzuhur },
                { id: 'ashar', label: 'Ashar', time: prayer.ashar },
                { id: 'maghrib', label: 'Maghrib', time: prayer.maghrib },
                { id: 'isya', label: 'Isya', time: prayer.isya },
              ].map(p => {
                const isActive = activePrayer === p.label;
                const isNext = nextPrayer === p.label;
                return (
                  <motion.div 
                    key={p.id} 
                    whileHover={{ y: -4 }}
                    className={`flex flex-col items-center justify-center py-4 px-1 rounded-2xl transition-all duration-300 min-w-[70px] sm:min-w-[80px] relative
                      ${isActive 
                        ? 'bg-primary-600 text-white shadow-[0_8px_20px_rgb(22,92,61,0.3)] scale-105 z-10 border border-primary-500' 
                        : 'bg-white text-gray-700 shadow-[0_2px_12px_rgb(0,0,0,0.04)] border border-gray-50 hover:shadow-md'}`}
                  >
                    <span className={`text-[11px] sm:text-xs font-semibold mb-1 uppercase tracking-wider ${isActive ? 'text-primary-100' : 'text-gray-400'}`}>{p.label}</span>
                    <span className={`font-bold text-xl tracking-tight ${isActive ? 'text-white' : 'text-gray-800'}`}>{p.time}</span>
                    {isNext && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-yellow-200 shadow-sm">
                        Berikutnya
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* DIVIDER */}
        <div className="w-full h-px md:w-px md:h-auto bg-gradient-to-b from-transparent via-gray-200 to-transparent opacity-60"></div>

        {/* KANAN: Countdown Kegiatan */}
        <div className="md:w-[35%] lg:w-1/3 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600 text-2xl shadow-sm border border-yellow-100/50">
              📅
            </div>
            <h3 className="font-extrabold text-gray-800 text-lg tracking-tight">Kegiatan Terdekat</h3>
          </div>

          {event ? (
            <div className="group">
              <p className="font-bold text-gray-800 mb-5 truncate text-lg transition-colors group-hover:text-primary-600" title={event.title}>{event.title}</p>
              
              {countdown.done ? (
                <div className="inline-flex items-center justify-center gap-2 bg-green-50 text-green-600 font-bold px-4 py-3 rounded-xl border border-green-100 w-full">
                  <span>✅</span> Berlangsung / Selesai
                </div>
              ) : (
                <div className="flex items-start gap-1.5 sm:gap-2">
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-full aspect-square bg-white rounded-xl border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)] flex items-center justify-center">
                      <span className="font-mono font-bold text-2xl text-primary-600">{countdown.d}</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 mt-2 tracking-wider">HARI</span>
                  </div>
                  <div className="pt-3 font-bold text-gray-300 text-xl">:</div>
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-full aspect-square bg-white rounded-xl border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)] flex items-center justify-center">
                      <span className="font-mono font-bold text-2xl text-gray-700">{countdown.h}</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 mt-2 tracking-wider">JAM</span>
                  </div>
                  <div className="pt-3 font-bold text-gray-300 text-xl">:</div>
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-full aspect-square bg-white rounded-xl border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)] flex items-center justify-center">
                      <span className="font-mono font-bold text-2xl text-gray-700">{countdown.m}</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 mt-2 tracking-wider">MNT</span>
                  </div>
                  <div className="pt-3 font-bold text-gray-300 text-xl">:</div>
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-full aspect-square bg-white rounded-xl border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)] flex items-center justify-center">
                      <span className="font-mono font-bold text-2xl text-gray-700">{countdown.s}</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 mt-2 tracking-wider">DTK</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3 text-gray-500 bg-gray-50/80 rounded-2xl p-6 border border-gray-100 border-dashed">
              <span className="text-2xl opacity-50">📭</span>
              <span className="text-sm font-medium">Tidak ada kegiatan terjadwal</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
