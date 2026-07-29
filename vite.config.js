import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `MOCK_API=1 npm run dev` serves /api/subscribe locally instead of proxying to
// production, so form testing never writes contacts to the live Mailchimp audience.
const useMockApi = process.env.MOCK_API === '1'

function readJsonBody(req) {
  return new Promise((resolve) => {
    let raw = ''
    req.on('data', (chunk) => {
      raw += chunk
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(raw || '{}'))
      } catch {
        resolve(null)
      }
    })
  })
}

function mockSubscribeApi() {
  return {
    name: 'mock-subscribe-api',
    configureServer(server) {
      server.middlewares.use('/api/subscribe', async (req, res) => {
        const send = (status, body) => {
          res.statusCode = status
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(body))
        }

        if (req.method !== 'POST') {
          return send(405, { error: 'Method not allowed.' })
        }

        const body = await readJsonBody(req)

        if (!body) {
          return send(400, { error: 'Invalid request body.' })
        }

        console.log('\n[mock /api/subscribe] payload:', JSON.stringify(body, null, 2))

        const email = (body.email || '').trim()

        // Lets us exercise the error branch without a real Mailchimp failure.
        if (email.includes('fail')) {
          return send(400, { error: 'Mock failure: this address was rejected.' })
        }

        const childCount = Array.isArray(body.children) && body.children.length > 0
          ? body.children.length
          : 1

        return send(200, { success: true, registeredCount: childCount, childCount })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), ...(useMockApi ? [mockSubscribeApi()] : [])],
  server: useMockApi
    ? {}
    : {
        proxy: {
          '/api': {
            target: 'https://brooklyngamebreakers.com',
            changeOrigin: true,
            secure: true,
          },
        },
      },
})
