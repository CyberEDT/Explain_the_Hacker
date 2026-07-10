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
    dedupe: ['react', 'react-dom'],
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
        // Removed manualChunks: Forcibly splitting vendor-react and vendor-recharts was causing 
        // Vite to initialize duplicate React contexts in dev mode, leading to useContext crashes.
        // Rollup's default chunking is safer and still highly optimized.
      },
    },
  },
})
