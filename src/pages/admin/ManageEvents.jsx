/**
 * Halaman admin: kelola kalender kegiatan DEMA.
 */
import { useState, useEffect } from 'react';
import { getAll, create, update, remove, getEventAttendees } from '../../services/firestoreService';
import { formatDate } from '../../utils/formatters';
import { useNotify } from '../../utils/useNotify';
import { useConfirm } from '../../utils/useConfirm';
import { QRCodeSVG } from 'qrcode.react';

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
  const [qrEvent,  setQrEvent]  = useState(null);
  const [attendeesEvent, setAttendeesEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);

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

  async function openAttendees(evt) {
    setAttendeesEvent(evt);
    setLoadingAttendees(true);
    try {
      const data = await getEventAttendees(evt.id);
      setAttendees(data);
    } catch (err) {
      notifyError('Gagal mengambil data peserta', err.message);
    } finally {
      setLoadingAttendees(false);
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">📅 Kelola Kegiatan</h1>
        <button onClick={openNew} className="btn-primary text-sm">+ Kegiatan Baru</button>
      </div>

      {/* ── MODAL QR CODE ── */}
      {qrEvent && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center relative">
            <button onClick={() => setQrEvent(null)} className="absolute top-4 right-5 text-gray-400 hover:text-gray-600 text-2xl">✕</button>
            <h2 className="text-xl font-bold text-gray-800 mb-2">QR Code Presensi</h2>
            <p className="text-sm text-gray-500 mb-6 truncate">{qrEvent.title}</p>
            
            <div className="bg-white p-4 rounded-xl border border-gray-100 inline-block shadow-sm">
              <QRCodeSVG 
                value={`${window.location.origin}/checkin/${qrEvent.id}`}
                size={200}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"M"}
                includeMargin={false}
              />
            </div>
            
            <p className="text-xs text-gray-400 mt-6">
              Peserta dapat memindai QR code ini untuk melakukan absensi kehadiran.
            </p>
            <a 
              href={`/checkin/${qrEvent.id}`} 
              target="_blank" 
              rel="noreferrer"
              className="mt-4 inline-block text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Buka Halaman Check-in ↗
            </a>
          </div>
        </div>
      )}

      {/* ── MODAL PESERTA (ATTENDEES) ── */}
      {attendeesEvent && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col relative">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Daftar Hadir</h2>
                <p className="text-sm text-gray-500">{attendeesEvent.title}</p>
              </div>
              <button onClick={() => setAttendeesEvent(null)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {loadingAttendees ? (
                <div className="text-center py-10">
                  <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto" />
                  <p className="text-sm text-gray-500 mt-4">Memuat data peserta...</p>
                </div>
              ) : attendees.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <p className="text-5xl mb-4">📭</p>
                  <p>Belum ada peserta yang check-in.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                        <th className="py-3 px-4 font-semibold">Nama</th>
                        <th className="py-3 px-4 font-semibold">NIM/NIK</th>
                        <th className="py-3 px-4 font-semibold">Instansi</th>
                        <th className="py-3 px-4 font-semibold">Waktu Check-in</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {attendees.map(a => (
                        <tr key={a.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-800">{a.name}</td>
                          <td className="py-3 px-4 text-gray-600">{a.nim}</td>
                          <td className="py-3 px-4 text-gray-600">{a.instansi}</td>
                          <td className="py-3 px-4 text-gray-500">
                            {a.checkinTime ? formatDate(a.checkinTime, 'd MMM yyyy HH:mm') : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 flex-shrink-0 bg-gray-50 rounded-b-3xl">
              <p className="text-xs text-gray-500 text-center">Total {attendees.length} peserta hadir.</p>
            </div>
          </div>
        </div>
      )}

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
                    <button onClick={() => openAttendees(evt)}
                      className="text-sm px-3 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 transition-colors">
                      Peserta
                    </button>
                    <button onClick={() => setQrEvent(evt)}
                      className="text-sm px-3 py-1.5 rounded-lg bg-primary-50 hover:bg-primary-100 text-primary-600 transition-colors">
                      QR Code
                    </button>
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
