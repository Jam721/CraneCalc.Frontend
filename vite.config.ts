import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'], // оставили только необходимые
      manifest: {
        name: 'Каталог грузов',
        short_name: 'Грузы',
        description: 'Каталог грузов с расчетом для башенного крана',
        theme_color: '#000000',
        background_color: '#121212',
        display: 'standalone',
        scope: '/CraneCalc.Frontend/',
        start_url: '/CraneCalc.Frontend/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  base: '/CraneCalc.Frontend/',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5069',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
