import { useState, useEffect } from 'react'

const PRICES = { digital: 2, physical: 24.9 }
const formatPrice = (n) =>
    n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })

export default function CheckoutButton({
                                         album,
                                         options,
                                         cart = [],
                                         customerEmail = '',
                                         shippingAddress = '',
                                         total,
                                       }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Si el usuario vuelve atrás desde Stripe (caché del navegador), reactivamos el botón
  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted) setLoading(false)
    }
    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [])

  const hasCart = Array.isArray(cart) && cart.length > 0

  // Importe mostrado en el botón: el que pasa App; si no, lo calculamos aquí
  const displayTotal =
      typeof total === 'number'
          ? total
          : hasCart
              ? cart.reduce((sum, it) => sum + PRICES[it.options.purchaseType] * it.quantity, 0)
              : PRICES[options?.purchaseType] ?? 0

  async function handleCheckout() {
    setLoading(true)
    setError(null)

    try {
      if (!hasCart && !album) throw new Error('No hay productos para comprar')
      if (!hasCart && !options) throw new Error('Opciones de compra no especificadas')

      // El servidor debe calcular el precio con su propia tabla: aquí solo enviamos qué se compra
      const purchase = hasCart ? { cart } : { album, options }
      const body = {
        ...purchase,
        customerEmail: customerEmail || undefined,
        shippingAddress: shippingAddress || undefined,
      }

      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      // Leemos el cuerpo una sola vez (si se llama a res.json() y falla, res.text() ya no funciona)
      const raw = await res.text()
      let data
      try {
        data = JSON.parse(raw)
      } catch {
        throw new Error(`Error del servidor (respuesta inválida): ${raw || 'Sin detalles'}`)
      }

      if (!res.ok) throw new Error(data.error || 'Error creando la sesión de pago')
      if (!data.url) throw new Error('Respuesta inválida del servidor: no se recibió URL de checkout')

      // Guardamos solo lo necesario para la pantalla de éxito (sin email ni dirección)
      localStorage.setItem('pendingPurchase', JSON.stringify(purchase))

      window.location.href = data.url
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
            disabled={loading || displayTotal <= 0}
        >
          {loading ? 'Redirigiendo...' : `Pagar ${formatPrice(displayTotal)}`}
        </button>
        {error && (
            <p role="alert" style={{ color: 'red', marginTop: '0.5rem', fontSize: '0.9rem' }}>
              {error}
            </p>
        )}
      </div>
  )
}
