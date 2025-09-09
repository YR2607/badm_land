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
  }
})
