import { defineConfig } from "vite";

export default defineConfig({
  base: "/fundamenta-operationum-models/",

  build: {
    outDir: 'lib',
    lib: {
      entry: 'src/modelLoader.js',
      name: 'SphericalModels',
      filename: 'spherical-models',
      formats: ['es']
    }
  }
});
