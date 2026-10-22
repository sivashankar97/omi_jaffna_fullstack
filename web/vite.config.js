import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  base: process.env.VITE_BASE_PATH || (process.env.NODE_ENV === 'production' ? '/admin/' : '/'),
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: true,
    hmr: { clientPort: 5174 },
    proxy: {
      '/api': 'http://127.0.0.1:4000',
      '/cms-blocks': 'http://127.0.0.1:5173',
    },
  },
});
