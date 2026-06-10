import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOne } from '../services/firestoreService';
import { formatDate } from '../utils/formatters';
import PageTransition from '../components/PageTransition';

export default function AnnouncementDetailPage() {
  const { id }          = useParams();
  const [ann, setAnn]   = useState(null);
  const [loading, setL] = useState(true);

  useEffect(() => {
    getOne('announcements', id).then(data => { setAnn(data); setL(false); });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full" />
    </div>
  );

  if (!ann) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-400">
      <p className="text-5xl">😔</p>
      <p>Pengumuman tidak ditemukan</p>
      <Link to="/pengumuman" className="btn-primary text-sm">← Kembali</Link>
    </div>
  );

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link to="/" className="hover:text-primary-500">Beranda</Link>
          <span>/</span>
          <Link to="/pengumuman" className="hover:text-primary-500">Pengumuman</Link>
          <span>/</span>
          <span className="text-gray-600 truncate max-w-[200px]">{ann.title}</span>
        </div>

        {/* Konten utama */}
        <article className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Gambar header (jika ada) */}
          {ann.imageUrl && (
            <img src={ann.imageUrl} alt={ann.title}
              className="w-full h-64 object-cover" />
          )}

          <div className="p-8">
            {/* Badge */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="badge bg-primary-100 text-primary-700">{ann.category || 'Umum'}</span>
              {ann.isUrgent && <span className="badge bg-red-500 text-white">🔴 Penting</span>}
            </div>

            {/* Judul */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-3 leading-tight">
              {ann.title}
            </h1>

            {/* Tanggal */}
            <p className="text-sm text-gray-400 mb-8 flex items-center gap-2">
              <span>📅</span>
              {formatDate(ann.publishedAt)}
            </p>

            {/* Isi konten */}
            <div
              className="prose-content text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: ann.content || '' }}
            />
          </div>
        </article>

        {/* Tombol kembali */}
        <div className="mt-8">
          <Link to="/pengumuman"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium">
            ← Kembali ke Pengumuman
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
