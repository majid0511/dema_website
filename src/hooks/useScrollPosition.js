/**
 * useScrollPosition — hook untuk melacak posisi scroll halaman.
 *
 * Digunakan oleh:
 * - Navbar: tambah shadow saat scrollY > 10
 * - ScrollToTop button: tampilkan saat scrollY > 400
 * - Animasi section: trigger saat elemen masuk viewport
 *
 * Contoh pemakaian:
 *   const { scrollY, scrollDirection, isAtTop } = useScrollPosition();
 *
 *   // Tampilkan shadow navbar
 *   <nav className={scrollY > 10 ? 'shadow-md' : ''}>
 *
 *   // Sembunyikan navbar saat scroll ke bawah
 *   <nav className={scrollDirection === 'down' ? '-translate-y-full' : 'translate-y-0'}>
 */
import { useState, useEffect } from 'react';

export function useScrollPosition(threshold = 10) {
  const [scrollY,         setScrollY]         = useState(0);
  const [scrollDirection, setScrollDirection] = useState('up');
  const [lastScrollY,     setLastScrollY]     = useState(0);

  useEffect(() => {
    let ticking = false; // Throttle dengan requestAnimationFrame

    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const current = window.scrollY;

          // Deteksi arah scroll
          if (current > lastScrollY + 5) {
            setScrollDirection('down');
          } else if (current < lastScrollY - 5) {
            setScrollDirection('up');
          }

          setScrollY(current);
          setLastScrollY(current);
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastScrollY]);

  return {
    scrollY,
    scrollDirection,
    isAtTop:      scrollY < threshold,     // true jika di paling atas
    isScrolled:   scrollY >= threshold,    // true jika sudah scroll
    showScrollTop: scrollY > 400,          // true jika tombol back-to-top perlu tampil
  };
}
