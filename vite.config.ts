import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
//    host: '192.168.2.52',
    host: '127.0.0.1',
    port: 80
  }
})
