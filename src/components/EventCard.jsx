/**
 * Kartu kegiatan/event dengan tanggal, lokasi, dan status.
 */
import { formatDate } from '../utils/formatters';

const STATUS_STYLE = {
  upcoming:  { bg: 'bg-blue-100',   text: 'text-blue-700',  label: 'Akan Datang' },
  ongoing:   { bg: 'bg-green-100',  text: 'text-green-700', label: 'Sedang Berlangsung' },
  completed: { bg: 'bg-gray-100',   text: 'text-gray-500',  label: 'Selesai' },
};

const CATEGORY_ICON = {
  akademik:   '🎓',
  sosial:     '🤝',
  keagamaan:  '🕌',
  olahraga:   '⚽',
  default:    '📅',
};

export default function EventCard({ event }) {
  const { title, description, location, startDate, category, status } = event;
  const st   = STATUS_STYLE[status] || STATUS_STYLE.upcoming;
  const icon = CATEGORY_ICON[category] || CATEGORY_ICON.default;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      {/* Header: icon + status */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-3xl">{icon}</span>
        <span className={`badge ${st.bg} ${st.text}`}>{st.label}</span>
      </div>

      {/* Judul */}
      <h3 className="font-semibold text-gray-800 mb-1 leading-snug line-clamp-2">{title}</h3>

      {/* Deskripsi singkat */}
      {description && (
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{description}</p>
      )}

      {/* Info tanggal & lokasi */}
      <div className="space-y-1 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <span>📅</span>
          <span>{formatDate(startDate, 'd MMMM yyyy')}</span>
        </div>
        {location && (
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span>{location}</span>
          </div>
        )}
      </div>
    </div>
  );
}
