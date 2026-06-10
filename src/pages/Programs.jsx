import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAllPrograms } from '../services/firestoreService';
import { DIVISIONS, PROGRAM_STATUS } from '../firebase/collections';
import { formatDate } from '../utils/formatters';
import PageTransition from '../components/PageTransition';
import SectionHeader  from '../components/SectionHeader';

const STATUS_CONFIG = {
  planned:   { label: 'Direncanakan', bg: 'bg-blue-100',   text: 'text-blue-700',  icon: '🗓️' },
  running:   { label: 'Berjalan',     bg: 'bg-yellow-100', text: 'text-yellow-700',icon: '⚡' },
  completed: { label: 'Selesai',      bg: 'bg-green-100',  text: 'text-green-700', icon: '✅' },
};

export default function ProgramsPage() {
  const [programs,      setPrograms]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [filterDiv,     setFilterDiv]     = useState('Semua');
  const [filterStatus,  setFilterStatus]  = useState('Semua');

  useEffect(() => {
    getAllPrograms().then(data => { setPrograms(data); setLoading(false); });
  }, []);

  const filtered = programs.filter(p => {
    const divOk    = filterDiv    === 'Semua' || p.division === filterDiv;
    const statusOk = filterStatus === 'Semua' || p.status   === filterStatus;
    return divOk && statusOk;
  });

  const counts = {
    planned:   programs.filter(p => p.status === 'planned').length,
    running:   programs.filter(p => p.status === 'running').length,
    completed: programs.filter(p => p.status === 'completed').length,
  };

  return (
    <PageTransition>
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-500 text-white py-20 px-4 text-center">
        <motion.h1 initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          className="text-4xl font-extrabold mb-3">Program Kerja</motion.h1>
        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}
          className="text-white/80 text-lg">Rencana dan realisasi program DEMA</motion.p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

        {/* Statistik program */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {Object.entries(counts).map(([status, count]) => {
            const cfg = STATUS_CONFIG[status];
            return (
              <div key={status} className={`${cfg.bg} rounded-2xl p-4 text-center`}>
                <p className="text-2xl font-bold text-gray-800">{count}</p>
                <p className={`text-sm font-medium ${cfg.text}`}>{cfg.icon} {cfg.label}</p>
              </div>
            );
          })}
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {/* Filter divisi */}
          <select value={filterDiv} onChange={e => setFilterDiv(e.target.value)}
            className="input max-w-xs text-sm">
            <option value="Semua">Semua Divisi</option>
            {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          {/* Filter status */}
          <div className="flex gap-2 flex-wrap">
            {['Semua', ...Object.keys(STATUS_CONFIG)].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  filterStatus === s ? 'bg-primary-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300'
                }`}>
                {s === 'Semua' ? 'Semua Status' : STATUS_CONFIG[s]?.label}
              </button>
            ))}
          </div>
        </div>

        {/* Daftar program */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-4">📋</p>
            <p>Tidak ada program yang ditemukan</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((prog, i) => {
              const cfg = STATUS_CONFIG[prog.status] || STATUS_CONFIG.planned;
              return (
                <motion.div key={prog.id}
                  initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`badge ${cfg.bg} ${cfg.text}`}>{cfg.icon} {cfg.label}</span>
                        <span className="badge bg-gray-100 text-gray-500">{prog.division}</span>
                      </div>
                      <h3 className="font-semibold text-gray-800 text-base mb-1">{prog.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{prog.description}</p>
                    </div>
                    {prog.targetDate && (
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-gray-400">Target</p>
                        <p className="text-sm font-medium text-gray-700">{formatDate(prog.targetDate, 'MMM yyyy')}</p>
                      </div>
                    )}
                  </div>

                  {/* Progress bar visual */}
                  {prog.status !== 'planned' && (
                    <div className="mt-4">
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${
                            prog.status === 'completed' ? 'bg-green-500 w-full' : 'bg-yellow-400 w-1/2'
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
