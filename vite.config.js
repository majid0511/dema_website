import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Plugin kustom: ubah <link rel="stylesheet"> untuk CSS bundle
 * menjadi non-blocking (preload + onload swap), mirip teknik Google Fonts.
 * Hasilnya: CSS diunduh paralel, tidak memblokir render HTML awal.
 */
function nonBlockingCssPlugin() {
  return {
    name: 'non-blocking-css',
    transformIndexHtml(html) {
      // Tangkap semua <link rel="stylesheet" href="/assets/...css">
      return html.replace(
        /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/g,
        (_, href) =>
          // 1. Preload (tidak memblokir render)
          `<link rel="preload" as="style" href="${href}" onload="this.onload=null;this.rel='stylesheet'">` +
          // 2. Fallback tanpa JS
          `<noscript><link rel="stylesheet" href="${href}"></noscript>`
      )
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    nonBlockingCssPlugin(),
  ],

  resolve: {
    alias: { '@': '/src' },
  },

  build: {
    // Pisahkan vendor chunks agar perubahan app tidak invalidate cache library besar
    rollupOptions: {
      output: {
        manualChunks(id) {
          // GSAP — jarang berubah, cache terpisah
          if (id.includes('gsap')) return 'vendor-gsap'
          // Framer Motion
          if (id.includes('framer-motion')) return 'vendor-framer'
          // Firebase — bundle besar, pisah sendiri
          if (id.includes('firebase')) return 'vendor-firebase'
          // React ecosystem
          if (id.includes('node_modules/react') ||
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/react-router')) return 'vendor-react'
        },
      },
    },

    // Batasi peringatan ukuran chunk (default 500 KiB)
    chunkSizeWarningLimit: 600,
  },
})
