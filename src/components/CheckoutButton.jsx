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
      const body = cart && cart.length > 0 ? { cart } : { album, options }
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Error creando la sesión de pago')
      }

      const data = await res.json()

      // Si el backend devuelve una URL de Checkout (session.url) la usamos directamente
      if (data.url) {
        window.location.href = data.url
        return
      }

      // Si devuelve sessionId, usamos stripe.redirectToCheckout
      if (data.sessionId) {
        const stripe = await stripePromise
        if (!stripe) throw new Error('La clave pública de Stripe no está configurada en VITE_STRIPE_PUBLISHABLE_KEY')
        const { error: stripeError } = await stripe.redirectToCheckout({ sessionId: data.sessionId })
        if (stripeError) throw stripeError
        return
      }

      throw new Error('Respuesta inválida del servidor de pago')
    } catch (err) {
      console.error(err)
      setError(err.message || 'Error inesperado')
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
      {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
    </div>
  )
}

