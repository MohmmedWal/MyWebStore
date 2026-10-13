import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import perfumeHandler from './api/perfumes.js'

const localApi = {
  name: 'local-fragrance-api',
  configureServer(server) {
    server.middlewares.use('/api/perfumes', (request, response, next) => {
      const adaptedResponse = {
        setHeader: (...args) => response.setHeader(...args),
        status(code) {
          response.statusCode = code
          return this
        },
        json(body) {
          response.setHeader('Content-Type', 'application/json')
          response.end(JSON.stringify(body))
        },
      }

      Promise.resolve(perfumeHandler(request, adaptedResponse)).catch(next)
    })
  },
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, globalThis.process.cwd(), '')
  if (!globalThis.process.env.RAPIDAPI_KEY && env.RAPIDAPI_KEY) {
    globalThis.process.env.RAPIDAPI_KEY = env.RAPIDAPI_KEY
  }

  return {
    plugins: [react(), tailwindcss(), localApi],
  }
})
