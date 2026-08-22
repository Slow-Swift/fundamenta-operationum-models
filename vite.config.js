import { defineConfig } from "vite";
import { resolve } from 'path'

export default defineConfig({
  base: "/fundamenta-operationum-models/",
  
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        threejs_models: resolve(__dirname, 'threejs_models.html'),
      }
    }
  }
});

