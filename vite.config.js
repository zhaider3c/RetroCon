import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";


// https://vite.dev/config/
export default defineConfig({
  base: '/RetroCon',
  plugins: [
    react(),
    tailwindcss(),
    ],
  server: {
    port: 6501,
    proxy: {
      '/coverage-html': 'http://172.16.51.85:9999',
    },
    allowedHosts: [
      'pchost'
    ]
  },
  resolve: {
    alias: {
      '@pages': '/src/pages', // Alias for the pages directory
      '@components': '/src/Components', // Alias for the Components directory
    },
  },
});
