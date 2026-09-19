import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // In production for GitHub Pages repository omarsawaf1/speech-center-demo
  base: process.env.NODE_ENV === 'production' ? '/speech-center-demo/' : '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
