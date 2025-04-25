import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';  // Import fileURLToPath
import { dirname } from 'path';  // Import dirname

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split node_modules packages into separate chunks
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react'
            if (id.includes('tailwindcss')) return 'tailwindcss'
            if (id.includes('chart.js')) return 'chartjs'
            if (id.includes('lodash')) return 'lodash'
            return 'vendor'
          }
        },
      },
    },
    chunkSizeWarningLimit: 700, // optional: increase limit (default is 500 kB)
  },
  resolve: {
    alias: {
      '@': dirname(fileURLToPath(import.meta.url)) + '/src',  // Use fileURLToPath and dirname to resolve the path
    },
  },
});
