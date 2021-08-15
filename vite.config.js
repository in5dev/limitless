import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/limitless.ts'),
      name: 'limitless',
      fileName: 'limitless'
    }
  }
});
