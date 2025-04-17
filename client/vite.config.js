import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { base } from 'framer-motion/client'

// https://vite.dev/config/
export default defineConfig({
  server: {
  host: true,        // or '0.0.0.0'
  port: 5173,        // use the same port as shown in terminal
},
  plugins: [
    tailwindcss(),
    react()
  ],
  // base: "/mlmcryptopay/"
})
