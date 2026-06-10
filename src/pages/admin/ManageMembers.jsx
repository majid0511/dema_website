/**
 * Halaman admin: kelola data pengurus/anggota DEMA.
 * CRUD lengkap dengan upload foto dan pengaturan urutan tampil.
 */
import { useState, useEffect } from 'react';
import { getAll, create, update, remove } from '../../services/firestoreService';
import { DIVISIONS } from '../../firebase/collections';
import { useNotify } from '../../utils/useNotify';
import { useConfirm } from '../../utils/useConfirm';
import ImageUpload from '../../components/ImageUpload';

const EMPTY = {
  name: '', position: '', division: 'Umum / BPH',
  order: 99, photoUrl: '', whatsapp: '', instagram: '',
  isExecutive: false,
};

export default function AdminMembers() {
  const { notifySuccess, notifyError } = useNotify();
  const { confirm } = useConfirm();
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [form,     setForm]     = useState(EMPTY);
  const [editId,   setEditId]   = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [filterDiv,setFilterDiv]= useState('Semua');

  const load = () =>
    getAll('members', []).then(d => {
      setItems(d.sort((a, b) => (a.order || 99) - (b.order || 99)));
      setLoading(false);
    });

  useEffect(() => { load(); }, []);

  function openNew()     { setForm(EMPTY); setEditId(null); setShowForm(true); }
  function openEdit(it)  { setForm(it);    setEditId(it.id); setShowForm(true); }
  function closeForm()   { setShowForm(false); setEditId(null); setForm(EMPTY); }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...form, order: Number(form.order) || 99 };
      if (editId) {
        await update('members', editId, data);
        setItems(prev => prev.map(it => it.id === editId ? { ...it, ...data } : it));
        notifySuccess('Anggota diperbarui', 'Berhasil');
      } else {
        const id = await create('members', data);
        setItems(prev => [...prev, { id, ...data }].sort((a, b) => a.order - b.order));
        notifySuccess('Anggota ditambahkan', 'Berhasil');
      }
      closeForm();
    } catch (err) {
      notifyError('Gagal menyimpan', err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!(await confirm({ message: 'Hapus anggota ini?', danger: true }))) return;
    await remove('members', id);
    setItems(prev => prev.filter(it => it.id !== id));
    notifySuccess('Anggota dihapus', 'Berhasil');
  }

  const displayed = filterDiv === 'Semua'
    ? items
    : items.filter(it => it.division === filterDiv);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">👥 Kelola Pengurus</h1>
        <button onClick={openNew} className="btn-primary text-sm">+ Tambah Anggota</button>
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
                {editId ? 'Edit' : 'Tambah'} Anggota
              </h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Foto */}
              <ImageUpload
                folder="members"
                currentUrl={form.photoUrl}
                label="Foto Profil"
                onUpload={url => setForm({ ...form, photoUrl: url })}
              />

              {/* Nama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
                <input required value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Nama lengkap" className="input" />
              </div>

              {/* Jabatan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan *</label>
                <input required value={form.position}
                  onChange={e => setForm({ ...form, position: e.target.value })}
                  placeholder="Cth: Ketua Umum / Ketua Divisi Akademik" className="input" />
              </div>

              {/* Divisi + Urutan */}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Urutan Tampil
                  </label>
                  <input type="number" min="1" value={form.order}
                    onChange={e => setForm({ ...form, order: e.target.value })}
                    className="input" placeholder="1" />
                </div>
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  No. WhatsApp
                </label>
                <input value={form.whatsapp}
                  onChange={e => setForm({ ...form, whatsapp: e.target.value })}
                  placeholder="628xxx format internasional" className="input" />
              </div>

              {/* Checkbox BPH */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isExecutive}
                  onChange={e => setForm({ ...form, isExecutive: e.target.checked })}
                  className="w-4 h-4 accent-primary-500" />
                <span className="text-sm font-medium text-gray-700">
                  Termasuk BPH (Badan Pengurus Harian)
                </span>
              </label>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeForm} className="flex-1 btn-outline text-sm">
                  Batal
                </button>
                <button type="submit" disabled={saving} className="flex-1 btn-primary text-sm">
                  {saving ? 'Menyimpan...' : editId ? 'Simpan Perubahan' : 'Tambah Anggota'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── TABEL DATA ── */}
      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto" />
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">👥</p>
          <p>Belum ada anggota</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Header tabel */}
          <div className="grid grid-cols-12 px-5 py-3 bg-gray-50 border-b border-gray-100
                          text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <span className="col-span-1">#</span>
            <span className="col-span-5">Nama</span>
            <span className="col-span-3 hidden sm:block">Divisi</span>
            <span className="col-span-3 sm:col-span-3">Aksi</span>
          </div>

          <div className="divide-y divide-gray-50">
            {displayed.map((it, i) => (
              <div key={it.id}
                className="grid grid-cols-12 px-5 py-3.5 items-center hover:bg-gray-50 transition-colors">
                <span className="col-span-1 text-sm text-gray-400">{i + 1}</span>

                {/* Foto + nama */}
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-primary-100 flex-shrink-0">
                    {it.photoUrl
                      ? <img src={it.photoUrl} alt={it.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-sm font-bold text-primary-400">
                          {it.name?.[0]?.toUpperCase()}
                        </div>
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{it.name}</p>
                    <p className="text-xs text-gray-400 truncate">{it.position}</p>
                  </div>
                </div>

                {/* Divisi */}
                <div className="col-span-3 hidden sm:block">
                  <span className="badge bg-primary-50 text-primary-600 text-[11px]">
                    {it.isExecutive ? '⭐ BPH' : it.division}
                  </span>
                </div>

                {/* Aksi */}
                <div className="col-span-6 sm:col-span-3 flex gap-2 justify-end sm:justify-start">
                  <button onClick={() => openEdit(it)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(it.id)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors">
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
            Total: {displayed.length} anggota
          </div>
        </div>
      )}
    </div>
  );
}
