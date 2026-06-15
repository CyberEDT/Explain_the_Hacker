import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Target modern browsers — reduces polyfill bloat
    target: 'es2020',
    // No source maps in production (prevents source leakage)
    sourcemap: false,
    // Use esbuild for fast, lean minification
    minify: 'esbuild',
    // Raise warning threshold — Recharts is legitimately large but lazy-loaded
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        // Split vendor chunks for optimal long-term caching
        manualChunks: {
          // React runtime — changes rarely, gets cached aggressively
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Recharts — only loaded after analysis results appear (lazy import)
          'vendor-recharts': ['recharts'],
          // Zod + Zustand — small but separate from React runtime
          'vendor-state': ['zod', 'zustand'],
          // Axios — network layer
          'vendor-axios': ['axios'],
        },
      },
    },
  },
})
