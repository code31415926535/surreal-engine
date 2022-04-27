import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 8080,
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/lib/surreal-engine.ts'),
      name: "SurrealEngine",
      fileName: (format) => `surreal-engine.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        }
      }
    }
  },
});
