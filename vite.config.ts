import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    build: {
      outDir: 'build'
    },
    server: {
      port: 3000,
      open: true
    },
    define: {
      'process.env.VITE_GITHUB_TOKEN': JSON.stringify(env.VITE_GITHUB_TOKEN)
    }
  }
})
