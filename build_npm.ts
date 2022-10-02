import { build, emptyDir } from 'https://deno.land/x/dnt@0.31.0/mod.ts';

await emptyDir('./npm');

const dirs: string[] = [];
for await (const { name, isDirectory } of Deno.readDir('./src')) {
  if (isDirectory) dirs.push(name);
}

await build({
  entryPoints: ['./src/mod.ts', ...dirs.map(d => `./src/${d}/mod.ts`)],
  outDir: './npm',
  importMap: './import_map.json',
  packageManager: 'bun',
  compilerOptions: {
    target: 'ES2021'
  },
  shims: {
    deno: {
      test: 'dev'
    },
    timers: true,
    undici: true
  },
  package: {
    name: '@in5net/limitless',
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

Deno.copyFileSync('LICENSE', 'npm/LICENSE');
Deno.copyFileSync('README.md', 'npm/README.md');
