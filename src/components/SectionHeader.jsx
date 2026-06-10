/**
 * Header section reusable: judul + subtitle + link opsional.
 * Digunakan di homepage dan halaman-halaman lain untuk konsistensi.
 */
import { Link } from 'react-router-dom';

export default function SectionHeader({ title, subtitle, linkTo, linkLabel }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        {/* Garis aksen hijau di atas judul */}
        <div className="w-10 h-1 bg-primary-400 rounded-full mb-3" />
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{title}</h2>
        {subtitle && <p className="text-gray-500 mt-1 text-sm sm:text-base">{subtitle}</p>}
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="shrink-0 text-sm font-medium text-primary-500 hover:text-primary-700
                     flex items-center gap-1 transition-colors"
        >
          {linkLabel || 'Lihat semua'} →
        </Link>
      )}
    </div>
  );
}
