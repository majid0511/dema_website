# 🕌 DEMA Website

**Situs web resmi Dewan Eksekutif Mahasiswa (DEMA) STAI At-Tahdzib Jombang**

Aplikasi web modern, responsif, dan dinamis untuk DEMA yang menampilkan informasi organisasi, pengumuman, artikel, kegiatan, dan fitur manajemen admin yang lengkap.

---

## ✨ Fitur Utama

### 🌐 **Untuk Umum (Publik)**
- **Beranda** - Tampilan ringkas dengan quick menu dan feed berita terbaru
- **Tentang DEMA** - Profil organisasi, visi, misi, dan struktur nilai
- **Struktur Organisasi** - Daftar anggota BPH dengan divisi dan jabatan
- **Program Kerja** - Daftar program kerja dengan status (rencana, berjalan, selesai)
- **Pengumuman** - Feed pengumuman terbaru dengan detail individual
- **Artikel** - Blog/artikel dengan tagging dan detail view
- **Kegiatan** - Event/acara yang akan datang dan yang sudah berlalu
- **Galeri** - Galeri foto dari berbagai kegiatan
- **Aspirasi** - Form submissions dari mahasiswa dengan sistem status tracking
- **Kontak** - Halaman kontak dengan link social media
- **SEO Dinamis** - Meta tags, Open Graph, dan Twitter Card otomatis per halaman
- **Push Notifikasi** - Subscribe notifikasi browser untuk artikel & pengumuman baru

### 🔐 **Admin Dashboard**
- **Login Admin** - Autentikasi Firebase dengan email & password
- **Dashboard** - Ringkas statistik dan quick access ke semua modul
- **Kelola Pengumuman** - CRUD pengumuman dengan publish/unpublish + kirim notifikasi otomatis
- **Kelola Artikel** - Manajemen artikel dengan **Rich Text Editor** (TipTap) + kirim notifikasi otomatis
- **Kelola Anggota** - Database anggota BPH dan strukturnya
- **Kelola Galeri** - Upload dan organisir foto kegiatan
- **Kelola Program Kerja** - CRUD program dengan status management
- **Kelola Kegiatan** - Manajemen event/acara
- **Kelola Aspirasi** - Lihat aspirasi masuk, ubah status, dan marking

### 🎨 **User Experience**
- **Responsive Design** - Sempurna di desktop, tablet, dan mobile
- **Animasi Smooth** - Transisi page dan elemen dengan Framer Motion
- **Dark Mode Ready** - Tailwind CSS untuk styling yang konsisten
- **Loading States** - Skeleton loaders dan progress indicators
- **Toast Notifications** - Feedback user untuk setiap aksi
- **Confirmation Dialogs** - Dialog konfirmasi untuk aksi destruktif

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 | UI library |
| **Routing** | React Router v6 | Client-side routing |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Animations** | Framer Motion | Smooth transitions & effects |
| **Icons** | Lucide React, React Icons | Icon library |
| **Backend** | Firebase | BaaS (Auth, Firestore, Authentication) |
| **Database** | Firestore | NoSQL cloud database |
| **Image Storage** | Cloudinary | Cloud image hosting & optimization |
| **Backup Storage** | Firebase Storage | Cloud file backup |
| **Build Tool** | Vite | Fast build & dev server |
| **Date Handling** | date-fns | Date utilities |
| **HTTP Client** | Axios | API requests |
| **Rich Text Editor** | TipTap | WYSIWYG editor untuk konten artikel/pengumuman |
| **SEO** | react-helmet-async | Dynamic meta tags & Open Graph |
| **Push Notifications** | Firebase Cloud Messaging | Browser push notifications |

---

## 📁 Project Structure

```
dema-website/
├── src/
│   ├── App.jsx                          # Main app routing
│   ├── main.jsx                         # React entry point
│   ├── index.css                        # Global styles
│   │
│   ├── components/                      # Reusable components
│   │   ├── AdminRoute.jsx              # Protected route for admin
│   │   ├── AnnouncementCard.jsx        # Announcement display card
│   │   ├── ArticleCard.jsx             # Article preview card
│   │   ├── ConfirmDialog.jsx           # Confirmation modal
│   │   ├── EventCard.jsx               # Event display card
│   │   ├── Footer.jsx                  # Site footer
│   │   ├── ImageUpload.jsx             # Image upload widget (Cloudinary)
│   │   ├── MemberCard.jsx              # Member profile card
│   │   ├── Navbar.jsx                  # Navigation bar
│   │   ├── NotificationBell.jsx        # Subscribe/unsubscribe push notif
│   │   ├── NotificationDashboard.jsx   # Toast notifications
│   │   ├── PageTransition.jsx          # Page animation wrapper
│   │   ├── RichTextEditor.jsx          # TipTap WYSIWYG editor
│   │   ├── ScrollToTop.jsx             # Scroll to top on navigation
│   │   └── SectionHeader.jsx           # Section title component
│   │
│   ├── layouts/
│   │   ├── PublicLayout.jsx            # Navbar + Footer + Outlet
│   │   └── AdminLayout.jsx             # Admin sidebar + Outlet
│   │
│   ├── pages/
│   │   ├── Home.jsx                    # Homepage
│   │   ├── About.jsx                   # About DEMA page
│   │   ├── Structure.jsx               # Organization chart
│   │   ├── Programs.jsx                # Work programs
│   │   ├── Announcements.jsx           # Announcements list
│   │   ├── AnnouncementDetail.jsx      # Single announcement
│   │   ├── Articles.jsx                # Articles list
│   │   ├── ArticleDetail.jsx           # Single article
│   │   ├── Events.jsx                  # Events list
│   │   ├── Gallery.jsx                 # Photo gallery
│   │   ├── Aspirations.jsx             # Aspiration submission form
│   │   ├── Contact.jsx                 # Contact page
│   │   └── admin/
│   │       ├── Login.jsx               # Admin login
│   │       ├── Dashboard.jsx           # Admin dashboard
│   │       ├── ManageAnnouncements.jsx
│   │       ├── ManageArticles.jsx
│   │       ├── ManageMembers.jsx
│   │       ├── ManageGallery.jsx
│   │       ├── ManagePrograms.jsx
│   │       ├── ManageEvents.jsx
│   │       └── ManageAspirations.jsx
│   │
│   ├── config/
│   │   └── siteConfig.js               # Site-wide configuration
│   │
│   ├── context/
│   │   └── NotificationContext.jsx     # Notification & confirm dialogs
│   │
│   ├── firebase/
│   │   ├── firebaseConfig.js           # Firebase initialization
│   │   └── collections.js              # Firestore collection refs
│   │
│   ├── hooks/
│   │   ├── useAuth.js                  # Firebase auth hook
│   │   ├── useNotificationSubscribe.js # FCM push notification subscribe
│   │   ├── useScrollPosition.js        # Scroll position tracking
│   │   └── useSEO.jsx                  # Dynamic meta tags (helmet)
│   │
│   ├── services/
│   │   ├── firestoreService.js         # Firestore CRUD operations
│   │   └── sendNotification.js         # FCM push notification broadcast
│   │
│   └── utils/
│       ├── formatters.js               # Date/text formatters
│       ├── useConfirm.js               # Confirmation dialog hook
│       └── useNotify.js                # Toast notification hook
│
├── public/                             # Static assets
│   └── firebase-messaging-sw.js       # FCM service worker
├── .env                               # Environment variables
├── .env.example                       # Environment variable template
├── index.html                          # HTML entry point
├── package.json                        # Dependencies & scripts
├── vite.config.js                      # Vite configuration
├── tailwind.config.js                  # Tailwind theme config
├── postcss.config.js                   # PostCSS plugins
├── firebase.json                       # Firebase hosting config
└── SETUP_GUIDE.md                      # Detailed setup instructions
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ → https://nodejs.org
- **npm** atau **yarn**
- **Git**
- **Google Account** (untuk Firebase)

### 1. Clone Repository
```bash
git clone <repository-url>
cd dema-website
```

### 2. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Setup Environment Variables
```bash
cp .env.example .env
```
Edit `.env` dan isi nilai Firebase config serta kredensial lainnya:
- `VITE_FIREBASE_*` — dari Firebase Console → Project Settings → General → Your apps → Firebase SDK snippet
- `VITE_FIREBASE_VAPID_KEY` — dari Firebase Console → Cloud Messaging → Web Push certificates
- `VITE_FCM_SERVER_KEY` — dari Firebase Console → Cloud Messaging → Cloud Messaging API (Legacy)

### 4. Setup Firebase
1. Buat Firebase project di https://console.firebase.google.com
2. Aktifkan Firestore, Storage, Authentication (Email/Password), dan Cloud Messaging
3. Atur security rules (lihat `SETUP_GUIDE.md`)

### 5. Run Development Server
```bash
npm run dev
```
Buka http://localhost:5173 di browser

### 6. Build untuk Production
```bash
npm run build
npm run preview
```

---

## 🔐 Admin Authentication

### Login Admin
- URL: `http://localhost:5173/admin/login`
- Email: (ditetapkan di Firebase Console)
- Password: (ditetapkan di Firebase Console)

### Membuat Admin Baru
1. Buka Firebase Console → Authentication → Users
2. Klik "Add user"
3. Masukkan email dan password
4. Admin dapat login dengan credentials tersebut

---

## 📊 Database Structure (Firestore)

### Collections

#### `announcements`
```json
{
  "id": "auto-generated",
  "title": "Rapat Koordinasi Rutin",
  "content": "Lorem ipsum...",
  "image": "https://storage.firebase.com/...",
  "publishedAt": "2025-01-15T10:30:00Z",
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-15T10:30:00Z"
}
```

#### `articles`
```json
{
  "id": "auto-generated",
  "title": "Pentingnya Soft Skill untuk Mahasiswa",
  "slug": "pentingnya-soft-skill",
  "content": "Lorem ipsum...",
  "author": "Muhammad Ali",
  "thumbnail": "https://storage.firebase.com/...",
  "isPublished": true,
  "publishedAt": "2025-01-15T10:30:00Z",
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-15T10:30:00Z"
}
```

#### `members`
```json
{
  "id": "auto-generated",
  "name": "Ahmad Subrata",
  "position": "Ketua Umum",
  "division": "Umum / BPH",
  "photo": "https://storage.firebase.com/...",
  "period": "2024/2025",
  "order": 1,
  "createdAt": "2025-01-15T10:30:00Z"
}
```

#### `events`
```json
{
  "id": "auto-generated",
  "title": "Seminar Entrepreneurship",
  "description": "...",
  "startDate": "2025-02-15T14:00:00Z",
  "endDate": "2025-02-15T17:00:00Z",
  "location": "Aula STAI At-Tahdzib",
  "image": "https://storage.firebase.com/...",
  "status": "upcoming",
  "createdAt": "2025-01-15T10:30:00Z"
}
```

#### `programs`
```json
{
  "id": "auto-generated",
  "title": "Program Tahsin Al-Quran",
  "description": "...",
  "division": "Keagamaan",
  "status": "running",
  "startDate": "2025-01-01",
  "endDate": "2025-06-30",
  "image": "https://storage.firebase.com/...",
  "createdAt": "2025-01-15T10:30:00Z"
}
```

#### `gallery`
```json
{
  "id": "auto-generated",
  "title": "Foto Acara Workshop IT",
  "images": [
    "https://storage.firebase.com/...",
    "https://storage.firebase.com/..."
  ],
  "eventDate": "2025-01-10",
  "createdAt": "2025-01-15T10:30:00Z"
}
```

#### `aspirations`
```json
{
  "id": "auto-generated",
  "name": "Ahmad Yani",
  "email": "ahmad@student.com",
  "phone": "081234567890",
  "category": "akademik",
  "message": "Saran untuk meningkatkan akademik...",
  "status": "received",
  "submittedAt": "2025-01-15T10:30:00Z",
  "processedAt": null
}
```

#### `fcm_tokens`
```json
{
  "id": "auto-generated",
  "token": "fcm-device-token-here",
  "subscribedAt": "2025-06-10T10:30:00Z",
  "platform": "Win32"
}
```

---

## ⚙️ Configuration

### Environment Variables (`.env`)

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase Web API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase App ID |
| `VITE_FIREBASE_VAPID_KEY` | Web Push certificate (FCM) |
| `VITE_FCM_SERVER_KEY` | FCM Legacy Server Key untuk kirim notifikasi |

### Site Configuration (`src/config/siteConfig.js`)
Edit file ini untuk mengubah info organisasi di seluruh website:

```javascript
export const siteConfig = {
  // Identitas
  campusName:    "STAI At-Tahdzib Jombang",
  demaName:      "DEMA STAI At-Tahdzib",
  shortName:     "DEMA",
  logo:          "/logo_dema.png",
  
  // Warna tema
  primaryColor:  "#165c3d",    // Hijau tua
  secondaryColor:"#52b788",    // Hijau cerah
  accentColor:   "#d4a017",    // Gold
  
  // Kontak
  address:       "Jl. Pesantren At-Tahdzib, Jombang",
  email:         "dema@stai-attahdzib.ac.id",
  phone:         "+62 xxx-xxxx-xxxx",
  
  // Sosial Media
  instagram:     "demaattahdzib",
  youtube:       "pesantrenattahdzib",
  tiktok:        "dema.attahdzib",
  whatsapp:      "6285xxxxxxxxx",
  
  // Konten Hero
  heroTitle:     "Dewan Eksekutif Mahasiswa",
  heroSubtitle:  "Berkhidmat untuk Mahasiswa",
  
  // Visi & Misi
  visi: "Mewujudkan mahasiswa yang berilmu...",
  misi: ["Menyelenggarakan...", "Membangun..."],
};
```

### Theme Colors (Tailwind)
Edit `tailwind.config.js` untuk mengubah palet warna:
```javascript
colors: {
  primary: {
    50: '#d8f3dc',   // lightest
    700: '#081c15'   // darkest
  },
  gold: {
    100: '#fef3c7',
    400: '#d4a017',
    600: '#92400e'
  }
}
```

---

## 📤 Image Upload (Cloudinary)

Upload image menggunakan komponen `ImageUpload.jsx` yang langsung terintegrasi dengan Cloudinary via Axios.

### Setup Cloudinary
1. Buat akun di https://cloudinary.com
2. Buat upload preset bernama `dema_upload` (unsigned)
3. Cloud Name: `dfmp92e7s`
4. Upload Preset: `dema_upload`

### Cara Menggunakan
```jsx
import ImageUpload from '../../components/ImageUpload';

<ImageUpload
  folder="articles"
  currentUrl={form.thumbnailUrl}
  onUpload={url => setForm({...form, thumbnailUrl: url})}
/>
```

---

## 🎣 Custom Hooks

### `useSEO({ title, description, image, url })`
Menyuntikkan meta tags & Open Graph ke `<head>`:
```jsx
import useSEO from '../hooks/useSEO';

const Component = () => {
  return (
    <>
      {useSEO({ title: 'Judul Halaman', description: 'Deskripsi', image: '/img.jpg' })}
      <PageTransition>...</PageTransition>
    </>
  );
};
```
- Fallback ke default dari `siteConfig` jika tidak ada parameter
- Otomatis menambahkan `og:title`, `og:description`, `og:image`, `og:url`, `twitter:card`

### `useNotificationSubscribe()`
Subscribe browser push notifications via FCM:
```javascript
import useNotificationSubscribe from '../hooks/useNotificationSubscribe';

const { subscribed, loading, subscribe, unsubscribe } = useNotificationSubscribe();
```
- Minta izin notifikasi → ambil FCM token → simpan ke koleksi `fcm_tokens` di Firestore
- Cek duplikasi token agar tidak tersimpan dua kali
- Dengarkan `onMessage` untuk notifikasi foreground

### `useAuth()`
Mengelola autentikasi admin:
```javascript
const { user, loading, login, logout, isAdmin } = useAuth();
```

---

## 🔌 Service Layer (`firestoreService.js`)

Semua operasi Firebase terpusat di satu file:

```javascript
// CRUD
import { getAll, getOne, create, update, remove } from '@/services/firestoreService';

// Fetch semua pengumuman
const announcements = await getAll('announcements');

// Fetch satu artikel
const article = await getOne('articles', 'article-123');

// Buat dokumen baru
const id = await create('aspirations', {
  name: 'Ahmad',
  message: 'Saran untuk DEMA'
});

// Update dokumen
await update('members', 'member-123', {
  name: 'Muhammad Ali',
  position: 'Wakil Ketua'
});

// Hapus dokumen
await remove('events', 'event-123');

// Query siap pakai
const latestAnnouncements = await getLatestAnnouncements(5);
const publishedArticles = await getPublishedArticles(10);
```

### Upload Image
```javascript
// Gunakan Cloudinary untuk upload image
import { uploadImage } from '@/lib/cloudinary';

const imageUrl = await uploadImage(file);

// Kemudian simpan URL ke Firestore
await create('announcements', {
  title: 'Judul Pengumuman',
  image: imageUrl,  // URL dari Cloudinary
  content: 'Isi pengumuman...'
});
```

---

## 🎨 Component Usage

### PageTransition
Animasi page change:
```jsx
<PageTransition>
  <div>Your page content</div>
</PageTransition>
```

### SectionHeader
Header untuk setiap section:
```jsx
<SectionHeader 
  title="Pengumuman Terbaru"
  subtitle="Update info penting dari DEMA"
/>
```

### AnnouncementCard / ArticleCard / EventCard
Display card components:
```jsx
<AnnouncementCard 
  id="ann-123"
  title="Rapat Koordinasi"
  date="15 Januari 2025"
  image="/img.jpg"
/>
```

### ImageUpload
Upload widget dengan preview (menggunakan Cloudinary):
```jsx
<ImageUpload 
  onUpload={(url) => setImageUrl(url)}
  folder="articles"
/>
```

**Note**: Component ini menggunakan Cloudinary untuk upload, bukan Firebase Storage.

### RichTextEditor
WYSIWYG editor berbasis TipTap untuk konten HTML:
```jsx
import RichTextEditor from '../../components/RichTextEditor';

<RichTextEditor
  value={form.content}
  onChange={html => setForm({...form, content: html})}
  placeholder="Tulis konten di sini..."
/>
```
- Toolbar: H1-H3, Bold, Italic, Underline, Bullet List, Ordered List, Blockquote, Link, Image
- Output berupa HTML string
- Styling toolbar sesuai tema hijau (#165c3d)

### NotificationBell
Tombol subscribe/unsubscribe push notification di navbar:
```jsx
import NotificationBell from './NotificationBell';

<NotificationBell />
```
- State aktif: icon bell dengan dot hijau
- State nonaktif: icon bell abu-abu
- Handle izin notifikasi browser secara otomatis

### SEO (useSEO hook)
Setiap halaman publik sudah dilengkapi SEO dinamis:
- `Home.jsx` — default dari siteConfig
- `ArticleDetail.jsx` — title, description (strip HTML, 160 char), thumbnail
- `AnnouncementDetail.jsx` — title, description, image

---

### Service: sendPushNotification
Broadcast notifikasi ke semua subscriber via FCM:
```javascript
import sendPushNotification from '../../services/sendNotification';

await sendPushNotification({
  title: '📢 Pengumuman Baru',
  body: 'Judul pengumuman',
  url: '/pengumuman/id123',
});
```
- Membaca semua token dari koleksi `fcm_tokens` di Firestore
- Mengirim via FCM Legacy HTTP API (`fcm.googleapis.com/fcm/send`)
- Sertakan `click_action` agar notifikasi bisa diklik menuju halaman terkait

---

## 🚀 Deployment

### Deploy ke Firebase Hosting

#### 1. Login Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

#### 2. Initialize Hosting
```bash
firebase init hosting
# Select your project
# Public directory: dist
# Configure as SPA: Yes
```

#### 3. Build & Deploy
```bash
npm run build
firebase deploy
```

**Live URL**: `https://your-project.web.app`

### Deploy ke Vercel (Alternative)
```bash
npm install -g vercel
vercel
```

---

## 📝 Common Tasks

### Menambah Halaman Baru

1. Buat file `src/pages/NewPage.jsx`:
```jsx
import PageTransition from '../components/PageTransition';
import SectionHeader from '../components/SectionHeader';

export default function NewPage() {
  return (
    <PageTransition>
      <SectionHeader title="Judul Halaman" />
      {/* Content */}
    </PageTransition>
  );
}
```

2. Tambah route di `src/App.jsx`:
```jsx
<Route path="/halaman-baru" element={<NewPage />} />
```

3. Update navbar di `src/components/Navbar.jsx`:
```javascript
const NAV_ITEMS = [
  // ...
  { label: 'Halaman Baru', path: '/halaman-baru' },
];
```

### Menambah Koleksi Firestore

1. Definisikan di `src/firebase/collections.js`:
```javascript
export const COLLECTIONS = {
  // ...
  NEW_COLLECTION: 'new-collection',
};
```

2. Buat admin page `src/pages/admin/ManageNewCollection.jsx`
3. Gunakan `firestoreService.js` untuk CRUD

### Customize Brand Color

Edit `src/config/siteConfig.js`:
```javascript
primaryColor: "#165c3d",   // Ubah ke warna pilihan
secondaryColor: "#52b788",
accentColor: "#d4a017",
```

Dan update `tailwind.config.js` untuk custom color range.

---

## 🐛 Troubleshooting

### Firebase Configuration Error
- Periksa `src/firebase/firebaseConfig.js`
- Pastikan API key valid di Firebase Console
- Periksa CORS settings jika deploy di domain berbeda

### Data Tidak Muncul
- Buka Firestore tab di Firebase Console
- Pastikan collection dan data sudah ada
- Check rules — pastikan `allow read: if true;`

### Image Upload Error
- Periksa Cloudinary credentials di `src/lib/cloudinary.js`
- Pastikan upload preset `dema_upload` sudah dibuat di Cloudinary
- Ukuran file tidak boleh > 100MB (limit Cloudinary)
- Periksa internet connection

### Admin Login Error
- Pastikan email/password sudah dibuat di Firebase Auth
- Periksa apakah authentication provider enabled
- Check browser console untuk detail error

### Styling Issue
- Run `npm run build` untuk rebuild Tailwind
- Clear browser cache (Ctrl+Shift+Delete)
- Periksa class name di Tailwind content config

---

## 📚 Resources

- **React Docs**: https://react.dev
- **React Router**: https://reactrouter.com
- **Firebase Docs**: https://firebase.google.com/docs
- **Tailwind CSS**: https://tailwindcss.com
- **Framer Motion**: https://www.framer.com/motion
- **Vite**: https://vitejs.dev

---

## 👥 Team Structure (Typical)

| Role | Responsibility |
|------|-----------------|
| **Ketua Umum** | Strategic oversight |
| **Wakil Ketua** | Deputy oversight |
| **Divisi Akademik** | Educational programs |
| **Divisi Sosial** | Community outreach |
| **Divisi Media** | Website & communication |
| **Divisi Olahraga** | Sports & arts programs |

---

## 📄 License

Dibangun khusus untuk DEMA STAI At-Tahdzib Jombang

---

## 💡 Tips & Best Practices

✅ **DO:**
- Selalu gunakan `firestoreService.js` untuk database operations
- Check `useAuth()` loading state sebelum render admin pages
- Use `useNotify()` untuk feedback user yang jelas
- Optimize images sebelum upload
- Test di mobile device sebelum deployment

❌ **DON'T:**
- Jangan hardcode Firebase config di komponen
- Jangan expose Cloudinary API credentials di frontend (gunakan unsigned preset)
- Jangan skip password creation untuk admin accounts
- Jangan upload image > 100MB (limit Cloudinary)
- Jangan ubah collection names tanpa update di semua tempat
- Jangan lupa backup data Firestore regularly

---

**Dibuat dengan ❤️ untuk DEMA STAI At-Tahdzib Jombang**

*Last Updated: 2025*
