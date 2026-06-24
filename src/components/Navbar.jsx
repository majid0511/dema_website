/**
 * Navigasi utama website.
 * Responsive: StaggeredMenu di mobile, full menu di desktop.
 * Sticky dengan shadow saat scroll.
 */
import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '../config/siteConfig';
import { HiChevronDown } from 'react-icons/hi';
import StaggeredMenu from './StaggeredMenu';
import NotificationBell from './NotificationBell';
import AnnouncementTicker from './AnnouncementTicker';
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  const { pathname }            = useLocation();

  // Tutup dropdown saat navigasi
  useEffect(() => { setDropdown(null); }, [pathname]);

  // Shadow saat scroll
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    if (!dropdown) return;
    const fn = () => setDropdown(null);
    document.addEventListener('click', fn);
    return () => document.removeEventListener('click', fn);
  }, [dropdown]);

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? 'text-primary-600 bg-primary-50 font-medium'
        : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
    }`;

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-shadow duration-300 ${
        scrolled ? 'shadow-md bg-white/90 backdrop-blur-md' : 'bg-white border-b border-gray-100'
      }`}
      aria-label="Navigasi utama"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">

          {/* ─── Logo ─── */}
          <Link to="/" className="flex items-center gap-3 group" aria-label="Beranda">
          <img
          src={siteConfig.logo}
          alt="Logo DEMA"
          className="w-12 h-12 lg:w-16 lg:h-16 object-contain"
          />

  <div className="leading-tight">
    <p className="font-bold text-gray-800 text-sm">
      {siteConfig.demaName}
    </p>
    <p className="hidden sm:block text-[11px] text-gray-400 truncate max-w-[170px]">
      {siteConfig.campusName}
    </p>
  </div>
</Link>

          {/* ─── Menu desktop ─── */}
          <div className="hidden lg:flex items-center gap-0.5">
            {siteConfig.navItems.map(item =>
              item.children ? (
                <div key={item.label} className="relative" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => setDropdown(dropdown === item.label ? null : item.label)}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-gray-600
                               hover:text-primary-600 hover:bg-primary-50 transition-all"
                    aria-expanded={dropdown === item.label}
                  >
                    {item.label}
                    <HiChevronDown className={`w-4 h-4 transition-transform ${dropdown === item.label ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {dropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg
                                   border border-gray-100 py-2 min-w-[180px] z-50"
                      >
                        {item.children.map(c => (
                          <NavLink
                            key={c.path} to={c.path}
                            className={({ isActive }) =>
                              `block px-4 py-2.5 text-sm transition-colors ${
                                isActive ? 'text-primary-600 bg-primary-50' : 'text-gray-600 hover:bg-gray-100'
                              }`
                            }
                          >
                            {c.label}
                          </NavLink>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <NavLink key={item.path} to={item.path} className={navLinkClass}>
                  {item.label}
                </NavLink>
              )
            )}
          </div>

          {/* ─── CTA + Notif + StaggeredMenu (mobile) ─── */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-2">
              <NotificationBell />
            </div>
            <Link
              to="/aspirasi"
              className="hidden lg:inline-flex items-center gap-1.5 bg-primary-500 text-white
                         text-sm px-4 py-2 rounded-xl hover:bg-primary-600 transition-colors
                         font-medium shadow-sm"
            >
              💬 Kirim Aspirasi
            </Link>

            {/* StaggeredMenu — mobile only */}
            <div className="flex lg:hidden relative items-center h-10">
              <StaggeredMenu
                position={siteConfig.staggeredMenu.position}
                colors={siteConfig.staggeredMenu.colors}
                panelWidth={siteConfig.staggeredMenu.panelWidth}
                panelBackground={siteConfig.staggeredMenu.panelBackground}
                itemFontSize={siteConfig.staggeredMenu.itemFontSize}
                items={siteConfig.staggeredMenu.items}
                socialItems={siteConfig.staggeredMenu.socialItems}
                displaySocials={siteConfig.staggeredMenu.displaySocials}
                displayItemNumbering={siteConfig.staggeredMenu.displayItemNumbering}
                socialsTitle={siteConfig.staggeredMenu.socialsTitle}
                showCtaButton={siteConfig.staggeredMenu.showCtaButton}
                ctaLabel={siteConfig.staggeredMenu.ctaLabel}
                ctaLink={siteConfig.staggeredMenu.ctaLink}
                menuButtonColor={siteConfig.staggeredMenu.menuButtonColor}
                openMenuButtonColor={siteConfig.staggeredMenu.openMenuButtonColor}
                changeMenuColorOnOpen={siteConfig.staggeredMenu.changeMenuColorOnOpen}
                closeOnClickAway={siteConfig.staggeredMenu.closeOnClickAway}
                accentColor={siteConfig.staggeredMenu.accentColor}
                logoUrl={siteConfig.staggeredMenu.logoUrl}
                logoText={siteConfig.shortName}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile nav is handled by StaggeredMenu (fixed overlay panel) */}
      <AnnouncementTicker />
    </nav>
  );
}