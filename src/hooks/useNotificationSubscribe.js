import { useState, useEffect, useCallback } from 'react';
import { getToken, deleteToken, onMessage } from 'firebase/messaging';
import { collection, query, where, getDocs, addDoc, doc, deleteDoc } from 'firebase/firestore';
import { messaging, db } from '../firebase/firebaseConfig';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export default function useNotificationSubscribe() {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tokenId, setTokenId] = useState(null);

  const checkExisting = useCallback(async () => {
    if (!messaging || Notification.permission !== 'granted') {
      setLoading(false);
      return;
    }
    try {
      const current = await getToken(messaging, { vapidKey: VAPID_KEY });
      if (!current) { setLoading(false); return; }
      const q = query(collection(db, 'fcm_tokens'), where('token', '==', current));
      const snap = await getDocs(q);
      if (!snap.empty) {
        setSubscribed(true);
        setTokenId(snap.docs[0].id);
      }
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { checkExisting(); }, [checkExisting]);

  useEffect(() => {
    if (!messaging) return;
    const unsub = onMessage(messaging, payload => {
      const { title, body } = payload.data || {};
      if (title) {
        new Notification(title, { body, icon: '/logo/logo_dema_126.webp' });
      }
    });
    return unsub;
  }, []);

  const subscribe = async () => {
    if (!messaging) return;
    setLoading(true);
    try {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') return;

      const token = await getToken(messaging, { vapidKey: VAPID_KEY });
      if (!token) return;

      const q = query(collection(db, 'fcm_tokens'), where('token', '==', token));
      const snap = await getDocs(q);
      if (snap.empty) {
        const docRef = await addDoc(collection(db, 'fcm_tokens'), {
          token,
          subscribedAt: new Date(),
          platform: navigator.platform || 'unknown',
        });
        setTokenId(docRef.id);
      } else {
        setTokenId(snap.docs[0].id);
      }
      setSubscribed(true);
    } catch {} finally { setLoading(false); }
  };

  const doUnsubscribe = useCallback(async () => {
    if (!messaging || !tokenId) return;
    setLoading(true);
    try {
      const current = await getToken(messaging, { vapidKey: VAPID_KEY });
      if (current) await deleteToken(messaging);
      await deleteDoc(doc(db, 'fcm_tokens', tokenId));
      setSubscribed(false);
      setTokenId(null);
    } catch {} finally { setLoading(false); }
  }, [tokenId]);

  return { subscribed, loading, subscribe, unsubscribe: doUnsubscribe };
}
