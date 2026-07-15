import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import basicSsl from '@vitejs/plugin-basic-ssl';




// https://vite.dev/config/
export default defineConfig({
  base: '/RetroCon',
  plugins: [
    react(),
    tailwindcss(),
    basicSsl(),
  ],
  server: {
    https: true,
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
      '@': '/src', // Alias for shadcn/retroui component installs
      '@pages': '/src/pages', // Alias for the pages directory
      '@components': '/src/Components', // Alias for the Components directory
      '@assets': '/src/assets', // Alias for the Components directory
    },
  },
  envDir: '.env',
});
