/* eslint-env node */
/* global process */
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-04-10' })

export const handler = async (event, context) => {
  // Manejo de CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'OK' })
    }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    let body
    try {
      body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
    } catch (e) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid JSON in request body' })
      }
    }

    // Validar que exista STRIPE_SECRET_KEY
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY not configured')
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Stripe not configured on server' })
      }
    }

    const line_items = []

    // Dependiendo de cómo mandes los datos, puedes enviar "cart" (array) o un solo "album" + "options"
    if (Array.isArray(body.cart) && body.cart.length > 0) {
      // Se espera que cada item tenga: { album: { album, artist }, options: { purchaseType, frameSize, frameColor }, quantity }
      for (const item of body.cart) {
        const priceId = process.env.PRICE_ID_PHYSICAL || 'price_placeholder_physical'
        const priceIdDigital = process.env.PRICE_ID_DIGITAL || 'price_placeholder_digital'

        const chosenPrice = item.options && item.options.purchaseType === 'digital' ? priceIdDigital : priceId

        if (chosenPrice.includes('placeholder')) {
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Price IDs not configured in environment. Please set PRICE_ID_PHYSICAL and PRICE_ID_DIGITAL.' })
          }
        }

        line_items.push({ price: chosenPrice, quantity: item.quantity || 1 })
      }
    } else if (body.album && body.options) {
      const priceId = process.env.PRICE_ID_PHYSICAL || 'price_placeholder_physical'
      const priceIdDigital = process.env.PRICE_ID_DIGITAL || 'price_placeholder_digital'
      const chosenPrice = body.options.purchaseType === 'digital' ? priceIdDigital : priceId

      if (chosenPrice.includes('placeholder')) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Price IDs not configured in environment. Please set PRICE_ID_PHYSICAL and PRICE_ID_DIGITAL.' })
        }
      }

      line_items.push({ price: chosenPrice, quantity: 1 })
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No purchase data provided (cart or album+options required)' })
      }
    }

    // Determinar la URL de origen
    const origin = event.headers.origin || `https://${event.headers.host}` || 'http://localhost:5173'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      success_url: `${origin}/?view=success`,
      cancel_url: `${origin}/?view=checkout`,
      metadata: { source: 'paginaalbums' }
    })

    // Responder con URL de Checkout (la forma más moderna)
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: session.url, sessionId: session.id })
    }
  } catch (err) {
    console.error('create-checkout-session error:', err)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || 'Unknown error' })
    }
  }
}

