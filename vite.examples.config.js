import { resolve } from 'path';
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        simpleShapes: resolve(__dirname, 'examples/1-simple-shapes/index.html'),
        lightingShadowsFog: resolve(__dirname, 'examples/2-lighting-shadows-fog/index.html'),
        motion: resolve(__dirname, 'examples/3-motion/index.html'),
        characterMovement: resolve(__dirname, 'examples/4-character-movement/index.html'),
        camera: resolve(__dirname, 'examples/5-camera/index.html'),
        texturesAndSkybox: resolve(__dirname, 'examples/6-textures-and-skybox/index.html'),
      },
    }
  }
});
