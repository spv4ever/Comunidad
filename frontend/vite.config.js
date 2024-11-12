import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    historyApiFallback: true, // Permite que el servidor maneje rutas en una SPA
  },
});