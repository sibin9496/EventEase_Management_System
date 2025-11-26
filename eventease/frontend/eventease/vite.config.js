import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Custom middleware to handle SPA routing
const spaFallback = () => {
  return {
    name: 'spa-fallback',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // If request is not for a file (no extension) and not for /api or /uploads, serve index.html
        if (!req.url.includes('.') && !req.url.startsWith('/api') && !req.url.startsWith('/uploads') && !req.url.startsWith('/@')) {
          req.url = '/index.html'
        }
        next()
      })
    }
  }
}

export default defineConfig({
  plugins: [
    react({
      include: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    }),
    spaFallback()
  ],
  envPrefix: 'VITE_',
  server: {
    port: 3000,
    host: '0.0.0.0',
    strictPort: true,
    cors: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 3000,
      timeout: 60000
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
        ws: true,
        timeout: 30000
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
        timeout: 30000
      }
    }
  },
  define: {
    'process.env': {}
  },
  resolve: {
    alias: {
      '@': '/src',
      '@emotion/react': '@emotion/react',
      '@emotion/styled': '@emotion/styled'
    },
    dedupe: ['@emotion/react', '@emotion/styled', 'react', 'react-dom']
  },
  optimizeDeps: {
    include: [
      '@mui/material',
      '@emotion/react',
      '@emotion/styled',
      '@mui/icons-material',
      'react',
      'react-dom',
      'react-router-dom'
    ],
    exclude: ['node_modules/.vite']
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-mui': [
            '@mui/material',
            '@mui/icons-material',
            '@emotion/react',
            '@emotion/styled'
          ],
          'vendor-react': ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  }
})