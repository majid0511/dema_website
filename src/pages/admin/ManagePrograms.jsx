/**
 * Halaman admin: kelola program kerja DEMA per divisi.
 * Admin bisa mengubah status: planned → running → completed.
 */
import { useState, useEffect } from 'react';
import { serverTimestamp } from 'firebase/firestore';
import { getAll, create, update, remove } from '../../services/firestoreService';
import { DIVISIONS, PROGRAM_STATUS } from '../../firebase/collections';
import { formatDate } from '../../utils/formatters';
import { useNotify } from '../../utils/useNotify';
import { useConfirm } from '../../utils/useConfirm';

const EMPTY = {
  title: '', description: '', division: 'Umum / BPH',
  status: 'planned', targetDate: '', budget: '',
};

const STATUS_CONFIG = {
  planned:   { label: 'Direncanakan', bg: 'bg-blue-100',   text: 'text-blue-700' },
  running:   { label: 'Berjalan',     bg: 'bg-yellow-100', text: 'text-yellow-700' },
  completed: { label: 'Selesai',      bg: 'bg-green-100',  text: 'text-green-700' },
};

export default function AdminPrograms() {
  const { notifySuccess, notifyError } = useNotify();
  const { confirm } = useConfirm();
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [form,     setForm]     = useState(EMPTY);
  const [editId,   setEditId]   = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [filterDiv,setFilterDiv]= useState('Semua');

  const load = () => getAll('programs', []).then(d => { setItems(d); setLoading(false); });
  useEffect(() => { load(); }, []);

  function openNew()    { setForm(EMPTY); setEditId(null); setShowForm(true); }
  function openEdit(it) {
    setForm({
      ...it,
      targetDate: it.targetDate?.toDate?.()?.toISOString().slice(0,10) || '',
    });
    setEditId(it.id);
    setShowForm(true);
  }
  function closeForm()  { setShowForm(false); setEditId(null); setForm(EMPTY); }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...form,
        budget: form.budget ? Number(form.budget) : null,
        targetDate: form.targetDate ? new Date(form.targetDate) : serverTimestamp(),
        completedDate: form.status === 'completed' ? serverTimestamp() : null,
      };
      if (editId) {
        await update('programs', editId, data);
        setItems(prev => prev.map(it => it.id === editId ? { ...it, ...data } : it));
        notifySuccess('Program kerja diperbarui', 'Berhasil');
      } else {
        const id = await create('programs', data);
        setItems(prev => [{ id, ...data }, ...prev]);
        notifySuccess('Program kerja ditambahkan', 'Berhasil');
      }
      closeForm();
    } catch (err) {
      notifyError('Gagal menyimpan', err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!(await confirm({ message: 'Hapus program kerja ini?', danger: true }))) return;
    await remove('programs', id);
    setItems(prev => prev.filter(it => it.id !== id));
    notifySuccess('Program kerja dihapus', 'Berhasil');
  }

  /** Shortcut: ubah status langsung dari list tanpa buka form */
  async function quickStatus(id, newStatus) {
    await update('programs', id, {
      status: newStatus,
      completedDate: newStatus === 'completed' ? serverTimestamp() : null,
    });
    setItems(prev => prev.map(it =>
      it.id === id ? { ...it, status: newStatus } : it
    ));
  }

  const displayed = filterDiv === 'Semua'
    ? items
    : items.filter(it => it.division === filterDiv);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">📋 Kelola Program Kerja</h1>
        <button onClick={openNew} className="btn-primary text-sm">+ Program Baru</button>
      </div>

      {/* Statistik cepat */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <div key={key} className={`${cfg.bg} rounded-2xl p-4 text-center border border-white`}>
            <p className="text-2xl font-bold text-gray-800">
              {items.filter(it => it.status === key).length}
            </p>
            <p className={`text-sm font-medium ${cfg.text}`}>{cfg.label}</p>
          </div>
        ))}
      </div>

      {/* Filter divisi */}
      <div className="flex gap-2 flex-wrap mb-6">
        {['Semua', ...DIVISIONS].map(d => (
          <button key={d} onClick={() => setFilterDiv(d)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filterDiv === d
                ? 'bg-primary-500 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300'
            }`}>
            {d}
          </button>
        ))}
      </div>

      {/* ── MODAL FORM ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 my-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-800">
                {editId ? 'Edit' : 'Tambah'} Program Kerja
              </h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Program *
                </label>
                <input required value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Nama program kerja" className="input" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea rows={3} value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Deskripsi singkat program..." className="input resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Divisi</label>
                  <select value={form.division}
                    onChange={e => setForm({ ...form, division: e.target.value })}
                    className="input bg-white">
                    {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                    className="input bg-white">
                    <option value="planned">Direncanakan</option>
                    <option value="running">Berjalan</option>
                    <option value="completed">Selesai</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Selesai</label>
                  <input type="date" value={form.targetDate}
                    onChange={e => setForm({ ...form, targetDate: e.target.value })}
                    className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Anggaran (Rp)
                  </label>
                  <input type="number" value={form.budget}
                    onChange={e => setForm({ ...form, budget: e.target.value })}
                    placeholder="0" className="input" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeForm} className="flex-1 btn-outline text-sm">
                  Batal
                </button>
                <button type="submit" disabled={saving} className="flex-1 btn-primary text-sm">
                  {saving ? 'Menyimpan...' : editId ? 'Simpan' : 'Tambah Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── LIST PROGRAM ── */}
      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto" />
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">📋</p>
          <p>Belum ada program kerja</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map(prog => {
            const cfg = STATUS_CONFIG[prog.status] || STATUS_CONFIG.planned;
            return (
              <div key={prog.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    {/* Badge status + divisi */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`badge ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                      <span className="badge bg-gray-100 text-gray-500 text-[11px]">
                        {prog.division}
                      </span>
                      {prog.targetDate && (
                        <span className="text-xs text-gray-400">
                          Target: {formatDate(prog.targetDate, 'MMM yyyy')}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1">{prog.title}</h3>
                    {prog.description && (
                      <p className="text-sm text-gray-500">{prog.description}</p>
                    )}
                  </div>

                  {/* Aksi */}
                  <div className="flex flex-col gap-2 items-end flex-shrink-0">
                    {/* Quick status change */}
                    <div className="flex gap-1.5">
                      {Object.keys(STATUS_CONFIG).map(s => (
                        <button key={s}
                          onClick={() => quickStatus(prog.id, s)}
                          disabled={prog.status === s}
                          className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors ${
                            prog.status === s
                              ? `${STATUS_CONFIG[s].bg} ${STATUS_CONFIG[s].text} cursor-default`
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}>
                          {STATUS_CONFIG[s].label}
                        </button>
                      ))}
                    </div>
                    {/* Edit / Hapus */}
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(prog)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(prog.id)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors">
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
