/**
 * Halaman admin: kelola album galeri foto.
 * Fitur: buat album, upload banyak foto sekaligus, hapus foto individual.
 */
import { useState, useEffect, useRef } from 'react';
import { serverTimestamp } from 'firebase/firestore';
import { getAll, create, update, remove, uploadImage } from '../../services/firestoreService';
import { formatDate } from '../../utils/formatters';
import { useNotify } from '../../utils/useNotify';
import { useConfirm } from '../../utils/useConfirm';
import ImageUpload from '../../components/ImageUpload';

const EMPTY_ALBUM = {
  title: '', description: '', coverUrl: '', category: 'kegiatan',
  eventDate: '', photos: [],
};

export default function AdminGallery() {
  const { notifySuccess, notifyError } = useNotify();
  const { confirm } = useConfirm();
  const [albums,      setAlbums]     = useState([]);
  const [loading,     setLoading]    = useState(true);
  const [form,        setForm]       = useState(EMPTY_ALBUM);
  const [editId,      setEditId]     = useState(null);
  const [showForm,    setShowForm]   = useState(false);
  const [saving,      setSaving]     = useState(false);
  const [uploading,   setUploading]  = useState(false);
  const [uploadProg,  setUploadProg] = useState(0);
  const photoInputRef                = useRef();

  const load = () =>
    getAll('gallery', []).then(d => { setAlbums(d); setLoading(false); });

  useEffect(() => { load(); }, []);

  function openNew()    { setForm(EMPTY_ALBUM); setEditId(null); setShowForm(true); }
  function openEdit(it) { setForm({ ...it, eventDate: it.eventDate?.toDate?.()?.toISOString().slice(0,10) || '' }); setEditId(it.id); setShowForm(true); }
  function closeForm()  { setShowForm(false); setEditId(null); setForm(EMPTY_ALBUM); }

  /** Upload banyak foto sekaligus ke album */
  async function handlePhotosUpload(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    const uploaded = [];
    for (let i = 0; i < files.length; i++) {
      setUploadProg(Math.round((i / files.length) * 100));
      const url = await uploadImage(files[i], 'gallery', () => {});
      uploaded.push({ url, caption: '', uploadedAt: new Date().toISOString() });
    }
    setForm(prev => ({ ...prev, photos: [...(prev.photos || []), ...uploaded] }));
    setUploading(false);
    setUploadProg(0);
    e.target.value = '';
  }

  /** Hapus satu foto dari daftar (belum hapus dari Storage) */
  function removePhoto(index) {
    setForm(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  }

  /** Update caption foto */
  function updateCaption(index, caption) {
    setForm(prev => ({
      ...prev,
      photos: prev.photos.map((p, i) => i === index ? { ...p, caption } : p),
    }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...form,
        eventDate: form.eventDate ? new Date(form.eventDate) : serverTimestamp(),
      };
      if (editId) {
        await update('gallery', editId, data);
        setAlbums(prev => prev.map(it => it.id === editId ? { ...it, ...data } : it));
        notifySuccess('Album diperbarui', 'Berhasil');
      } else {
        const id = await create('gallery', data);
        setAlbums(prev => [{ id, ...data }, ...prev]);
        notifySuccess('Album ditambahkan', 'Berhasil');
      }
      closeForm();
    } catch (err) {
      notifyError('Gagal menyimpan', err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!(await confirm({ message: 'Hapus album ini beserta semua fotonya?', danger: true }))) return;
    await remove('gallery', id);
    setAlbums(prev => prev.filter(it => it.id !== id));
    notifySuccess('Album dihapus', 'Berhasil');
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">📸 Kelola Galeri</h1>
        <button onClick={openNew} className="btn-primary text-sm">+ Album Baru</button>
      </div>

      {/* ── MODAL FORM ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6 my-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-800">{editId ? 'Edit' : 'Buat'} Album</h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Album *</label>
                <input required value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Cth: Seminar Nasional 2025" className="input" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="input bg-white">
                    {['kegiatan','seminar','wisuda','rapat','lainnya'].map(c =>
                      <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Kegiatan</label>
                  <input type="date" value={form.eventDate}
                    onChange={e => setForm({ ...form, eventDate: e.target.value })}
                    className="input" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea rows={2} value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Deskripsi singkat kegiatan..." className="input resize-none" />
              </div>

              {/* Cover album */}
              <ImageUpload
                folder="gallery"
                currentUrl={form.coverUrl}
                label="Foto Sampul Album"
                onUpload={url => setForm({ ...form, coverUrl: url })}
              />

              {/* Upload banyak foto */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Foto ({form.photos?.length || 0} foto)
                  </label>
                  <button type="button" onClick={() => photoInputRef.current?.click()}
                    disabled={uploading}
                    className="text-sm px-4 py-1.5 rounded-xl bg-primary-50 text-primary-600
                               hover:bg-primary-100 transition-colors font-medium disabled:opacity-50">
                    {uploading ? `Mengupload... ${uploadProg}%` : '+ Tambah Foto'}
                  </button>
                </div>
                <input ref={photoInputRef} type="file" multiple accept="image/*"
                  className="hidden" onChange={handlePhotosUpload} />

                {/* Progress bar */}
                {uploading && (
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                    <div className="bg-primary-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${uploadProg}%` }} />
                  </div>
                )}

                {/* Grid preview foto */}
                {form.photos?.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                    {form.photos.map((photo, i) => (
                      <div key={i} className="relative group">
                        <img src={photo.url} alt=""
                          className="w-full aspect-square object-cover rounded-xl" />
                        {/* Tombol hapus foto */}
                        <button type="button" onClick={() => removePhoto(i)}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white
                                     rounded-full text-xs flex items-center justify-center
                                     opacity-0 group-hover:opacity-100 transition-opacity">
                          ✕
                        </button>
                        {/* Input caption */}
                        <input
                          value={photo.caption || ''}
                          onChange={e => updateCaption(i, e.target.value)}
                          placeholder="Caption..."
                          className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1 mt-1
                                     focus:outline-none focus:ring-1 focus:ring-primary-300"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeForm} className="flex-1 btn-outline text-sm">Batal</button>
                <button type="submit" disabled={saving || uploading} className="flex-1 btn-primary text-sm">
                  {saving ? 'Menyimpan...' : editId ? 'Simpan Perubahan' : 'Buat Album'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── GRID ALBUM ── */}
      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto" />
        </div>
      ) : albums.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">📸</p>
          <p>Belum ada album galeri</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {albums.map(album => (
            <div key={album.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Cover */}
              <div className="aspect-video bg-gray-100 overflow-hidden">
                {album.coverUrl
                  ? <img src={album.coverUrl} alt={album.title}
                      className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-4xl">📸</div>
                }
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-sm mb-1 truncate">{album.title}</h3>
                <p className="text-xs text-gray-400 mb-3">
                  {album.photos?.length || 0} foto · {formatDate(album.eventDate, 'd MMM yyyy')}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(album)}
                    className="flex-1 text-xs py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors font-medium">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(album.id)}
                    className="flex-1 text-xs py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors font-medium">
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
