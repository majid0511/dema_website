import { useState, useEffect } from 'react';
import { serverTimestamp } from 'firebase/firestore';
import { getAll, create, update, remove } from '../../services/firestoreService';
import { formatDate, createSlug } from '../../utils/formatters';
import { useNotify } from '../../utils/useNotify';
import { useConfirm } from '../../utils/useConfirm';
import ImageUpload from '../../components/ImageUpload';

const EMPTY = { title:'', slug:'', excerpt:'', content:'', category:'berita', author:'', thumbnailUrl:'', isPublished:false, tags:'' };

export default function AdminArticles() {
  const { notifySuccess, notifyError } = useNotify();
  const { confirm } = useConfirm();
  const [items,    setItems]   = useState([]);
  const [loading,  setLoading] = useState(true);
  const [form,     setForm]    = useState(EMPTY);
  const [editId,   setEditId]  = useState(null);
  const [showForm, setShowForm]= useState(false);
  const [saving,   setSaving]  = useState(false);

  const load = () => getAll('articles', []).then(d => { setItems(d); setLoading(false); });
  useEffect(() => { load(); }, []);

  function openNew()    { setForm(EMPTY); setEditId(null); setShowForm(true); }
  function openEdit(it) { setForm({ ...it, tags: (it.tags||[]).join(', ') }); setEditId(it.id); setShowForm(true); }
  function closeForm()  { setShowForm(false); setEditId(null); setForm(EMPTY); }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const data = {
      ...form,
      slug: form.slug || createSlug(form.title),
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      publishedAt: form.isPublished ? serverTimestamp() : null,
    };
    try {
      if (editId) {
        await update('articles', editId, data);
        setItems(prev => prev.map(it => it.id === editId ? { ...it, ...data } : it));
        notifySuccess('Artikel diperbarui', 'Berhasil');
      } else {
        const id = await create('articles', data);
        setItems(prev => [{ id, ...data }, ...prev]);
        notifySuccess('Artikel ditambahkan', 'Berhasil');
      }
      closeForm();
    } catch (err) { notifyError('Gagal menyimpan', err.message); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!(await confirm({ message: 'Hapus artikel ini?', danger: true }))) return;
    await remove('articles', id);
    setItems(prev => prev.filter(it => it.id !== id));
    notifySuccess('Artikel dihapus', 'Berhasil');
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">📰 Kelola Artikel</h1>
        <button onClick={openNew} className="btn-primary text-sm">+ Artikel Baru</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6 my-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-800">{editId ? 'Edit' : 'Tambah'} Artikel</h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul *</label>
                <input required value={form.title}
                  onChange={e => setForm({...form, title:e.target.value, slug: createSlug(e.target.value)})}
                  placeholder="Judul artikel" className="input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select value={form.category} onChange={e => setForm({...form, category:e.target.value})} className="input bg-white">
                    {['berita','opini','kegiatan','prestasi'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Penulis</label>
                  <input value={form.author} onChange={e => setForm({...form, author:e.target.value})}
                    placeholder="Nama penulis" className="input" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ringkasan</label>
                <textarea rows={2} value={form.excerpt} onChange={e => setForm({...form, excerpt:e.target.value})}
                  placeholder="Ringkasan singkat artikel..." className="input resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Konten Artikel *</label>
                <textarea required rows={7} value={form.content} onChange={e => setForm({...form, content:e.target.value})}
                  placeholder="Konten lengkap artikel. HTML diperbolehkan." className="input resize-none font-mono text-xs" />
                <p className="text-xs text-gray-400 mt-1">Tip: HTML dasar seperti &lt;p&gt;, &lt;b&gt;, &lt;h2&gt; bisa digunakan</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (pisahkan dengan koma)</label>
                <input value={form.tags} onChange={e => setForm({...form, tags:e.target.value})}
                  placeholder="pmii, akademik, seminar" className="input" />
              </div>
              <ImageUpload folder="articles" currentUrl={form.thumbnailUrl} label="Thumbnail"
                onUpload={url => setForm({...form, thumbnailUrl:url})} />
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isPublished} onChange={e => setForm({...form, isPublished:e.target.checked})}
                  className="w-4 h-4 accent-primary-500" />
                <span className="text-sm font-medium text-gray-700">Publikasikan sekarang</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeForm} className="flex-1 btn-outline text-sm">Batal</button>
                <button type="submit" disabled={saving} className="flex-1 btn-primary text-sm">
                  {saving ? 'Menyimpan...' : editId ? 'Simpan Perubahan' : 'Tambah Artikel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16"><div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400"><p className="text-5xl mb-4">📰</p><p>Belum ada artikel</p></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-50">
            {items.map(it => (
              <div key={it.id} className="px-5 py-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {it.thumbnailUrl && (
                    <img src={it.thumbnailUrl} alt="" className="w-14 h-14 object-cover rounded-xl flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="badge bg-primary-100 text-primary-700 text-[11px]">{it.category}</span>
                      <span className={`badge text-[11px] ${it.isPublished ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                        {it.isPublished ? 'Dipublikasi' : 'Draft'}
                      </span>
                    </div>
                    <p className="font-medium text-gray-800 text-sm truncate">{it.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {it.author || 'Tim DEMA'} · {formatDate(it.publishedAt || it.createdAt, 'd MMM yyyy')}
                    </p>
                  </div>
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
