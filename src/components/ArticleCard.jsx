/**
 * Kartu artikel dengan thumbnail, judul, kategori, dan penulis.
 */
import { Link } from 'react-router-dom';
import { formatDate, truncate } from '../utils/formatters';

export default function ArticleCard({ article }) {
  const { id, slug, title, excerpt, thumbnailUrl, category, author, publishedAt } = article;

  return (
    <Link
      to={`/artikel/${slug || id}`}
      className="block bg-white rounded-2xl border border-gray-100 shadow-sm
                 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group"
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-primary-50 overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">📰</div>
        )}
      </div>

      <div className="p-5">
        {/* Kategori */}
        <span className="badge bg-primary-50 text-primary-600 mb-2 inline-block">{category || 'Artikel'}</span>

        {/* Judul */}
        <h3 className="font-semibold text-gray-800 mb-2 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Excerpt */}
        {excerpt && <p className="text-sm text-gray-500 line-clamp-2 mb-3">{excerpt}</p>}

        {/* Meta: penulis + tanggal */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>✍️ {author || 'Tim DEMA'}</span>
          <span>{formatDate(publishedAt, 'd MMM yyyy')}</span>
        </div>
      </div>
    </Link>
  );
}
