import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'

// Dev-only middleware to rewrite Studio asset paths
const studioRewrite = (): Plugin => ({
  name: 'studio-rewrite',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url?.startsWith('/static/')) {
        req.url = '/admin' + req.url
      } else if (req.url?.startsWith('/vendor/')) {
        req.url = '/admin' + req.url
      }
      next()
    })
  },
})

export default defineConfig({
  plugins: [react(), studioRewrite()],
  server: {
    port: 3000,
    open: true,
    // Rewrite Studio static paths in dev to match vercel.json
    middlewareMode: false,
    hmr: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Разделяем vendor библиотеки
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'i18n-vendor': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          'animation-vendor': ['framer-motion'],
          'sanity-vendor': ['@sanity/client', 'groq'],
        },
      },
    },
    // Увеличиваем лимит для предупреждений (временно)
    chunkSizeWarningLimit: 600,
  },
})
