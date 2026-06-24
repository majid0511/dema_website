const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { initializeApp }     = require('firebase-admin/app');
const { getMessaging }      = require('firebase-admin/messaging');
const { getFirestore }      = require('firebase-admin/firestore');

initializeApp();

/* ─── Artikel baru ─────────────────────────────────────────────────── */
exports.notifyNewArticle = onDocumentCreated('articles/{docId}', async (event) => {
  const data = event.data.data();

  // Hanya kirim notif jika langsung dipublish
  if (!data.isPublished) return null;

  return sendToAllTokens({
    title: '📰 Artikel Baru',
    body:  data.title,
    url:   `/artikel/${data.slug || event.params.docId}`,
  });
});

/* ─── Pengumuman baru ───────────────────────────────────────────────── */
exports.notifyNewAnnouncement = onDocumentCreated('announcements/{docId}', async (event) => {
  const data = event.data.data();

  return sendToAllTokens({
    title: '📢 Pengumuman Baru',
    body:  data.title,
    url:   `/pengumuman/${event.params.docId}`,
  });
});

/* ─── Helper: kirim ke semua token (batch 500) ──────────────────────── */
async function sendToAllTokens({ title, body, url }) {
  const db   = getFirestore();
  const snap = await db.collection('fcm_tokens').get();
  const tokens = snap.docs.map(d => d.data().token).filter(Boolean);

  if (tokens.length === 0) return null;

  // FCM batasi multicast max 500 token per request
  const chunks = [];
  for (let i = 0; i < tokens.length; i += 500) {
    chunks.push(tokens.slice(i, i + 500));
  }

  const messaging = getMessaging();

  for (const chunk of chunks) {
    await messaging.sendEachForMulticast({
      tokens: chunk,
      notification: { title, body },
      webpush: {
        notification: {
          title,
          body,
          icon: '/logo/logo_dema_126.webp',
        },
        fcmOptions: { link: url },
      },
    });
  }

  return null;
}
