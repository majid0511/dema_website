import axios from 'axios';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const SERVER_KEY = import.meta.env.VITE_FCM_SERVER_KEY;

export default async function sendPushNotification({ title, body, url }) {
  if (!SERVER_KEY) {
    console.warn('VITE_FCM_SERVER_KEY not set — notification not sent');
    return;
  }
  try {
    const snap = await getDocs(collection(db, 'fcm_tokens'));
    const tokens = snap.docs.map(d => d.data().token).filter(Boolean);
    if (tokens.length === 0) return;

    await axios.post(
      'https://fcm.googleapis.com/fcm/send',
      {
        registration_ids: tokens,
        notification: { title, body, icon: '/logo/logo_dema_126.webp' },
        data: { title, body, click_action: url, icon: '/logo/logo_dema_126.webp' },
        webpush: {
          fcm_options: { link: url },
          notification: { icon: '/logo/logo_dema_126.webp' },
        },
      },
      {
        headers: {
          'Authorization': `key=${SERVER_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err) {
    console.error('Gagal kirim notifikasi:', err);
  }
}
