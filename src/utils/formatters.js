/**
 * Kumpulan fungsi utility untuk format data.
 */
import { format, formatDistanceToNow, isValid } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

function normalizeDate(ts) {
  if (!ts) return null;
  if (ts?.toDate) return ts.toDate();
  if (typeof ts === 'number' || typeof ts === 'string') {
    const date = new Date(ts);
    return isValid(date) ? date : null;
  }
  if (typeof ts === 'object' && ts.seconds != null) {
    const millis = ts.seconds * 1000 + Math.floor((ts.nanoseconds || 0) / 1_000_000);
    const date = new Date(millis);
    return isValid(date) ? date : null;
  }
  return null;
}

/** Format Firestore Timestamp atau Date ke string tanggal Indonesia */
export function formatDate(ts, fmt = 'd MMMM yyyy') {
  const date = normalizeDate(ts);
  return date ? format(date, fmt, { locale: localeId }) : '-';
}

/** Format relatif: "3 hari yang lalu" */
export function formatRelative(ts) {
  const date = normalizeDate(ts);
  return date ? formatDistanceToNow(date, { locale: localeId, addSuffix: true }) : '-';
}

/** Format rupiah: 1500000 → "Rp 1.500.000" */
export function formatRupiah(amount) {
  if (!amount) return '-';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

/** Buat URL-friendly slug dari judul */
export function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/** Potong teks panjang dengan ellipsis */
export function truncate(text, maxLength = 120) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/** Buat link WhatsApp dari nomor dan pesan opsional */
export function waLink(number, message = '') {
  const clean = number.replace(/\D/g, '');
  const msg   = encodeURIComponent(message);
  return `https://wa.me/${clean}${msg ? `?text=${msg}` : ''}`;
}
