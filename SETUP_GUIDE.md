# 🕌 DEMA Website — Panduan Setup Lengkap

## Prasyarat
- Node.js v18 atau lebih baru → https://nodejs.org
- Akun Google untuk Firebase → https://firebase.google.com
- VS Code (disarankan) → https://code.visualstudio.com

---

## LANGKAH 1 — Install Dependencies

```bash
# Masuk ke folder project
cd dema-website

# Install semua package
npm install

# Jalankan development server
npm run dev
# Buka http://localhost:5173
```

---

## LANGKAH 2 — Setup Firebase Project

### A. Buat Project Firebase
1. Buka https://console.firebase.google.com
2. Klik **"Create a project"**
3. Nama project: `dema-stai-attahdzib` (atau sesuai selera)
4. Nonaktifkan Google Analytics (opsional)
5. Klik **Create Project**

### B. Tambahkan Web App
1. Di halaman project, klik ikon **`</>`** (Web)
2. App nickname: `DEMA Website`
3. ✅ Centang **"Also set up Firebase Hosting"**
4. Klik **Register App**
5. **Salin `firebaseConfig`** yang muncul

### C. Isi `src/firebase/firebaseConfig.js`
Ganti bagian ini dengan config yang kamu dapat dari Firebase:
```js
const firebaseConfig = {
  apiKey:            "AIzaSy...",
  authDomain:        "dema-project.firebaseapp.com",
  projectId:         "dema-project",
  storageBucket:     "dema-project.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abc123",
};
```

---

## LANGKAH 3 — Aktifkan Layanan Firebase

### Firestore Database
1. Sidebar kiri → **Build → Firestore Database**
2. Klik **Create database**
3. Pilih **"Start in production mode"**
4. Region: **`asia-southeast1`** (Singapore, paling dekat)
5. Klik **Enable**

### Firebase Storage
1. Sidebar kiri → **Build → Storage**
2. Klik **Get started**
3. Pilih **"Start in production mode"**
4. Region: sama dengan Firestore
5. Klik **Done**

### Authentication (untuk admin)
1. Sidebar kiri → **Build → Authentication**
2. Klik **Get started**
3. Tab **Sign-in method** → Enable **Email/Password**
4. Tab **Users** → Klik **Add user**
5. Isi email dan password untuk akun admin DEMA
6. **Simpan email + password ini dengan aman!**

---

## LANGKAH 4 — Security Rules Firestore

Di Firestore → tab **Rules**, paste rules ini:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Publik bisa baca semua data
    match /{collection}/{document=**} {
      allow read: if true;
    }

    // Hanya admin (sudah login) yang bisa menulis
    match /{collection}/{document=**} {
      allow write: if request.auth != null;
    }

    // Aspirasi: siapa saja boleh create (kirim aspirasi)
    match /aspirations/{docId} {
      allow create: if true;
      allow update: if
        // Update upvotes (publik boleh)
        request.resource.data.diff(resource.data).affectedKeys()
          .hasOnly(['upvotes']) ||
        // Update lainnya hanya admin
        request.auth != null;
      allow delete: if request.auth != null;
    }
  }
}
```

Klik **Publish**.

---

## LANGKAH 5 — Security Rules Storage

Di Storage → tab **Rules**, paste:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      // Semua orang bisa baca (lihat gambar)
      allow read: if true;
      // Hanya admin yang bisa upload/hapus
      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

---

## LANGKAH 6 — Konfigurasi Website

Edit file `src/config/siteConfig.js`:

```js
export const siteConfig = {
  campusName: "STAI At-Tahdzib Jombang",    // ← Ganti nama kampus
  demaName:   "DEMA STAI At-Tahdzib",        // ← Ganti nama DEMA
  email:      "dema@kampus.ac.id",           // ← Email resmi
  whatsapp:   "6285xxxxxxxxx",               // ← Nomor WA (format: 62xxx)
  instagram:  "dema.kampus",                 // ← Username IG (tanpa @)
  // ... dst
};
```

Perubahan di file ini otomatis update di seluruh website.

---

## LANGKAH 7 — Isi Data Awal di Firestore

Masuk ke Firebase Console → Firestore Database → **Start collection**

### Buat koleksi `members` (contoh data):
```json
{
  "name": "Ahmad Fauzan",
  "position": "Ketua Umum",
  "division": "Umum / BPH",
  "order": 1,
  "photoUrl": "",
  "whatsapp": "6285123456789",
  "isExecutive": true
}
```

### Buat koleksi `announcements` (contoh):
```json
{
  "title": "Selamat Datang di Website DEMA!",
  "content": "Alhamdulillah, website resmi DEMA telah diluncurkan.",
  "category": "umum",
  "isUrgent": false,
  "publishedAt": "Timestamp sekarang"
}
```

Atau login ke `/admin` dan isi data melalui panel admin.

---

## LANGKAH 8 — Deploy ke Firebase Hosting

```bash
# Install Firebase CLI (sekali saja)
npm install -g firebase-tools

# Login ke akun Firebase
firebase login

# Build project untuk produksi
npm run build

# Deploy ke Firebase Hosting
firebase deploy --only hosting

# ✅ Website live di:
# https://nama-project.web.app
```

---

## LANGKAH 9 — Custom Domain (Opsional)

1. Firebase Console → Hosting → **Add custom domain**
2. Masukkan domain: `dema.stai-attahdzib.ac.id`
3. Ikuti instruksi verifikasi DNS
4. Tunggu propagasi (~24 jam)

---

## Struktur Folder Lengkap

```
dema-website/
├── public/
│   └── favicon.svg
├── src/
│   ├── config/
│   │   └── siteConfig.js          ← ⭐ EDIT INI untuk branding
│   ├── firebase/
│   │   ├── firebaseConfig.js      ← ⭐ EDIT INI untuk koneksi Firebase
│   │   └── collections.js         ← Dokumentasi struktur DB
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── PageTransition.jsx
│   │   ├── SectionHeader.jsx
│   │   ├── AnnouncementCard.jsx
│   │   ├── ArticleCard.jsx
│   │   ├── EventCard.jsx
│   │   ├── MemberCard.jsx
│   │   ├── ScrollToTop.jsx
│   │   ├── AdminRoute.jsx
│   │   └── ImageUpload.jsx
│   ├── layouts/
│   │   ├── PublicLayout.jsx
│   │   └── AdminLayout.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Structure.jsx
│   │   ├── Programs.jsx
│   │   ├── Announcements.jsx
│   │   ├── AnnouncementDetail.jsx
│   │   ├── Articles.jsx
│   │   ├── ArticleDetail.jsx
│   │   ├── Events.jsx
│   │   ├── Gallery.jsx
│   │   ├── Aspirations.jsx
│   │   ├── Contact.jsx
│   │   └── admin/
│   │       ├── Login.jsx
│   │       ├── Dashboard.jsx
│   │       ├── ManageAnnouncements.jsx
│   │       ├── ManageArticles.jsx
│   │       ├── ManageMembers.jsx
│   │       ├── ManageGallery.jsx
│   │       ├── ManagePrograms.jsx
│   │       ├── ManageEvents.jsx
│   │       └── ManageAspirations.jsx
│   ├── services/
│   │   └── firestoreService.js
│   ├── hooks/
│   │   └── useAuth.js
│   ├── utils/
│   │   └── formatters.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── firebase.json
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

---

## URL Penting

| URL | Keterangan |
|-----|-----------|
| `/` | Beranda |
| `/tentang` | Tentang DEMA |
| `/struktur` | Struktur organisasi |
| `/program-kerja` | Program kerja |
| `/pengumuman` | Daftar pengumuman |
| `/pengumuman/:id` | Detail pengumuman |
| `/artikel` | Daftar artikel |
| `/artikel/:slug` | Detail artikel |
| `/kegiatan` | Kalender kegiatan |
| `/galeri` | Galeri foto |
| `/aspirasi` | Form & daftar aspirasi |
| `/kontak` | Kontak per divisi |
| `/admin/login` | Login admin |
| `/admin` | Dashboard admin |
| `/admin/pengumuman` | Kelola pengumuman |
| `/admin/artikel` | Kelola artikel |
| `/admin/anggota` | Kelola pengurus |
| `/admin/galeri` | Kelola galeri |
| `/admin/program` | Kelola program kerja |
| `/admin/kegiatan` | Kelola kegiatan |
| `/admin/aspirasi` | Kelola aspirasi |

---

## Koleksi Firestore

| Koleksi | Isi |
|---------|-----|
| `announcements` | Pengumuman resmi DEMA |
| `articles` | Artikel dan berita |
| `events` | Kalender kegiatan |
| `gallery` | Album foto dokumentasi |
| `members` | Data pengurus DEMA |
| `programs` | Program kerja divisi |
| `aspirations` | Aspirasi mahasiswa |

---

## Tips Penggunaan Admin

1. **Login admin**: buka `/admin/login`, masukkan email yang dibuat di Firebase Auth
2. **Urutan tampil**: atur field `order` di data pengurus (1 = paling atas)
3. **Artikel**: klik "Publikasikan sekarang" agar tampil di publik
4. **Aspirasi**: beri tanggapan dan ubah status agar mahasiswa tahu progress-nya
5. **Galeri**: buat album dulu, lalu tambah foto multiple sekaligus

---

## Troubleshooting

**Q: Gambar tidak muncul setelah upload?**
A: Periksa Storage Rules sudah diset `allow read: if true`

**Q: Login admin gagal?**
A: Pastikan akun sudah dibuat di Firebase Auth → Users

**Q: Data tidak muncul di website?**
A: Periksa Firestore Rules sudah `allow read: if true`

**Q: Error `Firebase: No Firebase App`?**
A: Pastikan `firebaseConfig.js` sudah diisi dengan config yang benar

---

*Dibuat dengan ❤️ untuk DEMA STAI At-Tahdzib Jombang*
