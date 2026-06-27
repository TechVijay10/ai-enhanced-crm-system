import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/auth': { target: 'http://localhost:9090', changeOrigin: true },
      '/customers': { target: 'http://localhost:9090', changeOrigin: true },
      '/leads': { target: 'http://localhost:9090', changeOrigin: true },
      '/analytics': { target: 'http://localhost:9090', changeOrigin: true },
      '/tasks': { target: 'http://localhost:9090', changeOrigin: true },
      '/notifications': { target: 'http://localhost:9090', changeOrigin: true },
      '/recommendations': { target: 'http://localhost:9090', changeOrigin: true },
      '/social': { target: 'http://localhost:9090', changeOrigin: true },
    }
  }
})
