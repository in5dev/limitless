import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve('src/limitless.ts'),
      name: 'limitless',
      fileName: 'limitless'
    }
  },
  server: {
    open: true
  }
});
