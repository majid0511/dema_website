/**
 * SERVICE LAYER — semua operasi Firestore & Storage dipusatkan di sini.
 * Komponen tinggal import dan panggil fungsi, tidak perlu tahu detail Firebase.
 */
import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  getDocs, getDoc, query, where, orderBy, limit,
  serverTimestamp, increment,
} from 'firebase/firestore';
import {
  ref, uploadBytesResumable, getDownloadURL, deleteObject,
} from 'firebase/storage';
import { db, storage } from '../firebase/firebaseConfig';

/* ─── GENERIC CRUD ─────────────────────────────────────── */

/** Ambil semua dokumen dari koleksi dengan constraints opsional */
export async function getAll(col, constraints = []) {
  const q = query(collection(db, col), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/** Ambil satu dokumen berdasarkan ID */
export async function getOne(col, id) {
  const snap = await getDoc(doc(db, col, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/** Tambah dokumen baru */
export async function create(col, data) {
  const ref = await addDoc(collection(db, col), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

/** Update dokumen yang ada */
export async function update(col, id, data) {
  await updateDoc(doc(db, col, id), { ...data, updatedAt: serverTimestamp() });
}

/** Hapus dokumen */
export async function remove(col, id) {
  await deleteDoc(doc(db, col, id));
}

/** Increment field numerik (untuk upvote, views, dll) */
export async function incrementField(col, id, field, amount = 1) {
  await updateDoc(doc(db, col, id), { [field]: increment(amount) });
}

/* ─── UPLOAD FILE ──────────────────────────────────────── */

/**
 * Upload gambar ke Firebase Storage.
 * @param {File}     file        File dari <input type="file">
 * @param {string}   folder      Folder: 'announcements'|'articles'|'gallery'|'members'
 * @param {Function} onProgress  Callback (0-100)
 * @returns {Promise<string>}    Download URL
 */
export function uploadImage(file, folder, onProgress) {
  return new Promise((resolve, reject) => {
    const filename  = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    const stRef     = ref(storage, `${folder}/${filename}`);
    const task      = uploadBytesResumable(stRef, file);

    task.on('state_changed',
      snap => onProgress && onProgress(Math.round(snap.bytesTransferred / snap.totalBytes * 100)),
      reject,
      async () => resolve(await getDownloadURL(task.snapshot.ref)),
    );
  });
}

/** Hapus file dari Storage berdasarkan full URL */
export async function deleteImage(url) {
  try { await deleteObject(ref(storage, url)); }
  catch (e) { console.warn('Gagal hapus gambar:', e); }
}

/* ─── QUERY SIAP PAKAI ─────────────────────────────────── */

export const getLatestAnnouncements = (n = 10) =>
  getAll('announcements', [orderBy('publishedAt', 'desc'), limit(n)]);

export const getPublishedArticles = (n = 10) =>
  getAll('articles', [where('isPublished', '==', true), orderBy('publishedAt', 'desc'), limit(n)]);

export const getUpcomingEvents = (n = 10) =>
  getAll('events', [where('status', '==', 'upcoming'), orderBy('startDate', 'asc'), limit(n)]);

export const getAllMembers = () =>
  getAll('members', [orderBy('order', 'asc')]);

export const getAllAspirations = () =>
  getAll('aspirations', [orderBy('submittedAt', 'desc')]);

export const getAllPrograms = () =>
  getAll('programs', [orderBy('createdAt', 'desc')]);

export const getAllGallery = () =>
  getAll('gallery', [orderBy('eventDate', 'desc')]);

export const getEventAttendees = (eventId) =>
  getAll(`events/${eventId}/attendees`, [orderBy('checkinTime', 'desc')]);
