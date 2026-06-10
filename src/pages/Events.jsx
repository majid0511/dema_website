import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAll } from '../services/firestoreService';
import { orderBy } from 'firebase/firestore';
import { formatDate } from '../utils/formatters';
import PageTransition from '../components/PageTransition';
import SectionHeader  from '../components/SectionHeader';
import EventCard      from '../components/EventCard';

const STATUS_TABS = [
  { key: 'Semua',    label: '📋 Semua' },
  { key: 'upcoming', label: '🔜 Akan Datang' },
  { key: 'ongoing',  label: '⚡ Berlangsung' },
  { key: 'completed',label: '✅ Selesai' },
];

export default function EventsPage() {
  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState('Semua');

  useEffect(() => {
    getAll('events', [orderBy('startDate', 'desc')])
      .then(d => { setEvents(d); setLoading(false); });
  }, []);

  const filtered = tab === 'Semua' ? events : events.filter(e => e.status === tab);

  // Kelompokkan berdasarkan bulan untuk tampilan kalender
  const byMonth = filtered.reduce((acc, evt) => {
    const date  = evt.startDate?.toDate ? evt.startDate.toDate() : new Date();
    const month = formatDate(evt.startDate, 'MMMM yyyy');
    if (!acc[month]) acc[month] = [];
    acc[month].push(evt);
    return acc;
  }, {});

  return (
    <PageTransition>
      <div className="bg-gradient-to-br from-primary-600 to-primary-500 text-white py-20 px-4 text-center">
        <motion.h1 initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          className="text-4xl font-extrabold mb-2">Kalender Kegiatan</motion.h1>
        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}
          className="text-white/80">Agenda kegiatan DEMA sepanjang periode</motion.p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

        {/* Tabs filter status */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 flex-wrap">
          {STATUS_TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                tab === t.key ? 'bg-primary-500 text-white shadow' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">📅</p>
            <p>Tidak ada kegiatan</p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(byMonth).map(([month, evts]) => (
              <div key={month}>
                {/* Header bulan */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 font-bold text-sm">
                    {new Date(month).getMonth() + 1}
                  </div>
                  <h2 className="text-lg font-bold text-gray-800">{month}</h2>
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-sm text-gray-400">{evts.length} kegiatan</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {evts.map((e, i) => (
                    <motion.div key={e.id}
                      initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                      transition={{ delay: i * 0.05 }}>
                      <EventCard event={e} />
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
