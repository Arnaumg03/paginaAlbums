/* eslint-env node */
/* global process */
import express from 'express'
import Stripe from 'stripe'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

// Cargar variables de entorno desde .env.local
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.join(__dirname, '.env.local') })

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

// Inicializar Stripe
let stripe = null
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-04-10' })
  console.log('✅ Stripe inicializado correctamente')
} else {
  console.warn('⚠️ STRIPE_SECRET_KEY no configurada en .env.local')
}

// API: Crear sesión de checkout
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe no está configurado en el servidor' })
    }

    const body = req.body || {}
    const line_items = []

    // Validar datos
    if (!body.cart && !body.album) {
      return res.status(400).json({ error: 'No se proporcionaron datos de compra' })
    }

    if (!body.cart && !body.options) {
      return res.status(400).json({ error: 'No se proporcionaron opciones de compra' })
    }

    // Procesar cart o single album
    if (Array.isArray(body.cart) && body.cart.length > 0) {
      for (const item of body.cart) {
        const priceId = item.options?.purchaseType === 'digital'
          ? process.env.PRICE_ID_DIGITAL
          : process.env.PRICE_ID_PHYSICAL

        if (!priceId || priceId.includes('placeholder') || priceId.includes('XXX')) {
          return res.status(500).json({
            error: 'Identificadores de precio no configurados. Configura PRICE_ID_PHYSICAL y PRICE_ID_DIGITAL en .env.local'
          })
        }

        line_items.push({ price: priceId, quantity: item.quantity || 1 })
      }
    } else {
      const priceId = body.options.purchaseType === 'digital'
        ? process.env.PRICE_ID_DIGITAL
        : process.env.PRICE_ID_PHYSICAL

      if (!priceId || priceId.includes('placeholder') || priceId.includes('XXX')) {
        return res.status(500).json({
          error: 'Identificadores de precio no configurados. Configura PRICE_ID_PHYSICAL y PRICE_ID_DIGITAL en .env.local'
        })
      }

      line_items.push({ price: priceId, quantity: 1 })
    }

    // Crear sesión de Stripe
    const origin = `${req.protocol}://${req.get('host')}`
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      success_url: `${origin}/?view=success`,
      cancel_url: `${origin}/?view=checkout`,
      metadata: { source: 'paginaalbums' }
    })

    console.log('✅ Sesión de Stripe creada:', session.id)
    res.json({ url: session.url, sessionId: session.id })
  } catch (err) {
    console.error('❌ Error en create-checkout-session:', err.message)
    res.status(500).json({ error: err.message || 'Error desconocido' })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    stripe: stripe ? 'configured' : 'not configured',
    priceIds: {
      physical: process.env.PRICE_ID_PHYSICAL || 'not set',
      digital: process.env.PRICE_ID_DIGITAL || 'not set'
    }
  })
})

// Servir aplicación estática después de que se compile
app.use(express.static('dist'))

// SPA fallback - servir index.html para rutas no encontradas
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`
🚀 Servidor iniciado en http://localhost:${PORT}

📋 Comprobaciones:
${stripe ? '✅' : '❌'} Stripe ${stripe ? 'configurado' : 'NO configurado'}
${process.env.PRICE_ID_DIGITAL && !process.env.PRICE_ID_DIGITAL.includes('XXX') ? '✅' : '❌'} PRICE_ID_DIGITAL ${process.env.PRICE_ID_DIGITAL}
${process.env.PRICE_ID_PHYSICAL && !process.env.PRICE_ID_PHYSICAL.includes('XXX') ? '✅' : '❌'} PRICE_ID_PHYSICAL ${process.env.PRICE_ID_PHYSICAL}

📖 Consulta http://localhost:${PORT}/api/health para el estado
  `)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido, cerrando servidor...')
  server.close(() => {
    console.log('Servidor cerrado')
    process.exit(0)
  })
})

