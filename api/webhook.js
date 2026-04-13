/* eslint-env node */
/* global process */
import Stripe from 'stripe'
import nodemailer from 'nodemailer'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })

// Configurar transporte de email
let emailTransporter = null
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  emailTransporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })
}

// Función para enviar email con enlace de descarga
async function sendDownloadEmail(customerEmail, artist, album, downloadUrl) {
  if (!emailTransporter) {
    console.warn('⚠️ Email transporter no configurado, saltando envío de email')
    return false
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

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

      // Enviar email con enlace de descarga
      const { email } = session.customer_details
      const { artist, album } = session.metadata
      const downloadUrl = `${req.headers.origin || `https://${req.headers.host}`}/api/download/${artist}/${album}`

      const emailSent = await sendDownloadEmail(email, artist, album, downloadUrl)
      if (!emailSent) {
        console.error('❌ No se pudo enviar el email de descarga')
      }

      break

    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  res.json({ received: true })
}
