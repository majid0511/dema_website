/**
 * StaggeredMenu – React Bits component (JavaScript + Tailwind variant)
 * Semua tampilan dikontrol lewat props yang bersumber dari siteConfig.staggeredMenu.
 * Dependency: gsap (sudah terinstall)
 */
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

export const StaggeredMenu = ({
  // ── Posisi & ukuran ────────────────────────────────────────────────
  position       = 'right',
  panelWidth     = 'clamp(260px, 88vw, 380px)',
  panelBackground = '#ffffff',
  itemFontSize   = 'clamp(1.8rem, 8vw, 2.8rem)',

  // ── Warna layer & aksen ────────────────────────────────────────────
  colors         = ['#165c3d', '#52b788'],
  accentColor    = '#165c3d',

  // ── Tombol toggle ──────────────────────────────────────────────────
  menuButtonColor    = '#165c3d',
  openMenuButtonColor = '#d4a017',
  changeMenuColorOnOpen = true,

  // ── Logo di dalam panel ────────────────────────────────────────────
  logoUrl,
  logoText,

  // ── Item navigasi & sosial ─────────────────────────────────────────
  items       = [],
  socialItems = [],
  displaySocials        = true,
  displayItemNumbering  = true,
  socialsTitle          = 'Sosial Media',

  // ── Tombol CTA ─────────────────────────────────────────────────────
  showCtaButton = true,
  ctaLabel      = '💬 Kirim Aspirasi',
  ctaLink       = '/aspirasi',

  // ── Perilaku ───────────────────────────────────────────────────────
  closeOnClickAway = true,
  className,

  // ── Callbacks ──────────────────────────────────────────────────────
  onMenuOpen,
  onMenuClose,
}) => {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const location = useLocation();

  const panelRef       = useRef(null);
  const preLayersRef   = useRef(null);
  const preLayerElsRef = useRef([]);

  const plusHRef   = useRef(null);
  const plusVRef   = useRef(null);
  const iconRef    = useRef(null);

  const textInnerRef = useRef(null);
  const textWrapRef  = useRef(null);
  const [textLines, setTextLines] = useState(['Menu', 'Close']);

  const openTlRef          = useRef(null);
  const closeTweenRef      = useRef(null);
  const spinTweenRef       = useRef(null);
  const textCycleAnimRef   = useRef(null);
  const colorTweenRef      = useRef(null);
  const toggleBtnRef       = useRef(null);
  const busyRef            = useRef(false);
  const itemEntranceTweenRef = useRef(null);

  /* ── Tutup saat route berubah ── */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    if (openRef.current) {
      openRef.current = false;
      setOpen(false);
      playClose();
      animateIcon(false);
      animateColor(false);
      animateText(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  /* ── Inisialisasi GSAP ──
   * useLayoutEffect: set transform awal sebelum browser paint
   * agar tidak ada kilatan posisi default (FOUC animasi).
   * Semua operasi hanya WRITE (gsap.set), tidak ada READ layout → aman.
   */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel      = panelRef.current;
      const preContainer = preLayersRef.current;
      const plusH      = plusHRef.current;
      const plusV      = plusVRef.current;
      const icon       = iconRef.current;
      const textInner  = textInnerRef.current;

      if (!panel || !plusH || !plusV || !icon || !textInner) return;

      let preLayers = [];
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer'));
      }
      preLayerElsRef.current = preLayers;

      const offscreen = position === 'left' ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen, opacity: 1 });
      if (preContainer) gsap.set(preContainer, { xPercent: 0, opacity: 1 });

      gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
      gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
      gsap.set(icon,  { rotate: 0, transformOrigin: '50% 50%' });
      gsap.set(textInner, { yPercent: 0 });

      if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });
    return () => ctx.revert();
  }, [menuButtonColor, position]);

  /* ── Build open timeline ── */
  const buildOpenTimeline = useCallback(() => {
    const panel  = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) { closeTweenRef.current.kill(); closeTweenRef.current = null; }
    itemEntranceTweenRef.current?.kill();

    /* ── BATCH READ — semua DOM query dilakukan sebelum write apapun ──
     * Ini mencegah forced reflow (browser tidak dipaksa hitung ulang
     * layout di tengah-tengah urutan baca-tulis yang campur aduk).
     */
    const itemEls     = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
    const numberEls   = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
    const socialTitle = panel.querySelector('.sm-socials-title');
    const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));
    const offscreen   = position === 'left' ? -100 : 100;
    const layerStates = layers.map(el => ({ el, start: offscreen }));
    const panelStart  = offscreen;

    /* ── BATCH WRITE — semua gsap.set setelah semua read selesai ── */
    if (itemEls.length)     gsap.set(itemEls,     { yPercent: 140, rotate: 10 });
    if (numberEls.length)   gsap.set(numberEls,   { '--sm-num-opacity': 0 });
    if (socialTitle)        gsap.set(socialTitle,  { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks,  { y: 25, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, i) => {
      tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
    });

    const lastTime       = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration  = 0.65;

    tl.fromTo(panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
      panelInsertTime
    );

    if (itemEls.length) {
      const itemsStart = panelInsertTime + panelDuration * 0.15;
      tl.to(itemEls,
        { yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out', stagger: { each: 0.1, from: 'start' } },
        itemsStart
      );
      if (numberEls.length) {
        tl.to(numberEls,
          { duration: 0.6, ease: 'power2.out', '--sm-num-opacity': 1, stagger: { each: 0.08, from: 'start' } },
          itemsStart + 0.1
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;
      if (socialTitle) tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart);
      if (socialLinks.length) {
        tl.to(socialLinks, {
          y: 0, opacity: 1, duration: 0.55, ease: 'power3.out',
          stagger: { each: 0.08, from: 'start' },
          onComplete: () => gsap.set(socialLinks, { clearProps: 'opacity' }),
        }, socialsStart + 0.04);
      }
    }

    openTlRef.current = tl;
    return tl;
  }, [position]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback('onComplete', () => { busyRef.current = false; });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;
    itemEntranceTweenRef.current?.kill();

    const panel  = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const all = [...layers, panel];
    closeTweenRef.current?.kill();

    const offscreen = position === 'left' ? -100 : 100;

    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: 'power3.in',
      overwrite: 'auto',
      onComplete: () => {
        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });

        const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
        if (numberEls.length) gsap.set(numberEls, { '--sm-num-opacity': 0 });

        const socialTitle  = panel.querySelector('.sm-socials-title');
        const socialLinks  = Array.from(panel.querySelectorAll('.sm-socials-link'));
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

        busyRef.current = false;
      },
    });
  }, [position]);

  const animateIcon = useCallback(opening => {
    const icon = iconRef.current;
    const h    = plusHRef.current;
    const v    = plusVRef.current;
    if (!icon || !h || !v) return;

    spinTweenRef.current?.kill();

    if (opening) {
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
      spinTweenRef.current = gsap.timeline({ defaults: { ease: 'power4.out' } })
        .to(h, { rotate: 45,  duration: 0.5 }, 0)
        .to(v, { rotate: -45, duration: 0.5 }, 0);
    } else {
      spinTweenRef.current = gsap.timeline({ defaults: { ease: 'power3.inOut' } })
        .to(h,    { rotate: 0, duration: 0.35 }, 0)
        .to(v,    { rotate: 90, duration: 0.35 }, 0)
        .to(icon, { rotate: 0, duration: 0.001 }, 0);
    }
  }, []);

  const animateColor = useCallback(opening => {
    const btn = toggleBtnRef.current;
    if (!btn) return;
    colorTweenRef.current?.kill();
    if (changeMenuColorOnOpen) {
      const targetColor = opening ? openMenuButtonColor : menuButtonColor;
      colorTweenRef.current = gsap.to(btn, { color: targetColor, delay: 0.18, duration: 0.3, ease: 'power2.out' });
    } else {
      gsap.set(btn, { color: menuButtonColor });
    }
  }, [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]);

  React.useEffect(() => {
    if (toggleBtnRef.current) {
      const targetColor = (changeMenuColorOnOpen && openRef.current) ? openMenuButtonColor : menuButtonColor;
      gsap.set(toggleBtnRef.current, { color: targetColor });
    }
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);

  const animateText = useCallback(opening => {
    const inner = textInnerRef.current;
    if (!inner) return;
    textCycleAnimRef.current?.kill();

    const currentLabel = opening ? 'Menu' : 'Close';
    const targetLabel  = opening ? 'Close' : 'Menu';
    const cycles = 3;
    const seq = [currentLabel];
    let last = currentLabel;
    for (let i = 0; i < cycles; i++) {
      last = last === 'Menu' ? 'Close' : 'Menu';
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);

    setTextLines(seq);
    gsap.set(inner, { yPercent: 0 });

    const lineCount  = seq.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;
    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: 'power4.out',
    });
  }, []);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);

    if (target) { onMenuOpen?.(); playOpen(); }
    else         { onMenuClose?.(); playClose(); }

    animateIcon(target);
    animateColor(target);
    animateText(target);
  }, [playOpen, playClose, animateIcon, animateColor, animateText, onMenuOpen, onMenuClose]);

  const closeMenu = useCallback(() => {
    if (openRef.current) {
      openRef.current = false;
      setOpen(false);
      onMenuClose?.();
      playClose();
      animateIcon(false);
      animateColor(false);
      animateText(false);
    }
  }, [playClose, animateIcon, animateColor, animateText, onMenuClose]);

  React.useEffect(() => {
    if (!closeOnClickAway || !open) return;
    const handleClickOutside = event => {
      if (
        panelRef.current    && !panelRef.current.contains(event.target) &&
        toggleBtnRef.current && !toggleBtnRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeOnClickAway, open, closeMenu]);

  /* ─────────────────────────────── render ─────────────────────────────── */
  return (
    <div className="sm-scope z-40 w-full h-full">
      <div
        className={(className ? className + ' ' : '') + 'staggered-menu-wrapper pointer-events-none relative w-full h-full'}
        style={{ '--sm-accent': accentColor, '--sm-panel-width': panelWidth }}
        data-position={position}
        data-open={open || undefined}
      >

        {/* ── Staggered underlay layers ── */}
        <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
          {(() => {
            const raw = colors?.length ? colors.slice(0, 4) : ['#165c3d', '#52b788'];
            let arr = [...raw];
            if (arr.length >= 3) arr.splice(Math.floor(arr.length / 2), 1);
            return arr.map((c, i) => (
              <div key={i} className="sm-prelayer" style={{ background: c }} />
            ));
          })()}
        </div>

        {/* ── Toggle button ── */}
        <button
          ref={toggleBtnRef}
          className="sm-toggle pointer-events-auto"
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={open}
          aria-controls="staggered-menu-panel"
          onClick={toggleMenu}
          type="button"
        >
          <span ref={textWrapRef} className="sm-toggle-textWrap" aria-hidden="true">
            <span ref={textInnerRef} className="sm-toggle-textInner">
              {textLines.map((l, i) => (
                <span className="sm-toggle-line" key={i}>{l}</span>
              ))}
            </span>
          </span>
          <span ref={iconRef} className="sm-icon" aria-hidden="true">
            <span ref={plusHRef} className="sm-icon-line" />
            <span ref={plusVRef} className="sm-icon-line" />
          </span>
        </button>

        {/* ── Slide panel ── */}
        <aside
          id="staggered-menu-panel"
          ref={panelRef}
          className="sm-panel pointer-events-auto"
          style={{ background: panelBackground }}
          inert={!open ? '' : undefined}
          aria-label="Menu navigasi"
        >
          {/* Logo */}
          {(logoUrl || logoText) && (
            <div className="sm-panel-logo gap-3">
              {logoUrl && <img src={logoUrl} alt="Logo" className="sm-panel-logo-img" draggable={false} />}
              {logoText && <span className="font-bold text-gray-800 text-lg leading-tight">{logoText}</span>}
            </div>
          )}

          <div className="sm-panel-inner">
            {/* Nav items */}
            <ul
              className="sm-panel-list"
              role="list"
              data-numbering={displayItemNumbering || undefined}
              style={{ '--sm-item-font-size': itemFontSize }}
            >
              {items?.length ? items.map((it, idx) => (
                <li className="sm-panel-itemWrap" key={it.label + idx}>
                  <Link
                    className="sm-panel-item"
                    to={it.link}
                    aria-label={it.ariaLabel}
                    data-index={idx + 1}
                  >
                    <span className="sm-panel-itemLabel">{it.label}</span>
                  </Link>
                </li>
              )) : (
                <li className="sm-panel-itemWrap" aria-hidden="true">
                  <span className="sm-panel-item sm-panel-item--empty">
                    <span className="sm-panel-itemLabel">No items</span>
                  </span>
                </li>
              )}
            </ul>

            {/* Sosial media */}
            {displaySocials && socialItems?.length > 0 && (
              <div className="sm-socials" aria-label="Tautan sosial">
                <h3 className="sm-socials-title">{socialsTitle}</h3>
                <ul className="sm-socials-list" role="list">
                  {socialItems.map((s, i) => (
                    <li key={s.label + i} className="sm-socials-item">
                      <a
                        href={s.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sm-socials-link"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA button */}
            {showCtaButton && (
              <div className="sm-cta">
                <Link
                  to={ctaLink}
                  className="sm-cta-btn"
                  style={{ background: accentColor }}
                >
                  {ctaLabel}
                </Link>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ── Scoped styles ── */}
      <style>{`
/* ── Scope & wrapper ── */
.sm-scope { position: relative; }
.sm-scope .staggered-menu-wrapper { position: relative; width: 100%; height: 100%; z-index: 40; pointer-events: none; }

/* ── Underlay layers ── */
.sm-scope .sm-prelayers {
  position: fixed;
  top: 0; right: 0; bottom: 0;
  width: var(--sm-panel-width, clamp(260px, 88vw, 380px));
  pointer-events: none;
  z-index: 44;
}
.sm-scope [data-position="left"] .sm-prelayers { right: auto; left: 0; }
.sm-scope .sm-prelayer { position: absolute; top: 0; right: 0; height: 100%; width: 100%; }

/* ── Toggle button ── */
.sm-scope .sm-toggle {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: transparent;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.8rem;
  line-height: 1;
  letter-spacing: 0.02em;
  overflow: visible;
  pointer-events: auto;
  z-index: 50;
  padding: 0.5rem 0.25rem;
}
.sm-scope .sm-toggle:focus-visible { outline: 2px solid currentColor; outline-offset: 4px; border-radius: 4px; }

.sm-scope .sm-toggle-textWrap {
  position: relative;
  display: inline-block;
  height: 1em;
  overflow: hidden;
  white-space: nowrap;
}
.sm-scope .sm-toggle-textInner { display: flex; flex-direction: column; line-height: 1; }
.sm-scope .sm-toggle-line { display: block; height: 1em; line-height: 1; }

/* ── Plus/X icon ── */
.sm-scope .sm-icon {
  position: relative;
  width: 13px; height: 13px;
  flex: 0 0 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  will-change: transform;
}
.sm-scope .sm-icon-line {
  position: absolute;
  left: 50%; top: 50%;
  width: 100%; height: 2px;
  background: currentColor;
  border-radius: 2px;
  transform: translate(-50%, -50%);
  will-change: transform;
}

/* ── Panel ── */
.sm-scope .sm-panel {
  position: fixed;
  top: 0; right: 0;
  width: var(--sm-panel-width, clamp(260px, 88vw, 380px));
  height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  z-index: 45;
}
.sm-scope [data-position="left"] .sm-panel { right: auto; left: 0; }

.sm-scope .sm-panel-logo {
  display: flex;
  align-items: center;
  padding: 1.5rem 1.5rem 0.5rem;
  user-select: none;
}
.sm-scope .sm-panel-logo-img { display: block; height: 65px; width: auto; object-fit: contain; }

.sm-scope .sm-panel-inner {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 4rem 1.5rem 2rem;
}

/* ── Nav items ── */
.sm-scope .sm-panel-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0; counter-reset: smItem; }
.sm-scope .sm-panel-itemWrap { position: relative; overflow: hidden; line-height: 1; }
.sm-scope .sm-panel-item {
  position: relative;
  font-weight: 800;
  font-size: var(--sm-item-font-size, clamp(1.8rem, 8vw, 2.8rem));
  line-height: 1.1;
  letter-spacing: -1px;
  text-transform: uppercase;
  text-decoration: none;
  color: #111;
  display: inline-block;
  padding-right: 1.6em;
  transition: color 0.2s ease;
  cursor: pointer;
}
.sm-scope .sm-panel-item:hover { color: var(--sm-accent, #165c3d); }
.sm-scope .sm-panel-itemLabel {
  display: inline-block;
  will-change: transform;
  transform-origin: 50% 100%;
}

/* Numbering */
.sm-scope .sm-panel-list[data-numbering] { counter-reset: smItem; }
.sm-scope .sm-panel-list[data-numbering] .sm-panel-item::after {
  counter-increment: smItem;
  content: counter(smItem, decimal-leading-zero);
  position: absolute;
  top: 0.1em;
  right: 0.3em;
  font-size: 12px;
  font-weight: 400;
  color: var(--sm-accent, #165c3d);
  letter-spacing: 0;
  pointer-events: none;
  user-select: none;
  opacity: var(--sm-num-opacity, 0);
}

/* ── Sosial media ── */
.sm-scope .sm-socials { margin-top: auto; padding-top: 1.5rem; display: flex; flex-direction: column; gap: 0.6rem; }
.sm-scope .sm-socials-title {
  margin: 0;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--sm-accent, #165c3d);
}
.sm-scope .sm-socials-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: row; align-items: center; gap: 0.85rem; flex-wrap: wrap; }
.sm-scope .sm-socials-list:hover .sm-socials-link:not(:hover) { opacity: 0.35; }
.sm-scope .sm-socials-link {
  font-size: 0.9rem;
  font-weight: 500;
  color: #111;
  text-decoration: none;
  display: inline-block;
  padding: 2px 0;
  transition: color 0.25s ease, opacity 0.25s ease;
  opacity: 1;
}
.sm-scope .sm-socials-link:hover { color: var(--sm-accent, #165c3d); }

/* ── CTA button ── */
.sm-scope .sm-cta { padding-top: 0.75rem; }
.sm-scope .sm-cta-btn {
  display: block;
  width: 100%;
  text-align: center;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  text-decoration: none;
  transition: opacity 0.2s ease;
}
.sm-scope .sm-cta-btn:hover { opacity: 0.88; }
      `}</style>
    </div>
  );
};

export default StaggeredMenu;
