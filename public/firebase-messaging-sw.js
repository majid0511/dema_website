importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey:            self.location.origin.includes('localhost') ? '' : 'AIzaSyDu3seYNbnFdbz52b1qlMuCtJBWnvqlOho',
  authDomain:        'dema-stai-attahdzib.firebaseapp.com',
  projectId:         'dema-stai-attahdzib',
  storageBucket: 'dema-stai-attahdzib.appspot.com',
  messagingSenderId: '900873489684',
  appId:             '1:900873489684:web:92895c4791e7f465744601',
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  const { title, body, icon, click_action } = payload.data || {};
  self.registration.showNotification(title || 'DEMA STAI At-Tahdzib', {
    body: body || '',
    icon: icon || '/logo/logo_dema_126.webp',
    data: { click_action },
  });
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.click_action || '/';
  event.waitUntil(clients.openWindow(url));
});
