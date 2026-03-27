import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { compression } from 'vite-plugin-compression2'


export default defineConfig({
  plugins: [
    tailwindcss(),
    compression(),
  ],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'lib/landscape.js'),
      name: 'LandscapeJS',
      // the proper extensions will be added
      fileName: 'landscape',
    },
    outDir: 'dist/lib',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,   // remove console.log
        drop_debugger: true,
      },
    },
    cssMinify: true, // CSS minification (default: true)
    reportCompressedSize: true,
  },
})
