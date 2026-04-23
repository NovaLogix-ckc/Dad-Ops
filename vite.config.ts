import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Base path is the repo name so GitHub Pages serves from /Dad-Ops/.
// Override with VITE_BASE at build time for custom domains or forks.
const base = process.env.VITE_BASE ?? '/Dad-Ops/'

export default defineConfig({
  base,
  plugins: [
    react(),
    {
      name: 'spa-404-fallback',
      closeBundle() {
        const dist = resolve(__dirname, 'dist')
        copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'))
      },
    },
  ],
})
