import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Cấu hình Vite cho giao diện React.
 *
 * - Dev server bind 0.0.0.0 để chạy được trong môi trường preview (iframe/domain riêng).
 * - `allowedHosts: true` tránh việc Vite chặn host của preview.
 * - Proxy `/api` và `/exercises.json` sang Express (cổng 3000) để trình duyệt chỉ nói chuyện
 *   với một origin duy nhất — không có localhost cứng trong code phía browser.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
      '/exercises.json': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        // three.js đi chunk riêng để cache được lâu
        manualChunks: { three: ['three'] },
      },
    },
  },
});
