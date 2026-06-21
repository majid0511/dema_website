import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, addDoc, doc, getDoc, setDoc, updateDoc, increment, serverTimestamp, limit, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { formatDate } from '../utils/formatters';

const REACTIONS = [
  { id: 'like', emoji: '👍', label: 'Suka' },
  { id: 'love', emoji: '❤️', label: 'Cinta' },
  { id: 'wow', emoji: '😮', label: 'Wow' },
  { id: 'haha', emoji: '😂', label: 'Haha' },
  { id: 'sad', emoji: '😢', label: 'Sedih' },
];

export default function ReactionBox({ targetId, targetType }) {
  const [reactions, setReactions] = useState({});
  const [userReaction, setUserReaction] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentError, setCommentError] = useState('');

  useEffect(() => {
    // Load existing reaction from localStorage
    const saved = localStorage.getItem(`reaction_${targetType}_${targetId}`);
    if (saved) setUserReaction(saved);

    fetchReactions();
    fetchComments();
  }, [targetId, targetType]);

  const fetchReactions = async () => {
    try {
      const docRef = doc(db, 'reactions', `${targetType}_${targetId}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setReactions(docSnap.data().counts || {});
      }
    } catch (error) {
      console.error("Error fetching reactions:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const q = query(
        collection(db, 'comments'),
        where('targetId', '==', targetId),
        where('targetType', '==', targetType),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      setComments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleReaction = async (reactionId) => {
    if (userReaction) return; // Already reacted

    setUserReaction(reactionId);
    localStorage.setItem(`reaction_${targetType}_${targetId}`, reactionId);

    // Optimistic update
    setReactions(prev => ({
      ...prev,
      [reactionId]: (prev[reactionId] || 0) + 1
    }));

    try {
      const docRef = doc(db, 'reactions', `${targetType}_${targetId}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await updateDoc(docRef, {
          [`counts.${reactionId}`]: increment(1)
        });
      } else {
        await setDoc(docRef, {
          targetId,
          targetType,
          counts: { [reactionId]: 1 }
        });
      }
    } catch (error) {
      console.error("Error updating reaction:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !commentText.trim()) return;

    setCommentError('');
    setIsSubmitting(true);
    try {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      const recentQuery = query(
        collection(db, 'comments'),
        where('targetId', '==', targetId),
        where('targetType', '==', targetType),
        where('name', '==', name.trim()),
        where('createdAt', '>=', Timestamp.fromDate(tenMinutesAgo)),
        limit(1)
      );
      const recentSnap = await getDocs(recentQuery);
      if (!recentSnap.empty) {
        setCommentError('Anda sudah mengirim komentar baru-baru ini. Coba lagi dalam beberapa menit.');
        setIsSubmitting(false);
        return;
      }

      const newComment = {
        targetId,
        targetType,
        name: name.trim(),
        text: commentText.trim(),
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'comments'), newComment);
      
      // Update local state for immediate feedback
      setComments([{ id: docRef.id, ...newComment, createdAt: { toDate: () => new Date() } }, ...comments]);
      setCommentText('');
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Reaksi & Komentar</h3>
      
      {/* Reactions */}
      <div className="flex flex-wrap gap-3 mb-8 pb-8 border-b border-gray-100">
        {REACTIONS.map(r => (
          <button
            key={r.id}
            onClick={() => handleReaction(r.id)}
            disabled={userReaction !== null}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
              userReaction === r.id 
                ? 'bg-primary-50 border-primary-300 text-primary-700' 
                : 'border-gray-200 hover:bg-gray-100 text-gray-600'
            } ${userReaction && userReaction !== r.id ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="text-xl">{r.emoji}</span>
            <span className="font-medium text-sm">{reactions[r.id] || 0}</span>
          </button>
        ))}
      </div>

      {/* Comment Form */}
      <form onSubmit={handleCommentSubmit} className="mb-8">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Nama Anda"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input bg-gray-50"
            required
            maxLength={50}
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Tulis komentar Anda..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="input bg-gray-50 min-h-[100px] resize-none"
            required
            maxLength={500}
          />
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting || !name.trim() || !commentText.trim()}
          className="btn-primary w-full sm:w-auto disabled:opacity-50"
        >
          {isSubmitting ? 'Mengirim...' : 'Kirim Komentar'}
        </button>
        {commentError && <p className="text-red-500 text-sm mt-3">{commentError}</p>}
      </form>

      {/* Comment List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center italic py-4">Belum ada komentar. Jadilah yang pertama!</p>
        ) : (
          comments.map(c => (
            <div key={c.id} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold flex-shrink-0">
                {c.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-800">{c.name}</span>
                  <span className="text-xs text-gray-400">
                    {c.createdAt?.toDate ? formatDate(c.createdAt.toDate()) : 'Baru saja'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{c.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
