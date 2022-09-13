import { join } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: join(__dirname, 'src/index.ts'),
      name: 'Limitless',
      fileName: 'index'
    }
  }
});
