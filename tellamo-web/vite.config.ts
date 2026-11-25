import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Relative paths so the build works under github.io/<repo>/ as well as at a domain root.
  base: './',
  plugins: [react(), tailwindcss()],
})
