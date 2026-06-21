import { defineConfig } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

function parseJsonRequest(req: any) {
  return new Promise<any>((resolve, reject) => {
    const chunks: Uint8Array[] = []
    req.on('data', (chunk: Uint8Array) => chunks.push(chunk))
    req.on('end', () => {
      try {
        const text = Buffer.concat(chunks).toString('utf-8')
        resolve(text ? JSON.parse(text) : {})
      } catch (error) {
        reject(error)
      }
    })
    req.on('error', reject)
  })
}

function filenameFromUrl(urlString: string) {
  try {
    const url = new URL(urlString)
    const base = path.basename(url.pathname)
    return base || `file-${Date.now()}`
  } catch {
    return `file-${Date.now()}`
  }
}

function subscriberWebhookPlugin() {
  return {
    name: 'subscriber-webhook',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.method !== 'POST' || !req.url?.startsWith('/api/webhooks/subscriber-file/')) {
          return next()
        }

        const authHeader = String(req.headers.authorization || '')
        const expected = process.env.WEBHOOK_BEARER_TOKEN
        if (!expected || authHeader !== `Bearer ${expected}`) {
          res.statusCode = 401
          res.setHeader('Content-Type', 'application/json')
          return res.end(JSON.stringify({ error: 'Unauthorized' }))
        }

        let body: any
        try {
          body = await parseJsonRequest(req)
        } catch (error) {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          return res.end(JSON.stringify({ error: 'Invalid JSON body' }))
        }

        const fileUrl = body.fileUrl || body.fileAddress || body.url
        if (!fileUrl) {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          return res.end(JSON.stringify({ error: 'Missing fileUrl in body' }))
        }

        try {
          const response = await fetch(fileUrl)
          if (!response.ok) {
            res.statusCode = 502
            res.setHeader('Content-Type', 'application/json')
            return res.end(JSON.stringify({ error: `Failed to download file: ${response.status}` }))
          }

          const url = new URL(req.url, 'http://localhost')
          const userId = url.pathname.split('/').pop() || 'unknown'
          const downloadsDir = path.join(process.cwd(), 'downloads', String(userId))
          await fs.promises.mkdir(downloadsDir, { recursive: true })

          let filename = filenameFromUrl(fileUrl)
          const disposition = response.headers.get('content-disposition')
          if (disposition) {
            const match = /filename="?([^";]+)"?/.exec(disposition)
            if (match?.[1]) filename = match[1]
          }

          const targetPath = path.join(downloadsDir, filename)
          const writable = fs.createWriteStream(targetPath)

          await new Promise<void>((resolve, reject) => {
            if (!response.body) {
              return reject(new Error('No response body'))
            }
            response.body.pipe(writable)
            response.body.on('error', reject)
            writable.on('finish', resolve)
            writable.on('error', reject)
          })

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          return res.end(JSON.stringify({ status: 'ok', path: targetPath }))
        } catch (error: any) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          return res.end(JSON.stringify({ error: error?.message || 'Webhook handler failure' }))
        }
      })
    },
  }
}

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    subscriberWebhookPlugin(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
