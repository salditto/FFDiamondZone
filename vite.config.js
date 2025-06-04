import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { 
        target: 'https://c69d-2802-8012-216e-6e00-d5b5-5d75-1ba0-2e4b.ngrok-free.app/', // apunta a la url del ngrok levantado.
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'), // mantené el prefijo real
      },
    },
  },
});
