/**
 * Kartu pengumuman untuk ditampilkan di grid.
 * Menampilkan judul, kategori, tanggal, dan badge urgent.
 */
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/formatters';

const CATEGORY_COLORS = {
  Akademik:  'bg-blue-100 text-blue-700',
  Kegiatan:  'bg-green-100 text-green-700',
  Umum:      'bg-gray-100 text-gray-600',
  Penting:   'bg-red-100 text-red-700',
};

export default function AnnouncementCard({ announcement }) {
  const { id, title, category, publishedAt, isUrgent, content } = announcement;
  const colorClass = CATEGORY_COLORS[category] || CATEGORY_COLORS.Umum;

  return (
    <Link
      to={`/pengumuman/${id}`}
      className="block bg-white rounded-2xl border border-gray-100 shadow-sm
                 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5 group"
    >
      {/* Badge kategori + urgent */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`badge ${colorClass}`}>{category || 'Umum'}</span>
        {isUrgent && (
          <span className="badge bg-red-500 text-white flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-white rounded-full pulse-green" />
            Penting
          </span>
        )}
      </div>

      {/* Judul */}
      <h3 className="font-semibold text-gray-800 mb-2 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
        {title}
      </h3>

      {/* Preview konten */}
      {content && (
        <p className="text-sm text-gray-500 line-clamp-2 mb-3 leading-relaxed">
          {content.replace(/<[^>]*>/g, '')}
        </p>
      )}

      {/* Tanggal */}
      <p className="text-xs text-gray-400">{formatDate(publishedAt)}</p>
    </Link>
  );
}
