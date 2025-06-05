import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { 
        target: 'https://1d32-201-179-131-210.ngrok-free.app/', // apunta a la url del ngrok levantado.
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'), // mantené el prefijo real
      },
    },
  },
});
