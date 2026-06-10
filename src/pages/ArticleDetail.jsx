import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { formatDate } from '../utils/formatters';
import PageTransition from '../components/PageTransition';
import ArticleCard    from '../components/ArticleCard';

export default function ArticleDetailPage() {
  const { slug }           = useParams();
  const [article, setA]    = useState(null);
  const [related, setR]    = useState([]);
  const [loading, setLoad] = useState(true);

  useEffect(() => {
    async function fetch() {
      // Cari berdasarkan slug dulu, fallback ke ID
      let snap = await getDocs(query(collection(db, 'articles'), where('slug', '==', slug), limit(1)));
      if (snap.empty) snap = await getDocs(query(collection(db, 'articles'), where('__name__', '==', slug), limit(1)));
      if (!snap.empty) {
        const art = { id: snap.docs[0].id, ...snap.docs[0].data() };
        setA(art);
        // Ambil artikel terkait (same category)
        const relSnap = await getDocs(query(collection(db, 'articles'),
          where('category', '==', art.category || ''),
          where('isPublished', '==', true),
          limit(4)));
        setR(relSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter(a => a.id !== art.id).slice(0, 3));
      }
      setLoad(false);
    }
    fetch();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full" />
    </div>
  );

  if (!article) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-400">
      <p className="text-5xl">😔</p>
      <p>Artikel tidak ditemukan</p>
      <Link to="/artikel" className="btn-primary text-sm">← Kembali</Link>
    </div>
  );

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link to="/" className="hover:text-primary-500">Beranda</Link>
          <span>/</span>
          <Link to="/artikel" className="hover:text-primary-500">Artikel</Link>
          <span>/</span>
          <span className="text-gray-600 truncate max-w-[200px]">{article.title}</span>
        </div>

        <article>
          {/* Header artikel */}
          <div className="mb-8">
            <span className="badge bg-primary-100 text-primary-700 mb-3 inline-block">
              {article.category || 'Artikel'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 leading-tight mb-4">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>✍️ {article.author || 'Tim DEMA'}</span>
              <span>📅 {formatDate(article.publishedAt)}</span>
            </div>
          </div>

          {/* Thumbnail */}
          {article.thumbnailUrl && (
            <img src={article.thumbnailUrl} alt={article.title}
              className="w-full h-64 sm:h-96 object-cover rounded-3xl mb-8" />
          )}

          {/* Konten */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
            {article.excerpt && (
              <p className="text-lg text-gray-600 italic border-l-4 border-primary-400 pl-5 mb-8 leading-relaxed">
                {article.excerpt}
              </p>
            )}
            <div
              className="prose-content text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content || '' }}
            />
          </div>

          {/* Tags */}
          {article.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {article.tags.map(t => (
                <span key={t} className="badge bg-gray-100 text-gray-500">#{t}</span>
              ))}
            </div>
          )}
        </article>

        {/* Artikel terkait */}
        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Artikel Terkait</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map(a => <ArticleCard key={a.id} article={a} />)}
            </div>
          </div>
        )}

        <div className="mt-10">
          <Link to="/artikel" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium">
            ← Kembali ke Artikel
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
