import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// With VITE_API_BASE_URL empty, /api calls are proxied to Flask (no CORS setup needed in dev).
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://127.0.0.1:5000' } },
})
