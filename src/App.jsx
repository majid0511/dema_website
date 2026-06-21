import { useState, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { NotificationProvider } from './context/NotificationContext';
import NotificationDashboard from './components/NotificationDashboard';
import ConfirmDialog from './components/ConfirmDialog';
import PublicLayout  from './layouts/PublicLayout';
// import AdminLayout   from './layouts/AdminLayout';
// import AdminRoute    from './components/AdminRoute';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load Public pages
const HomePage               = lazy(() => import('./pages/Home'));
const AboutPage              = lazy(() => import('./pages/About'));
const StructurePage          = lazy(() => import('./pages/Structure'));
const ProgramsPage           = lazy(() => import('./pages/Programs'));
const AnnouncementsPage      = lazy(() => import('./pages/Announcements'));
const AnnouncementDetailPage = lazy(() => import('./pages/AnnouncementDetail'));
const ArticlesPage           = lazy(() => import('./pages/Articles'));
const ArticleDetailPage      = lazy(() => import('./pages/ArticleDetail'));
const EventsPage             = lazy(() => import('./pages/Events'));
const GalleryPage            = lazy(() => import('./pages/Gallery'));
const AspirationsPage        = lazy(() => import('./pages/Aspirations'));
const ContactPage            = lazy(() => import('./pages/Contact'));
const EventCheckinPage       = lazy(() => import('./pages/EventCheckin'));

// Lazy load Admin pages
const AdminRoute             = lazy(() => import('./components/AdminRoute'));
const AdminLayout            = lazy(() => import('./layouts/AdminLayout'));
const AdminLogin             = lazy(() => import('./pages/admin/Login'));
const AdminDashboard         = lazy(() => import('./pages/admin/Dashboard'));
const AdminAnnouncements     = lazy(() => import('./pages/admin/ManageAnnouncements'));
const AdminArticles          = lazy(() => import('./pages/admin/ManageArticles'));
const AdminMembers           = lazy(() => import('./pages/admin/ManageMembers'));
const AdminGallery           = lazy(() => import('./pages/admin/ManageGallery'));
const AdminPrograms          = lazy(() => import('./pages/admin/ManagePrograms'));
const AdminEvents            = lazy(() => import('./pages/admin/ManageEvents'));
const AdminAspirations       = lazy(() => import('./pages/admin/ManageAspirations'));

export default function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);

  return (
    <NotificationProvider>
      {isAppLoading && <LoadingScreen onComplete={() => setIsAppLoading(false)} />}
      <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <AnimatePresence mode="wait">
          <ErrorBoundary>
            <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          }>
            <Routes>
            {/* ── PUBLIC ── */}
            <Route element={<PublicLayout />}>
              <Route path="/"                  element={<HomePage />} />
              <Route path="/tentang"           element={<AboutPage />} />
              <Route path="/struktur"          element={<StructurePage />} />
              <Route path="/program-kerja"     element={<ProgramsPage />} />
              <Route path="/pengumuman"        element={<AnnouncementsPage />} />
              <Route path="/pengumuman/:id"    element={<AnnouncementDetailPage />} />
              <Route path="/artikel"           element={<ArticlesPage />} />
              <Route path="/artikel/:slug"     element={<ArticleDetailPage />} />
              <Route path="/kegiatan"          element={<EventsPage />} />
              <Route path="/galeri"            element={<GalleryPage />} />
              <Route path="/aspirasi"          element={<AspirationsPage />} />
              <Route path="/kontak"            element={<ContactPage />} />
            </Route>

            {/* ── STANDALONE ── */}
            <Route path="/checkin/:id" element={<EventCheckinPage />} />

            {/* ── ADMIN ── */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index                    element={<AdminDashboard />} />
              <Route path="pengumuman"        element={<AdminAnnouncements />} />
              <Route path="artikel"           element={<AdminArticles />} />
              <Route path="anggota"           element={<AdminMembers />} />
              <Route path="galeri"            element={<AdminGallery />} />
              <Route path="program"           element={<AdminPrograms />} />
              <Route path="kegiatan"          element={<AdminEvents />} />
              <Route path="aspirasi"          element={<AdminAspirations />} />
            </Route>
            </Routes>
            </Suspense>
          </ErrorBoundary>
        </AnimatePresence>
      <NotificationDashboard />
      <ConfirmDialog />
    </BrowserRouter>
    </NotificationProvider>
  );
}
