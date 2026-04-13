import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'

// Cargar la clave pública desde Vite env (VITE_STRIPE_PUBLISHABLE_KEY)
const stripePromise = typeof window !== 'undefined' && import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : null

export default function CheckoutButton({ album, options, cart }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleCheckout() {
    setLoading(true)
    setError(null)

    try {
      // Validar que tenemos los datos necesarios
      if (!cart && !album) {
        throw new Error('No hay productos para comprar')
      }

      if (!cart && !options) {
        throw new Error('Opciones de compra no especificadas')
      }

      // Validar que Stripe esté configurado
      if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
        throw new Error('Stripe no está configurado correctamente. Verifica VITE_STRIPE_PUBLISHABLE_KEY en tu .env.local')
      }

      const body = cart && cart.length > 0 ? { cart } : { album, options }

      console.log('Enviando solicitud de checkout:', body)

      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      // Intentar parsear como JSON
      let data
      try {
        data = await res.json()
      } catch (jsonError) {
        const text = await res.text()
        throw new Error(`Error del servidor (respuesta inválida): ${text || 'Sin detalles'}`)
      }

      if (!res.ok) {
        throw new Error(data.error || 'Error creando la sesión de pago')
      }

      console.log('Respuesta del servidor:', data)

      // Si el backend devuelve una URL de Checkout (session.url) la usamos directamente (recomendado)
      if (data.url) {
        window.location.href = data.url
        return
      }

      // Fallback: Si devuelve sessionId, usamos stripe.redirectToCheckout (método legado)
      if (data.sessionId) {
        const stripe = await stripePromise
        if (!stripe) {
          throw new Error('Error al cargar Stripe. Verifica tu clave pública.')
        }

        const { error: stripeError } = await stripe.redirectToCheckout({ sessionId: data.sessionId })
        if (stripeError) {
          throw new Error(stripeError.message || 'Error en Stripe')
        }
        return
      }

      throw new Error('Respuesta inválida del servidor: ni url ni sessionId recibidos')
    } catch (err) {
      console.error('Checkout error:', err)
      setError(err.message || 'Error inesperado durante el pago')
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        className="primary-button product-buy-button"
        style={{ width: '100%', fontSize: '1.1rem', padding: '0.9rem' }}
        onClick={handleCheckout}
        disabled={loading}
      >
        {loading ? 'Redirigiendo...' : (options?.purchaseType === 'physical' ? 'Pagar 24,90 €' : 'Pagar 2,00 €')}
      </button>
      {error && <p style={{ color: 'red', marginTop: '0.5rem', fontSize: '0.9rem' }}>{error}</p>}
    </div>
  )
}

