/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║              KONFIGURASI UTAMA WEBSITE DEMA                         ║
 * ║  Ubah nilai di sini untuk memperbarui seluruh website               ║
 * ║  tanpa perlu menyentuh kode komponen.                               ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

export const siteConfig = {

  // ════════════════════════════════════════════════════════════════════
  // 1. IDENTITAS ORGANISASI
  // ════════════════════════════════════════════════════════════════════

  campusName:  "STAI At-Tahdzib Jombang",
  demaName:    "DEMA STAI At-Tahdzib",
  shortName:   "DEMA STAI At-Tahdzib",
  logo:        "/logo/logo_dema_126.webp",   // path relatif dari folder /public
  logoText:    "DEMA",
  periodYear:  "2024/2025",

  // ════════════════════════════════════════════════════════════════════
  // 2. WARNA BRAND
  // ════════════════════════════════════════════════════════════════════

  primaryColor:   "#165c3d",   // hijau tua — warna utama
  secondaryColor: "#52b788",   // hijau muda — warna pendukung
  accentColor:    "#d4a017",   // emas — warna aksen / highlight

  // ════════════════════════════════════════════════════════════════════
  // 3. KONTAK
  // ════════════════════════════════════════════════════════════════════

  address:   "Jl. Pesantren At-Tahdzib, Rejoagung, Ngoro, Jombang, Jawa Timur",
  email:     "dema@stai-attahdzib.ac.id",
  phone:     "+62 xxx-xxxx-xxxx",

  // ════════════════════════════════════════════════════════════════════
  // 4. SOSIAL MEDIA
  // ════════════════════════════════════════════════════════════════════

  instagram: "demaattahdzib",
  youtube:   "pesantrenattahdzib",
  tiktok:    "demaattahdzib",
  whatsapp:  "6285xxxxxxxxx",   // format internasional tanpa "+"

  // ════════════════════════════════════════════════════════════════════
  // 5. KONTEN HERO (halaman beranda)
  // ════════════════════════════════════════════════════════════════════

  heroTitle:      "Dewan Eksekutif Mahasiswa",
  heroSubtitle:   "Berkhidmat untuk Mahasiswa, Berjuang untuk Umat",
  heroAyat:       "وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ",
  heroAyatTrans:  "Dan tolong-menolonglah kamu dalam kebajikan dan takwa",
  heroAyatSource: "QS. Al-Maidah: 2",

  // ════════════════════════════════════════════════════════════════════
  // 6. VISI & MISI
  // ════════════════════════════════════════════════════════════════════

  visi: "Mewujudkan mahasiswa yang berilmu, berakhlak mulia, dan berkontribusi nyata bagi masyarakat berdasarkan nilai-nilai Islam.",
  misi: [
    "Menyelenggarakan kegiatan akademik dan non-akademik yang berkualitas",
    "Membangun karakter mahasiswa yang Islami dan profesional",
    "Menjadi jembatan aspirasi mahasiswa kepada pihak kampus",
    "Mempererat ukhuwah islamiyah antar mahasiswa",
    "Mengembangkan potensi mahasiswa di bidang seni, budaya, dan olahraga",
  ],

  // ════════════════════════════════════════════════════════════════════
  // 7. FOOTER
  // ════════════════════════════════════════════════════════════════════

  footerText: "© 2025 DEMA STAI At-Tahdzib Jombang. Amanah, Profesional, Islami.",

  // ════════════════════════════════════════════════════════════════════
  // 8. NAVIGASI UTAMA (Desktop)
  // ════════════════════════════════════════════════════════════════════

  navItems: [
    { label: 'Beranda',      path: '/' },
    { label: 'Tentang',      path: '/tentang' },
    { label: 'Struktur Org', path: '/struktur' },
    { label: 'Program Kerja',path: '/program-kerja' },
    {
      label: 'Informasi',
      children: [
        { label: '📢 Pengumuman', path: '/pengumuman' },
        { label: '📰 Artikel',   path: '/artikel' },
        { label: '📅 Kegiatan',  path: '/kegiatan' },
      ],
    },
    { label: 'Galeri',   path: '/galeri' },
    { label: 'Kontak',   path: '/kontak' },
  ],

  // ════════════════════════════════════════════════════════════════════
  // 9. STAGGERED MENU — Navigasi Mobile (kanan layar)
  //    Semua pengaturan komponen bisa diubah dari sini.
  // ════════════════════════════════════════════════════════════════════

  staggeredMenu: {

    // ── Posisi panel ─────────────────────────────────────────────────
    // "right" → panel muncul dari KANAN (default, cocok untuk mobile)
    // "left"  → panel muncul dari KIRI
    position: "left",

    // ── Logo di dalam panel ──────────────────────────────────────────
    // Isi path logo, atau kosongkan "" untuk menyembunyikan logo
    logoUrl: "/logo/logo_dema_126.webp",

    // ── Ukuran & tampilan panel ──────────────────────────────────────
    panelWidth:      "clamp(260px, 88vw, 380px)",  // lebar panel (CSS valid)
    panelBackground: "#ffffff",                     // warna latar panel

    // ── Ukuran font item menu ────────────────────────────────────────
    // Gunakan clamp() agar menyesuaikan ukuran layar secara otomatis
    itemFontSize: "clamp(1.8rem, 8vw, 2.8rem)",

    // ── Warna tombol toggle (navbar) ─────────────────────────────────
    menuButtonColor:     "#165c3d",  // warna saat menu TERTUTUP
    openMenuButtonColor: "#d4a017",  // warna saat menu TERBUKA
    changeMenuColorOnOpen: true,     // aktifkan animasi perubahan warna

    // ── Warna aksen ──────────────────────────────────────────────────
    // Dipakai untuk: hover item, judul sosial, penomoran, tombol CTA
    accentColor: "#165c3d",

    // ── Warna layer animasi staggered ────────────────────────────────
    // 2–4 warna. Urutan: warna pertama muncul paling awal.
    colors: ["#165c3d", "#52b788"],

    // ── Fitur tampilan ───────────────────────────────────────────────
    displaySocials:       true,              // tampilkan bagian sosial media
    displayItemNumbering: true,              // tampilkan nomor urut item
    socialsTitle:         "Sosial Media",   // judul bagian sosial media

    // ── Tombol CTA di bawah panel ────────────────────────────────────
    showCtaButton: true,
    ctaLabel:      "💬 Kirim Aspirasi",
    ctaLink:       "/aspirasi",

    // ── Perilaku ─────────────────────────────────────────────────────
    closeOnClickAway: true,   // tutup panel saat klik di luar area panel

    // ── Daftar item navigasi ─────────────────────────────────────────
    items: [
      { label: "Beranda",    ariaLabel: "Kembali ke beranda",        link: "/"             },
      { label: "Tentang",    ariaLabel: "Pelajari tentang DEMA",     link: "/tentang"      },
      { label: "Struktur",   ariaLabel: "Lihat struktur organisasi", link: "/struktur"     },
      { label: "Program",    ariaLabel: "Lihat program kerja",       link: "/program-kerja"},
      { label: "Pengumuman", ariaLabel: "Lihat pengumuman terbaru",  link: "/pengumuman"   },
      { label: "Artikel",    ariaLabel: "Baca artikel",              link: "/artikel"      },
      { label: "Kegiatan",   ariaLabel: "Lihat kegiatan",            link: "/kegiatan"     },
      { label: "Galeri",     ariaLabel: "Lihat galeri foto",         link: "/galeri"       },
      { label: "Kontak",     ariaLabel: "Hubungi kami",              link: "/kontak"       },
    ],

    // ── Tautan sosial media ──────────────────────────────────────────
    socialItems: [
      { label: "📱 Instagram", link: "https://instagram.com/demaattahdzib"         },
      { label: "📺 YouTube",   link: "https://youtube.com/pesantrenattahdzib"       },
      { label: "💬 WhatsApp",  link: "https://wa.me/6285xxxxxxxxx"                  },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // 9. BORDER GLOW — Efek kartu struktur organisasi
  // ════════════════════════════════════════════════════════════════════

  borderGlow: {
    variants: {

      // Variant default — semua anggota biasa
      default: {
        edgeSensitivity: 45,
        glowColor:       "132 68 32",   // format: "R G B" (0–255)
        backgroundColor: "#ffffff",
        borderRadius:    12,
        glowRadius:      20,
        glowIntensity:   0.5,
        coneSpread:      20,
        animated:        false,
        colors:          ["#165c3d", "#52b788", "#d4a017"],
        fillOpacity:     0.1,
      },

      // Variant BPH (Badan Pengurus Harian) — lebih intens
      bph: {
        edgeSensitivity: 40,
        glowColor:       "43 74 66",
        backgroundColor: "#ffffff",
        borderRadius:    12,
        glowRadius:      30,
        glowIntensity:   0.65,
        coneSpread:      22,
        animated:        true,
        colors:          ["#d4a017", "#165c3d", "#52b788"],
        fillOpacity:     0.25,
      },

      // Variant divisi — lebih halus
      division: {
        edgeSensitivity: 50,
        glowColor:       "150 84 45",
        backgroundColor: "#ffffff",
        borderRadius:    12,
        glowRadius:      18,
        glowIntensity:   0.45,
        coneSpread:      18,
        animated:        false,
        colors:          ["#52b788", "#165c3d", "#d4a017"],
        fillOpacity:     0.15,
      },
    },
  },
};
