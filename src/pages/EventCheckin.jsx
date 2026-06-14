import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOne } from '../services/firestoreService';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import PageTransition from '../components/PageTransition';
import { formatDate } from '../utils/formatters';

export default function EventCheckinPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', nim: '', instansi: '' });
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error

  useEffect(() => {
    getOne('events', id).then(data => {
      setEvent(data);
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.nim) return;

    setStatus('submitting');
    try {
      await addDoc(collection(db, `events/${id}/attendees`), {
        ...formData,
        checkinTime: serverTimestamp()
      });
      setStatus('success');
    } catch (error) {
      console.error("Error during checkin:", error);
      setStatus('error');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full" />
    </div>
  );

  if (!event) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-400 bg-gray-50">
      <p className="text-5xl">😔</p>
      <p>Kegiatan tidak ditemukan</p>
      <Link to="/" className="btn-primary text-sm">Kembali ke Beranda</Link>
    </div>
  );

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 flex flex-col justify-center items-center">
        
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* Header */}
          <div className="bg-primary-600 text-white p-6 text-center">
            <h1 className="text-2xl font-bold mb-2">Check-in Kegiatan</h1>
            <p className="text-primary-100 text-sm">Silakan isi data diri Anda untuk presensi kehadiran.</p>
          </div>

          <div className="p-8">
            {/* Event Info */}
            <div className="mb-8 p-4 bg-primary-50 rounded-2xl border border-primary-100">
              <h2 className="font-bold text-gray-800 mb-1">{event.title}</h2>
              <p className="text-xs text-gray-500">📅 {formatDate(event.startDate, 'd MMM yyyy · HH:mm')}</p>
              {event.location && <p className="text-xs text-gray-500 mt-1">📍 {event.location}</p>}
            </div>

            {status === 'success' ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Check-in Berhasil!</h3>
                <p className="text-gray-500 mb-6">Terima kasih telah hadir di kegiatan ini.</p>
                <button onClick={() => setFormData({ name: '', nim: '', instansi: '' }) || setStatus('idle')} className="btn-outline text-sm w-full">
                  Check-in Peserta Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="input bg-white"
                    placeholder="Masukkan nama Anda"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NIM / NIK *</label>
                  <input
                    type="text"
                    required
                    value={formData.nim}
                    onChange={e => setFormData({ ...formData, nim: e.target.value })}
                    className="input bg-white"
                    placeholder="Masukkan NIM Anda"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instansi / Fakultas</label>
                  <input
                    type="text"
                    value={formData.instansi}
                    onChange={e => setFormData({ ...formData, instansi: e.target.value })}
                    className="input bg-white"
                    placeholder="Contoh: Fakultas Tarbiyah"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-red-500 text-sm mt-2 text-center">Gagal melakukan check-in. Silakan coba lagi.</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="btn-primary w-full mt-4"
                >
                  {status === 'submitting' ? 'Memproses...' : 'Kirim Kehadiran'}
                </button>
              </form>
            )}
          </div>
        </div>
        
        <p className="mt-8 text-xs text-gray-400">© {new Date().getFullYear()} DEMA Website - Sistem Presensi</p>
      </div>
    </PageTransition>
  );
}
