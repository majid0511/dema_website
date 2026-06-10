/**
 * Halaman admin: kelola pengumuman.
 * CRUD: create, read, update, delete.
 */
import { useState, useEffect } from 'react';
import { serverTimestamp } from 'firebase/firestore';
import { getAll, create, update, remove } from '../../services/firestoreService';
import { formatDate } from '../../utils/formatters';
import { useNotify } from '../../utils/useNotify';
import { useConfirm } from '../../utils/useConfirm';
import ImageUpload from '../../components/ImageUpload';
import RichTextEditor from '../../components/RichTextEditor';
import sendPushNotification from '../../services/sendNotification';

const EMPTY = { title:'', content:'', category:'umum', isUrgent:false, imageUrl:'', publishedAt:'' };

export default function AdminAnnouncements() {
  const { notifySuccess, notifyError } = useNotify();
  const { confirm } = useConfirm();
  const [items,    setItems]   = useState([]);
  const [loading,  setLoading] = useState(true);
  const [form,     setForm]    = useState(EMPTY);
  const [editId,   setEditId]  = useState(null);
  const [showForm, setShowForm]= useState(false);
  const [saving,   setSaving]  = useState(false);

  const load = () => getAll('announcements', []).then(d => { setItems(d); setLoading(false); });
  useEffect(() => { load(); }, []);

  function openNew()    { setForm(EMPTY); setEditId(null); setShowForm(true); }
  function openEdit(it) { setForm({ ...it, publishedAt: it.publishedAt?.toDate?.()?.toISOString().slice(0,10) || '' }); setEditId(it.id); setShowForm(true); }
  function closeForm()  { setShowForm(false); setEditId(null); setForm(EMPTY); }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const data = {
      ...form,
      publishedAt: form.publishedAt ? serverTimestamp() : serverTimestamp(),
    };
    try {
      if (editId) {
        await update('announcements', editId, data);
        setItems(prev => prev.map(it => it.id === editId ? { ...it, ...data } : it));
        notifySuccess('Pengumuman diperbarui', 'Berhasil');
      } else {
        const id = await create('announcements', data);
        setItems(prev => [{ id, ...data }, ...prev]);
        notifySuccess('Pengumuman ditambahkan', 'Berhasil');
        sendPushNotification({
          title: '📢 Pengumuman Baru',
          body: data.title,
          url: `/pengumuman/${id}`,
        });
      }
      closeForm();
    } catch (err) { notifyError('Gagal menyimpan', err.message); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!(await confirm({ message: 'Hapus pengumuman ini?', danger: true }))) return;
    await remove('announcements', id);
    setItems(prev => prev.filter(it => it.id !== id));
    notifySuccess('Pengumuman dihapus', 'Berhasil');
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">📢 Kelola Pengumuman</h1>
        <button onClick={openNew} className="btn-primary text-sm">+ Pengumuman Baru</button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6 my-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-800">{editId ? 'Edit' : 'Tambah'} Pengumuman</h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul *</label>
                <input required value={form.title} onChange={e => setForm({...form, title:e.target.value})}
                  placeholder="Judul pengumuman" className="input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select value={form.category} onChange={e => setForm({...form, category:e.target.value})} className="input bg-white">
                    {['umum','akademik','kegiatan','penting'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isUrgent} onChange={e => setForm({...form, isUrgent:e.target.checked})}
                      className="w-4 h-4 accent-primary-500" />
                    <span className="text-sm font-medium text-gray-700">Tandai Penting</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Isi Pengumuman *</label>
                <RichTextEditor
                  value={form.content}
                  onChange={html => setForm({...form, content: html})}
                  placeholder="Tulis isi pengumuman di sini..."
                />
              </div>
              <ImageUpload folder="announcements" currentUrl={form.imageUrl} label="Gambar (opsional)"
                onUpload={url => setForm({...form, imageUrl:url})} />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeForm} className="flex-1 btn-outline text-sm">Batal</button>
                <button type="submit" disabled={saving} className="flex-1 btn-primary text-sm">
                  {saving ? 'Menyimpan...' : editId ? 'Simpan Perubahan' : 'Tambah Pengumuman'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabel data */}
      {loading ? (
        <div className="text-center py-16"><div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400"><p className="text-5xl mb-4">📢</p><p>Belum ada pengumuman</p></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-50">
            {items.map(it => (
              <div key={it.id} className="px-5 py-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge bg-primary-100 text-primary-700 text-[11px]">{it.category}</span>
                    {it.isUrgent && <span className="badge bg-red-100 text-red-600 text-[11px]">Penting</span>}
                  </div>
                  <p className="font-medium text-gray-800 text-sm truncate">{it.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(it.publishedAt || it.createdAt)}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(it)} className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">Edit</button>
                  <button onClick={() => handleDelete(it.id)} className="text-sm px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors">Hapus</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
