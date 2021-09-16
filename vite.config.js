import { resolve } from 'path';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/limitless.ts'),
      name: 'limitless',
      fileName: 'limitless'
    }
  },
  server: {
    open: true
  }
});
