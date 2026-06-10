import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc, getDocs, updateDoc, doc, orderBy, query, serverTimestamp, increment } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { formatDate } from '../utils/formatters';
import { useNotify } from '../utils/useNotify';
import PageTransition from '../components/PageTransition';

const CATEGORIES  = ['Semua', 'Akademik', 'Fasilitas', 'Organisasi', 'Lainnya'];
const STATUS_MAP  = {
  received:   { bg: 'bg-gray-100',   text: 'text-gray-600',  label: 'Diterima' },
  processing: { bg: 'bg-yellow-100', text: 'text-yellow-700',label: 'Diproses' },
  completed:  { bg: 'bg-green-100',  text: 'text-green-700', label: 'Selesai' },
};

const EMPTY_FORM = { title: '', category: 'Akademik', message: '' };

export default function AspirationsPage() {
  const { notifyError, notifySuccess } = useNotify();
  const [aspirations, setAspirations] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [submitting,  setSubmitting]  = useState(false);
  const [showForm,    setShowForm]    = useState(false);
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [submitted,   setSubmitted]   = useState(false);
  const [filterCat,   setFilterCat]   = useState('Semua');
  const [filterStat,  setFilterStat]  = useState('Semua');

  useEffect(() => {
    getDocs(query(collection(db, 'aspirations'), orderBy('submittedAt', 'desc')))
      .then(snap => {
        setAspirations(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) return;
    setSubmitting(true);
    try {
      const ref = await addDoc(collection(db, 'aspirations'), {
        ...form, status: 'received', upvotes: 0, upvotedIPs: [],
        adminNote: null, submittedAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
      setAspirations(prev => [{
        id: ref.id, ...form, status: 'received', upvotes: 0,
        submittedAt: { toDate: () => new Date() },
      }, ...prev]);
      setForm(EMPTY_FORM);
      setShowForm(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
      notifySuccess('Berhasil', 'Aspirasi terkirim!');
    } catch (err) {
      notifyError('Gagal kirim aspirasi', 'Coba lagi');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpvote(id) {
    const voted = JSON.parse(localStorage.getItem('voted_asp') || '[]');
    if (voted.includes(id)) return;
    await updateDoc(doc(db, 'aspirations', id), { upvotes: increment(1) });
    setAspirations(prev => prev.map(a => a.id === id ? { ...a, upvotes: (a.upvotes || 0) + 1 } : a));
    localStorage.setItem('voted_asp', JSON.stringify([...voted, id]));
  }

  const votedList = JSON.parse(localStorage.getItem('voted_asp') || '[]');
  const filtered  = aspirations.filter(a => {
    const cOk = filterCat  === 'Semua' || a.category === filterCat;
    const sOk = filterStat === 'Semua' || a.status   === filterStat;
    return cOk && sOk;
  });

  return (
    <PageTransition>
      <div className="bg-gradient-to-br from-primary-600 to-primary-500 text-white py-20 px-4 text-center">
        <motion.h1 initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          className="text-4xl font-extrabold mb-2">Aspirasi Mahasiswa</motion.h1>
        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}
          className="text-white/80 max-w-md mx-auto">
          Sampaikan aspirasimu secara anonim. DEMA berkomitmen merespons setiap aspirasi.
        </motion.p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

        {/* Notif sukses */}
        {submitted && (
          <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
            className="bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-2xl mb-6 flex items-center gap-3">
            <span className="text-xl">✅</span>
            <p className="font-medium">Aspirasi berhasil dikirim! Terima kasih atas kepercayaanmu.</p>
          </motion.div>
        )}

        {/* Tombol buka form */}
        <button onClick={() => setShowForm(!showForm)}
          className="w-full bg-primary-500 text-white py-4 rounded-2xl font-semibold
                     hover:bg-primary-600 transition-colors flex items-center justify-center gap-2 mb-6 text-base">
          {showForm ? '✕ Batal' : '+ Kirim Aspirasi Baru (Anonim)'}
        </button>

        {/* Form aspirasi */}
        <AnimateForm show={showForm}>
          <form onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Judul Aspirasi *</label>
              <input type="text" required value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Tulis judul singkat aspirasimu"
                className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori *</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="input bg-white">
                {['Akademik','Fasilitas','Organisasi','Lainnya'].map(c =>
                  <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Isi Aspirasi *</label>
              <textarea required rows={4} value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                placeholder="Tuliskan aspirasimu secara detail dan jelas..."
                className="input resize-none" />
            </div>
            <p className="text-xs text-gray-400">
              🔒 Aspirasi dikirim secara anonim. Tidak ada data pribadimu yang disimpan.
            </p>
            <button type="submit" disabled={submitting}
              className="w-full bg-primary-500 text-white py-3 rounded-xl font-semibold
                         hover:bg-primary-600 disabled:opacity-50 transition-colors">
              {submitting ? 'Mengirim...' : 'Kirim Aspirasi'}
            </button>
          </form>
        </AnimateForm>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-6 items-center">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setFilterCat(c)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filterCat === c ? 'bg-primary-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300'
              }`}>
              {c}
            </button>
          ))}
          <select value={filterStat} onChange={e => setFilterStat(e.target.value)}
            className="ml-auto input max-w-[160px] text-sm py-2">
            <option value="Semua">Semua Status</option>
            <option value="received">Diterima</option>
            <option value="processing">Diproses</option>
            <option value="completed">Selesai</option>
          </select>
        </div>

        {/* Daftar aspirasi */}
        {loading ? (
          <p className="text-center text-gray-400 py-12">Memuat aspirasi...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-4">🗣️</p>
            <p>Belum ada aspirasi</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((asp, i) => {
              const st       = STATUS_MAP[asp.status] || STATUS_MAP.received;
              const hasVoted = votedList.includes(asp.id);
              return (
                <motion.div key={asp.id}
                  initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Badge status + kategori */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`badge ${st.bg} ${st.text}`}>{st.label}</span>
                        <span className="badge bg-gray-100 text-gray-500">{asp.category}</span>
                      </div>
                      {/* Judul */}
                      <h3 className="font-semibold text-gray-800 mb-1">{asp.title}</h3>
                      {/* Pesan */}
                      <p className="text-sm text-gray-500 leading-relaxed">{asp.message}</p>
                      {/* Tanggapan admin */}
                      {asp.adminNote && (
                        <div className="mt-3 bg-primary-50 border border-primary-100 rounded-xl px-4 py-3">
                          <p className="text-xs font-semibold text-primary-600 mb-1">💬 Tanggapan DEMA:</p>
                          <p className="text-sm text-primary-800">{asp.adminNote}</p>
                        </div>
                      )}
                      <p className="text-xs text-gray-400 mt-3">
                        {asp.submittedAt?.toDate ? formatDate(asp.submittedAt) : 'Baru saja'}
                      </p>
                    </div>
                    {/* Upvote */}
                    <button
                      onClick={() => handleUpvote(asp.id)} disabled={hasVoted}
                      className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl transition-all flex-shrink-0 ${
                        hasVoted
                          ? 'bg-primary-50 text-primary-500 cursor-default'
                          : 'bg-gray-50 text-gray-500 hover:bg-primary-50 hover:text-primary-500'
                      }`}
                      aria-label="Dukung aspirasi ini">
                      <span className="text-xl">{hasVoted ? '👍' : '👆'}</span>
                      <span className="text-xs font-bold">{asp.upvotes || 0}</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </PageTransition>
  );
}

// Helper animasi form collapse
function AnimateForm({ show, children }) {
  return (
    <motion.div
      initial={false}
      animate={{ height: show ? 'auto' : 0, opacity: show ? 1 : 0 }}
      transition={{ duration: 0.25 }}
      style={{ overflow: 'hidden' }}>
      {children}
    </motion.div>
  );
}
