import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/off-line/blades-repair/blades-app/',
  plugins: [react()],
})
