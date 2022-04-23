import path from 'path';
import { defineConfig } from 'vite';
import typescript from '@rollup/plugin-typescript';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/lib/index.ts'),
      name: "SurrealEngine",
      fileName: (format) => `surreal-engine.${format}.js`,
    },
    rollupOptions: {
      plugins: [
        typescript({
          target: 'ESNext',
          rootDir: path.resolve('./src/lib'),
          declaration: true,
          declarationDir: path.resolve('./dist'),
          exclude: path.resolve('./node_modules/**'),
          allowSyntheticDefaultImports: true
        })
      ]
    }
  },
});
