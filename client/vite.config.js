import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "global": "window",
  },
  server: {
    host: true, // Expose to network
    proxy: {
      '/api': process.env.VITE_API_URL || 'http://127.0.0.1:5000'
    }
  },
  resolve: {
    alias: {
      process: "process/browser",
      stream: "stream-browserify",
      zlib: "browserify-zlib",
      util: "util",
      events: "events",
    },
  },
  optimizeDeps: {
    include: ['util', 'process', 'events', 'stream-browserify', 'browserify-zlib'],
    esbuildOptions: {
        define: {
            global: 'globalThis'
        }
    }
  },
})
