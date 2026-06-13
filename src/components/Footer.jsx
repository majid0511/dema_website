/**
 * Footer website DEMA.
 * Menampilkan logo, navigasi cepat, kontak, dan media sosial.
 */
import { Link } from 'react-router-dom';
import { siteConfig } from '../config/siteConfig';
import { waLink } from '../utils/formatters';
import { FaYoutube, FaInstagram, FaTiktok, FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const FOOTER_LINKS = [
  {
    title: 'Navigasi',
    links: [
      { label: 'Beranda',       path: '/' },
      { label: 'Tentang DEMA', path: '/tentang' },
      { label: 'Struktur Org', path: '/struktur' },
      { label: 'Program Kerja',path: '/program-kerja' },
    ],
  },
  {
    title: 'Informasi',
    links: [
      { label: 'Pengumuman', path: '/pengumuman' },
      { label: 'Artikel',    path: '/artikel' },
      { label: 'Kegiatan',   path: '/kegiatan' },
      { label: 'Galeri',     path: '/galeri' },
    ],
  },
  {
    title: 'Layanan',
    links: [
      { label: 'Kirim Aspirasi', path: '/aspirasi' },
      { label: 'Kontak Kami',    path: '/kontak' },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary-600 text-white">
      {/* Gelombang atas */}
      <div className="text-gray-50">
        <svg viewBox="0 0 1440 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 0L1440 0L1440 20C1200 60 960 0 720 30C480 60 240 0 0 30L0 0Z"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">

          {/* ─── Identitas ─── */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white rounded-xl p-1 flex items-center justify-center">
                <img src={siteConfig.logo} alt="Logo DEMA" className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="font-bold text-white">{siteConfig.demaName}</p>
                <p className="text-xs text-white/60">{siteConfig.campusName}</p>
              </div>
            </div>

            {/* Ayat */}
            <p className="font-arabic text-xl text-gold-400 mb-1 leading-relaxed">
              {siteConfig.heroAyat}
            </p>
            <p className="text-white/60 text-xs italic mb-4">
              "{siteConfig.heroAyatTrans}" — {siteConfig.heroAyatSource}
            </p>

            {/* Kontak */}
            <div className="space-y-1.5 text-sm text-white/70">
              <p><FaMapMarkerAlt className="w-4 h-4 inline mr-2" /> {siteConfig.address}</p>
              <p><FaEnvelope className="w-4 h-4 inline mr-2" /> {siteConfig.email}</p>
              {siteConfig.whatsapp && (
                <a
                  href={waLink(siteConfig.whatsapp)}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"
                >
                  <FaWhatsapp className="w-5 h-5" /> Hubungi via WhatsApp
                </a>
              )}
            </div>

            {/* Media sosial */}
            <div className="flex gap-3 mt-4">
              {siteConfig.staggeredMenu.socialItems.map((s, i) => {
                let Icon = null;
                const label = s.label.toLowerCase();
                if (label.includes('instagram')) Icon = FaInstagram;
                else if (label.includes('youtube')) Icon = FaYoutube;
                else if (label.includes('tiktok')) Icon = FaTiktok;
                else if (label.includes('whatsapp')) Icon = FaWhatsapp;
                
                return (
                  <a
                    key={i}
                    href={s.link}
                    target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-lg"
                    aria-label={s.label}
                  >
                    {Icon ? <Icon className="w-5 h-5" /> : <span>{s.label.split(' ')[0]}</span>}
                  </a>
                );
              })}
            </div>
          </div>

          {/* ─── Link navigasi ─── */}
          {FOOTER_LINKS.map(col => (
            <div key={col.title}>
              <h4 className="font-semibold text-white mb-3 text-sm">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(l => (
                  <li key={l.path}>
                    <Link
                      to={l.path}
                      className="text-white/60 hover:text-white text-sm transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row
                        items-center justify-between gap-2 text-xs text-white/40">
          <p>{siteConfig.footerText}</p>
          <p>Periode {siteConfig.periodYear}</p>
        </div>
      </div>
    </footer>
  );
}
