/* eslint-env node */
/* global process */
import express from 'express'
import Stripe from 'stripe'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'
import nodemailer from 'nodemailer'

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
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
  console.log('✅ Stripe inicializado correctamente')
} else {
  console.warn('⚠️ STRIPE_SECRET_KEY no configurada en .env.local')
}

// Configurar transporte de email
let emailTransporter = null
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })
  console.log('✅ Email transporter configurado')
} else {
  console.warn('⚠️ EMAIL_USER y/o EMAIL_PASS no configurados en .env.local')
}

// Función para enviar email con enlace de descarga
async function sendDownloadEmail(customerEmail, artist, album, downloadUrl) {
  if (!emailTransporter) {
    console.warn('⚠️ Email transporter no configurado, saltando envío de email')
    return
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: `🎵 Tu imagen digital de ${artist} - ${album} está lista`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #10b981; text-align: center;">¡Gracias por tu compra!</h1>

          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1f2937; margin-top: 0;">Tu pedido está confirmado</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Has comprado exitosamente la imagen digital de <strong>${artist} - ${album}</strong>.
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${downloadUrl}"
               style="background-color: #10b981; color: white; padding: 15px 30px;
                      text-decoration: none; border-radius: 8px; font-weight: bold;
                      display: inline-block; font-size: 16px;">
              📥 Descargar Imagen (JPG)
            </a>
          </div>

          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              <strong>💡 Tip:</strong> Guarda este enlace para futuras descargas. El enlace permanecerá activo indefinidamente.
            </p>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px; text-align: center;">
              Si tienes alguna pregunta, puedes contactarnos en
              <a href="mailto:contacto@framesound.com" style="color: #10b981;">contacto@framesound.com</a>
            </p>
            <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 10px;">
              © 2026 FRAME SOUND Studio - Todos los derechos reservados
            </p>
          </div>
        </div>
      `
    }

    const info = await emailTransporter.sendMail(mailOptions)
    console.log('✅ Email enviado exitosamente:', info.messageId)
    return true
  } catch (error) {
    console.error('❌ Error enviando email:', error)
    return false
  }
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
      metadata: {
        source: 'paginaalbums',
        artist: body.album?.artist || body.cart?.[0]?.album?.artist || 'Unknown',
        album: body.album?.album || body.cart?.[0]?.album?.album || 'Unknown'
      }
    })

    console.log('✅ Sesión de Stripe creada:', session.id)
    res.json({ url: session.url, sessionId: session.id })
  } catch (err) {
    console.error('❌ Error en create-checkout-session:', err.message)
    res.status(500).json({ error: err.message || 'Error desconocido' })
  }
})

// Webhook endpoint para manejar eventos de Stripe
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object
      console.log('✅ Pago completado:', session.id)

      // Aquí puedes enviar email con la imagen descargable
      // Por ahora, solo loggeamos
      console.log('Cliente email:', session.customer_details?.email)
      console.log('Producto comprado:', session.metadata)

      // Enviar email con enlace de descarga
      const { email } = session.customer_details
      const { artist, album } = session.metadata
      const downloadUrl = `${req.protocol}://${req.get('host')}/api/download/${artist}/${album}`

      const emailSent = await sendDownloadEmail(email, artist, album, downloadUrl)
      if (!emailSent) {
        console.error('❌ No se pudo enviar el email de descarga')
      }

      break

    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  res.json({ received: true })
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    stripe: stripe ? 'configured' : 'not configured',
    email: emailTransporter ? 'configured' : 'not configured',
    priceIds: {
      physical: process.env.PRICE_ID_PHYSICAL || 'not set',
      digital: process.env.PRICE_ID_DIGITAL || 'not set'
    }
  })
})

// Endpoint para descargar imágenes de álbumes
app.get('/api/download/:artist/:album', async (req, res) => {
  try {
    const { artist, artist: album } = req.params

    // Aquí deberías tener lógica para encontrar la imagen correcta
    // Por simplicidad, servimos una imagen de ejemplo
    const imagePath = path.join(__dirname, 'fotosAlbumsProva', '13.png') // Ejemplo

    if (!require('fs').existsSync(imagePath)) {
      return res.status(404).json({ error: 'Imagen no encontrada' })
    }

    // Configurar headers para descarga
    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Content-Disposition', `attachment; filename="${artist}-${album}.png"`)

    // Enviar el archivo
    res.sendFile(imagePath)
  } catch (err) {
    console.error('Error en descarga:', err)
    res.status(500).json({ error: 'Error al descargar la imagen' })
  }
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
${emailTransporter ? '✅' : '❌'} Email ${emailTransporter ? 'configurado' : 'NO configurado'}
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
