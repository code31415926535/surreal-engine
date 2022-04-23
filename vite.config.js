import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/lib/index.ts'),
      name: "SurrealEngine",
      fileName: (format) => `index.${format}.js`,
    },
  },
});
