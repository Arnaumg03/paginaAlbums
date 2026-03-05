/* eslint-env node */
/* global process */
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' })

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = req.body || {}

    // Dependiendo de cómo mandes los datos, puedes enviar "cart" (array) o un solo "album" + "options"
    const line_items = []

    if (Array.isArray(body.cart) && body.cart.length > 0) {
      // Se espera que cada item tenga: { album: { album, artist }, options: { purchaseType, frameSize, frameColor }, quantity }
      for (const item of body.cart) {
        // Aquí deberías mapear a price IDs reales creados en Stripe Dashboard
        // Por simplicidad usamos price placeholders y cantidad
        const priceId = process.env.PRICE_ID_PHYSICAL || 'price_placeholder_physical'
        const priceIdDigital = process.env.PRICE_ID_DIGITAL || 'price_placeholder_digital'

        const chosenPrice = item.options && item.options.purchaseType === 'digital' ? priceIdDigital : priceId

        line_items.push({ price: chosenPrice, quantity: item.quantity || 1 })
      }
    } else if (body.album) {
      const priceId = process.env.PRICE_ID_PHYSICAL || 'price_placeholder_physical'
      const priceIdDigital = process.env.PRICE_ID_DIGITAL || 'price_placeholder_digital'
      const chosenPrice = body.options && body.options.purchaseType === 'digital' ? priceIdDigital : priceId
      line_items.push({ price: chosenPrice, quantity: 1 })
    } else {
      return res.status(400).json({ error: 'No se proporcionaron datos de compra' })
    }

    const origin = req.headers.origin || (`https://${req.headers.host}`) || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      success_url: `${origin}/?view=success`,
      cancel_url: `${origin}/?view=checkout`,
      // Puedes añadir metadata con información del pedido para luego usar en webhook
      metadata: { source: 'paginaalbums' }
    })

    // Responder con sessionId para usar stripe.redirectToCheckout({ sessionId }) en frontend
    return res.status(200).json({ sessionId: session.id })
  } catch (err) {
    console.error('create-checkout-session error:', err)
    return res.status(500).json({ error: err.message })
  }
}
