import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import { compression } from 'vite-plugin-compression2'

export default defineConfig({
  plugins: [
    tailwindcss(),
    createHtmlPlugin({ minify: true }),
    compression(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
    outDir: 'dist/site',
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
