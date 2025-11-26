import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    outDir: 'dist/lib',
    minify: true,
    cssMinify: true,
    lib: {
      entry: resolve(import.meta.dirname, 'lib/landscape.js'),
      name: 'LandscapeJS',
      // the proper extensions will be added
      fileName: 'landscape',
    },
  },
})
