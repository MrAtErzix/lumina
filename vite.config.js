import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.VITE_BASE || '/',
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        configure(proxy) {
          proxy.on('proxyReq', (proxyReq, req) => {
            const host = req.headers.host || ''
            proxyReq.setHeader('x-forwarded-host', host)
            const proto = req.headers['x-forwarded-proto'] || (/\.e2b\.app$/i.test(host.split(':')[0]) ? 'https' : 'http')
            proxyReq.setHeader('x-forwarded-proto', proto)
          })
        },
      },
      '/groq': {
        target: 'https://api.groq.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/groq/, '/openai/v1'),
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
  },
})
