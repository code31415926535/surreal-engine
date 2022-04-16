import { fileURLToPath } from 'url';
import { defineConfig } from "vite";

// TODO: Don't have src in the url
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        simpleShapes: fileURLToPath(new URL('./src/examples/1-simple-shapes/index.html', import.meta.url)),
        lightingShadowsFog: fileURLToPath(new URL('./src/examples/2-lighting-shadows-fog/index.html', import.meta.url)),
        motion: fileURLToPath(new URL('./src/examples/3-motion/index.html', import.meta.url)),
        characterMovement: fileURLToPath(new URL('./src/examples/4-character-movement/index.html', import.meta.url)),
        camera: fileURLToPath(new URL('./src/examples/5-camera/index.html', import.meta.url)),
        texturesAndSkybox: fileURLToPath(new URL('./src/examples/6-textures-and-skybox/index.html', import.meta.url)),
      },
    }
  }
});
