import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import path from 'path'
import '../../config.js'

dotenv.config({ path: path.resolve(__dirname, '.env') })

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  preview: {
    port: 5173,
    strictPort: true,
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    origin: "http://0.0.0.0:8080",
    proxy: {
      '/api': process.env.VITE_EXPRESS_URL,
    }
  },
});