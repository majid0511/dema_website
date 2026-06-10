/**
 * Halaman admin: kelola kalender kegiatan DEMA.
 */
import { useState, useEffect } from 'react';
import { getAll, create, update, remove } from '../../services/firestoreService';
import { formatDate } from '../../utils/formatters';
import { useNotify } from '../../utils/useNotify';
import { useConfirm } from '../../utils/useConfirm';

const EMPTY = {
  title: '', description: '', location: '',
  startDate: '', endDate: '', isAllDay: false,
  category: 'kegiatan', status: 'upcoming', imageUrl: '',
};

const STATUS_CONFIG = {
  upcoming:  { label: 'Akan Datang',      bg: 'bg-blue-100',  text: 'text-blue-700' },
  ongoing:   { label: 'Berlangsung',      bg: 'bg-yellow-100',text: 'text-yellow-700' },
  completed: { label: 'Selesai',          bg: 'bg-green-100', text: 'text-green-700' },
};

const CATEGORIES = ['kegiatan','akademik','keagamaan','sosial','olahraga','rapat'];

export default function AdminEvents() {
  const { notifySuccess, notifyError } = useNotify();
  const { confirm } = useConfirm();
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [form,     setForm]     = useState(EMPTY);
  const [editId,   setEditId]   = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving,   setSaving]   = useState(false);

  const load = () => getAll('events', []).then(d => { setItems(d); setLoading(false); });
  useEffect(() => { load(); }, []);

  function openNew()    { setForm(EMPTY); setEditId(null); setShowForm(true); }
  function openEdit(it) {
    setForm({
      ...it,
      startDate: it.startDate?.toDate?.()?.toISOString().slice(0,16) || '',
      endDate:   it.endDate?.toDate?.()?.toISOString().slice(0,16) || '',
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
        startDate: form.startDate ? new Date(form.startDate) : new Date(),
        endDate:   form.endDate   ? new Date(form.endDate)   : null,
      };
      if (editId) {
        await update('events', editId, data);
        setItems(prev => prev.map(it => it.id === editId ? { ...it, ...data } : it));
        notifySuccess('Kegiatan diperbarui', 'Berhasil');
      } else {
        const id = await create('events', data);
        setItems(prev => [{ id, ...data }, ...prev]);
        notifySuccess('Kegiatan ditambahkan', 'Berhasil');
      }
      closeForm();
    } catch (err) {
      notifyError('Gagal menyimpan', err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!(await confirm({ message: 'Hapus kegiatan ini?', danger: true }))) return;
    await remove('events', id);
    setItems(prev => prev.filter(it => it.id !== id));
    notifySuccess('Kegiatan dihapus', 'Berhasil');
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">📅 Kelola Kegiatan</h1>
        <button onClick={openNew} className="btn-primary text-sm">+ Kegiatan Baru</button>
      </div>

      {/* ── MODAL FORM ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 my-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-800">
                {editId ? 'Edit' : 'Tambah'} Kegiatan
              </h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kegiatan *</label>
                <input required value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Nama kegiatan" className="input" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea rows={3} value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Deskripsi kegiatan..." className="input resize-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                <input value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  placeholder="Gedung Aula / Online via Zoom" className="input" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mulai *</label>
                  <input required type="datetime-local" value={form.startDate}
                    onChange={e => setForm({ ...form, startDate: e.target.value })}
                    className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Selesai</label>
                  <input type="datetime-local" value={form.endDate}
                    onChange={e => setForm({ ...form, endDate: e.target.value })}
                    className="input" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="input bg-white">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                    className="input bg-white">
                    <option value="upcoming">Akan Datang</option>
                    <option value="ongoing">Berlangsung</option>
                    <option value="completed">Selesai</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeForm} className="flex-1 btn-outline text-sm">Batal</button>
                <button type="submit" disabled={saving} className="flex-1 btn-primary text-sm">
                  {saving ? 'Menyimpan...' : editId ? 'Simpan' : 'Tambah Kegiatan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── LIST KEGIATAN ── */}
      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">📅</p>
          <p>Belum ada kegiatan</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-50">
            {items.map(evt => {
              const cfg = STATUS_CONFIG[evt.status] || STATUS_CONFIG.upcoming;
              return (
                <div key={evt.id} className="px-5 py-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`badge ${cfg.bg} ${cfg.text} text-[11px]`}>{cfg.label}</span>
                      <span className="badge bg-gray-100 text-gray-500 text-[11px]">{evt.category}</span>
                    </div>
                    <p className="font-medium text-gray-800 text-sm">{evt.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      📅 {formatDate(evt.startDate, 'd MMM yyyy · HH:mm')}
                      {evt.location && ` · 📍 ${evt.location}`}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => openEdit(evt)}
                      className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(evt.id)}
                      className="text-sm px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors">
                      Hapus
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
