// vite.config.js — Cấu hình Vite cho dự án React
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  // Proxy API calls đến backend trong môi trường development
  // Giúp tránh lỗi CORS khi gọi từ localhost:5173 → localhost:5000
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
