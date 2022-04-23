const path = require('path');
const { defineConfig } = require('vite');

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/lib/index.ts'),
      name: "SurrealEngine",
      fileName: (format) => `lib.${format}.js`,
    }
  }
});
