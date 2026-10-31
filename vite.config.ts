import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// GitHub Pages serves from a subpath; relative base keeps the deck working at
// any repo name and on a custom domain.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
