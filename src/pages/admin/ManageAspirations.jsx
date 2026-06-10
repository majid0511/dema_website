/**
 * Halaman admin: kelola aspirasi mahasiswa.
 * Admin bisa mengubah status, memberikan tanggapan/balasan, dan menghapus.
 */
import { useState, useEffect } from 'react';
import { getAll, update, remove } from '../../services/firestoreService';
import { formatDate } from '../../utils/formatters';
import { useNotify } from '../../utils/useNotify';
import { useConfirm } from '../../utils/useConfirm';

const STATUS_CONFIG = {
  received:   { label: 'Diterima', bg: 'bg-gray-100',   text: 'text-gray-600' },
  processing: { label: 'Diproses', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  completed:  { label: 'Selesai',  bg: 'bg-green-100',  text: 'text-green-700' },
};

export default function AdminAspirations() {
  const { notifySuccess, notifyError } = useNotify();
  const { confirm } = useConfirm();
  const [items,      setItems]     = useState([]);
  const [loading,    setLoading]   = useState(true);
  const [replyId,    setReplyId]   = useState(null);   // ID aspirasi yang sedang dibalas
  const [replyNote,  setReplyNote] = useState('');
  const [saving,     setSaving]    = useState(false);
  const [filterStat, setFilterStat]= useState('Semua');
  const [filterCat,  setFilterCat] = useState('Semua');
  const [search,     setSearch]    = useState('');

  useEffect(() => {
    getAll('aspirations', []).then(d => {
      // Urutkan: upvotes terbanyak dulu
      setItems(d.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0)));
      setLoading(false);
    });
  }, []);

  /** Ubah status aspirasi */
  async function changeStatus(id, status) {
    await update('aspirations', id, { status });
    setItems(prev => prev.map(it => it.id === id ? { ...it, status } : it));
  }

  /** Simpan balasan/tanggapan admin */
  async function saveReply(id) {
    if (!replyNote.trim()) return;
    setSaving(true);
    try {
      await update('aspirations', id, {
        adminNote: replyNote,
        status: 'processing', // otomatis ubah status ke diproses
      });
      setItems(prev => prev.map(it =>
        it.id === id ? { ...it, adminNote: replyNote, status: 'processing' } : it
      ));
      setReplyId(null);
      setReplyNote('');
      notifySuccess('Tanggapan disimpan', 'Berhasil');
    } catch (err) {
      notifyError('Gagal menyimpan tanggapan', err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!(await confirm({ message: 'Hapus aspirasi ini?', danger: true }))) return;
    await remove('aspirations', id);
    setItems(prev => prev.filter(it => it.id !== id));
    notifySuccess('Aspirasi dihapus', 'Berhasil');
  }

  const filtered = items.filter(a => {
    const sOk = filterStat === 'Semua' || a.status   === filterStat;
    const cOk = filterCat  === 'Semua' || a.category === filterCat;
    const qOk = !search || a.title?.toLowerCase().includes(search.toLowerCase()) ||
                           a.message?.toLowerCase().includes(search.toLowerCase());
    return sOk && cOk && qOk;
  });

  const counts = {
    received:   items.filter(a => a.status === 'received').length,
    processing: items.filter(a => a.status === 'processing').length,
    completed:  items.filter(a => a.status === 'completed').length,
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold text-gray-800 mb-6">🗣️ Kelola Aspirasi</h1>

      {/* Statistik */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {Object.entries(STATUS_CONFIG).map(([k, cfg]) => (
          <div key={k} className={`${cfg.bg} rounded-2xl p-4 text-center`}>
            <p className="text-2xl font-bold text-gray-800">{counts[k] || 0}</p>
            <p className={`text-sm font-medium ${cfg.text}`}>{cfg.label}</p>
          </div>
        ))}
      </div>

      {/* Filter + Search */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input type="search" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Cari aspirasi..." className="input max-w-xs text-sm" />

        <select value={filterStat} onChange={e => setFilterStat(e.target.value)}
          className="input max-w-[160px] text-sm">
          <option value="Semua">Semua Status</option>
          <option value="received">Diterima</option>
          <option value="processing">Diproses</option>
          <option value="completed">Selesai</option>
        </select>

        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
          className="input max-w-[160px] text-sm">
          <option value="Semua">Semua Kategori</option>
          {['Akademik','Fasilitas','Organisasi','Lainnya'].map(c =>
            <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* ── LIST ASPIRASI ── */}
      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">🗣️</p>
          <p>Tidak ada aspirasi</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(asp => {
            const cfg     = STATUS_CONFIG[asp.status] || STATUS_CONFIG.received;
            const isReply = replyId === asp.id;

            return (
              <div key={asp.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

                {/* Header aspirasi */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`badge ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                      <span className="badge bg-gray-100 text-gray-500">{asp.category}</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        👍 {asp.upvotes || 0} dukungan
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-800">{asp.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {asp.submittedAt?.toDate
                        ? formatDate(asp.submittedAt)
                        : 'Baru saja'}
                    </p>
                  </div>

                  {/* Tombol hapus */}
                  <button onClick={() => handleDelete(asp.id)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors flex-shrink-0">
                    Hapus
                  </button>
                </div>

                {/* Isi aspirasi */}
                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-4 mb-4">
                  {asp.message}
                </p>

                {/* Tanggapan admin yang sudah ada */}
                {asp.adminNote && !isReply && (
                  <div className="bg-primary-50 border border-primary-100 rounded-xl px-4 py-3 mb-4">
                    <p className="text-xs font-semibold text-primary-600 mb-1">
                      💬 Tanggapan DEMA:
                    </p>
                    <p className="text-sm text-primary-800">{asp.adminNote}</p>
                  </div>
                )}

                {/* Form balas aspirasi */}
                {isReply ? (
                  <div className="space-y-3">
                    <textarea
                      rows={3}
                      value={replyNote}
                      onChange={e => setReplyNote(e.target.value)}
                      placeholder="Tulis tanggapan DEMA untuk aspirasi ini..."
                      className="input resize-none text-sm"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setReplyId(null); setReplyNote(''); }}
                        className="flex-1 btn-outline text-xs py-2">
                        Batal
                      </button>
                      <button
                        onClick={() => saveReply(asp.id)}
                        disabled={saving || !replyNote.trim()}
                        className="flex-1 btn-primary text-xs py-2 disabled:opacity-50">
                        {saving ? 'Menyimpan...' : 'Kirim Tanggapan'}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Kontrol status + tombol balas */
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Quick status change */}
                    <div className="flex gap-1.5 flex-wrap">
                      {Object.keys(STATUS_CONFIG).map(s => (
                        <button key={s}
                          onClick={() => changeStatus(asp.id, s)}
                          disabled={asp.status === s}
                          className={`text-[11px] px-3 py-1.5 rounded-lg font-medium transition-colors ${
                            asp.status === s
                              ? `${STATUS_CONFIG[s].bg} ${STATUS_CONFIG[s].text} cursor-default`
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}>
                          → {STATUS_CONFIG[s].label}
                        </button>
                      ))}
                    </div>

                    {/* Tombol balas */}
                    <button
                      onClick={() => {
                        setReplyId(asp.id);
                        setReplyNote(asp.adminNote || '');
                      }}
                      className="ml-auto text-xs px-4 py-1.5 rounded-xl bg-primary-500 text-white
                                 hover:bg-primary-600 transition-colors font-medium">
                      {asp.adminNote ? '✏️ Edit Tanggapan' : '💬 Beri Tanggapan'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
