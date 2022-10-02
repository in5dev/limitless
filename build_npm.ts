import { build, emptyDir } from 'https://deno.land/x/dnt@0.31.0/mod.ts';

await emptyDir('./npm');

await build({
  entryPoints: ['./mod.ts'],
  outDir: './npm',
  compilerOptions: {
    target: 'ES2021'
  },
  shims: {
    deno: true
  },
  package: {
    name: '"@in5net/limitless',
    version: Deno.args[0],
    description: 'A TypeScript library',
    author: 'in5dev',
    license: 'MIT',
    repository: {
      type: 'git',
      url: 'git+https://github.com/in5dev/limitless.git'
    }
  }
});

// post build steps
Deno.copyFileSync('LICENSE', 'npm/LICENSE');
Deno.copyFileSync('README.md', 'npm/README.md');
