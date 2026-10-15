import { useState, useEffect } from 'react'
import './App.css'
import badBunnyUnVerano from '../fotosAlbumsProva/Bad Bunny_Un Verano Sin Ti.png'
import badBunnyYhlqmdlg from '../fotosAlbumsProva/Bad Bunny_YHLQMDLG.png'
import badBunnyDebiTirarMasFotos1 from '../fotosAlbumsProva/13.png'
import badBunnyDebiTirarMasFotos2 from '../fotosAlbumsProva/14.png'
import moraEstrella from '../fotosAlbumsProva/Mora_ESTRELLA.png'
import moraLoMismo from '../fotosAlbumsProva/Mora_LO MISMO DE SIEMPRE.png'
import anuelEmmanuel from '../fotosAlbumsProva/Anuel AA_Emmanuel.png'
import jcReyesVivir from '../fotosAlbumsProva/JC Reyes_VIVIR PA QUEDARSE.png'
import quevedoBuenasNoches1 from '../fotosAlbumsProva/Quevedo_BUENAS NOCHES_ 1.png'
import quevedoBuenasNoches2 from '../fotosAlbumsProva/Quevedo_BUENAS NOCHES_2.png'
import luchoSordoDeUnPie from '../fotosAlbumsProva/lucho RK_SORDO DE UN PIE.png'
import CheckoutButton from './components/CheckoutButton'

/* ------------------------------------------------------------------ */
/* Constantes                                                          */
/* ------------------------------------------------------------------ */

const CONTACT_EMAIL = 'framesoundstudio@gmail.com'
const INSTAGRAM_HANDLE = 'framesoundstudio'
const TIKTOK_HANDLE = 'framesoundstudio'

const PRICES = { digital: 2, physical: 24.9 }
const formatPrice = (n) =>
    n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })

const SAMPLE_ALBUMS = [
  { artist: 'Bad Bunny', album: 'Un Verano Sin Ti', style: 'colorful', cover: badBunnyUnVerano, isNew: true },
  { artist: 'Bad Bunny', album: 'YHLQMDLG', style: 'colorful', cover: badBunnyYhlqmdlg, isNew: true },
  { artist: 'Bad Bunny', album: 'DEBI TIRAR MAS FOTOS', style: 'colorful', cover: badBunnyDebiTirarMasFotos1, isNew: true },
  { artist: 'Bad Bunny', album: 'DEBI TIRAR MAS FOTOS', style: 'colorful', cover: badBunnyDebiTirarMasFotos2, isNew: true },
  { artist: 'Mora', album: 'ESTRELLA', style: 'minimal', cover: moraEstrella },
  { artist: 'Mora', album: 'LO MISMO DE SIEMPRE', style: 'dark', cover: moraLoMismo },
  { artist: 'Anuel AA', album: 'Emmanuel', style: 'dark', cover: anuelEmmanuel },
  { artist: 'JC Reyes', album: 'VIVIR PA QUEDARSE', style: 'vintage', cover: jcReyesVivir },
  { artist: 'Quevedo', album: 'BUENAS NOCHES (versión 1)', style: 'colorful', cover: quevedoBuenasNoches1 },
  { artist: 'Quevedo', album: 'BUENAS NOCHES (versión 2)', style: 'colorful', cover: quevedoBuenasNoches2 },
  { artist: 'Lucho RK', album: 'SORDE DE UN PIE', style: 'colorful', cover: luchoSordoDeUnPie },
]

const ARTISTS = Array.from(new Set(SAMPLE_ALBUMS.map((a) => a.artist)))

// Vistas en las que NO se muestra el botón flotante "¿No encuentras el cuadro?"
const HIDE_CTA_VIEWS = [
  'contact', 'checkout', 'payment', 'success', 'cart', 'favorites',
  'contact-info', 'refund-policy', 'privacy-policy', 'terms-of-service',
  'shipping-policy', 'legal-notice',
]

const LEGAL_PAGES = {
  'refund-policy': {
    title: 'Política de devoluciones y reembolsos',
    content: (
        <>
          <h3>Cuadros físicos</h3>
          <p>
            Puedes devolver tu pedido físico en un plazo de <strong>14 días naturales</strong> desde
            que lo recibes, sin necesidad de justificar el motivo. Para iniciar la devolución escríbenos
            a <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> indicando tu número de pedido.
          </p>
          <ul>
            <li>El producto debe devolverse en buen estado y, si es posible, en su embalaje original.</li>
            <li>Los gastos de envío de la devolución corren a cargo del cliente, salvo que el producto sea defectuoso o llegue dañado.</li>
            <li>Una vez recibido y revisado el producto, te reembolsaremos el importe en un máximo de 14 días, por el mismo medio de pago que usaste en la compra.</li>
          </ul>

          <h3>Imágenes digitales</h3>
          <p>
            Puedes solicitar el reembolso de una compra digital en los <strong>14 días siguientes</strong> a
            la compra, siempre que no hayas descargado el archivo. Si la descarga ya se ha realizado,
            estudiaremos tu caso de forma individual. Si el archivo no se puede abrir, está dañado o no lo
            recibes, te lo reemplazamos o te devolvemos el importe íntegro.
          </p>

          <h3>Desperfectos y roturas de envío</h3>
          <p>
            Si tu pedido llega dañado (marco roto, cristal o metacrilato dañado), contáctanos en las
            primeras 48 h desde la recepción en <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>,
            adjuntando fotografías del producto y de la caja. Te enviaremos una reposición o te
            reembolsaremos el importe, a tu elección, sin coste alguno para ti.
          </p>
        </>
    ),
  },
  'privacy-policy': {
    title: 'Política de privacidad',
    content: (
        <>
          <p>
            En FRAME SOUND Studio respetamos la privacidad de tus datos. La información personal o de envío
            que se solicite se empleará exclusivamente para tramitar tus pedidos, gestionar la logística de
            envío o responder a tus consultas.
          </p>
          <p>
            No venderemos ni cederemos tus datos a terceros con fines comerciales. Conservaremos la
            información el tiempo estrictamente necesario o el que exija la normativa fiscal.
          </p>
          <p>
            Para ejercer tus derechos de acceso, rectificación, supresión u oposición según el RGPD,
            escríbenos a <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> con el asunto PRIVACIDAD.
          </p>
        </>
    ),
  },
  'terms-of-service': {
    title: 'Términos del servicio',
    content: (
        <>
          <p>
            El uso de este portal implica la aceptación de estas condiciones de compra. Todos los cuadros
            se diseñan con una estética inspirada en interfaces de reproductores musicales y se adaptan a
            cada álbum o artista.
          </p>
          <p>
            FRAME SOUND Studio no representa a discográficas, artistas ni a ninguna entidad externa
            mencionada en las descripciones o muestras. Si consideras que algún diseño vulnera tus
            derechos, escríbenos a <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> y lo revisaremos
            y retiraremos si procede.
          </p>
          <p>
            Las condiciones de devolución y reembolso se detallan en nuestra política de devoluciones.
          </p>
        </>
    ),
  },
  'shipping-policy': {
    title: 'Política de envío',
    content: (
        <>
          <p>
            De momento no realizamos envios.
          </p>
        </>
    ),
  },
  'legal-notice': {
    title: 'Aviso legal',
    content: (
        <>
          <p>
            El portal operado bajo la denominación comercial FRAME SOUND Studio tiene por objeto la
            creación y venta de arte personalizado a partir de las peticiones de los visitantes.
          </p>
          <p>
            Las imágenes de muestra son composiciones previas para que los usuarios vean cómo quedará el
            cuadro que recibirán.
          </p>
        </>
    ),
  },
  'contact-info': {
    title: 'Información de contacto',
    content: (
        <>
          <ul>
            <li><strong>Email de atención al cliente:</strong> <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>
            <li><strong>Instagram:</strong> <a href={`https://instagram.com/${INSTAGRAM_HANDLE}`} target="_blank" rel="noreferrer">@{INSTAGRAM_HANDLE}</a></li>
            <li><strong>TikTok:</strong> <a href={`https://tiktok.com/@${TIKTOK_HANDLE}`} target="_blank" rel="noreferrer">@{TIKTOK_HANDLE}</a></li>
            <li><strong>Horario de atención:</strong> 24 h, todos los días</li>
          </ul>
          <p>
            Escríbenos por cualquiera de estos canales para consultas, incidencias, devoluciones o comentarios.
          </p>
          <p>
            <strong>Si nos mencionas en cualquier red social con tu diseño, obtendrás un 10 % de descuento en tu siguiente compra.</strong>
          </p>
          <p>¡Gracias por elegir FRAME SOUND Studio!</p>
        </>
    ),
  },
}

const FOOTER_LINKS = [
  ['refund-policy', 'Devoluciones y reembolsos'],
  ['privacy-policy', 'Política de privacidad'],
  ['terms-of-service', 'Términos del servicio'],
  ['shipping-policy', 'Política de envío'],
  ['contact-info', 'Información de contacto'],
  ['legal-notice', 'Aviso legal'],
]

const inputStyle = {
  padding: '0.8rem',
  borderRadius: '4px',
  border: '1px solid #ddd',
  fontSize: '1rem',
  width: '100%',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
}

const qtyButtonStyle = {
  width: 30,
  height: 30,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#f5f5f5',
  border: '1px solid #ddd',
  cursor: 'pointer',
  borderRadius: '50%',
  fontWeight: 'bold',
}

const badgeStyle = {
  position: 'absolute',
  top: -6,
  right: -8,
  background: '#ef4444',
  color: 'white',
  borderRadius: 999,
  padding: '0.1rem 0.35rem',
  fontSize: '0.65rem',
  fontWeight: 'bold',
  minWidth: 16,
  display: 'flex',
  justifyContent: 'center',
  boxShadow: '0 0 0 2px #fef3c7',
}

const iconButtonStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: '#111827',
  padding: '0.2rem',
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

const isSuccessUrl = () => window.location.search.includes('view=success')

// Lee la compra pendiente SIN modificar nada (es seguro usarla en un inicializador de useState).
function readPendingPurchase() {
  if (!isSuccessUrl()) return null
  const data = readStorage('pendingPurchase', null)
  if (!data) return null
  if (data.album) return { album: data.album, options: data.options }
  if (data.cart?.length > 0) {
    const first = data.cart[0]
    return { album: first.album, options: first.options }
  }
  return null
}

const albumKey = (a) => `${a.artist}-${a.album}-${a.cover}`
const sameAlbum = (a, b) => a.album === b.album && a.cover === b.cover

function sameCartItem(item, album, options) {
  return (
      sameAlbum(item.album, album) &&
      item.options.purchaseType === options.purchaseType &&
      item.options.frameSize === options.frameSize &&
      item.options.frameColor === options.frameColor
  )
}

/* ------------------------------------------------------------------ */
/* Componentes pequeños                                                */
/* ------------------------------------------------------------------ */

function HeartIcon({ filled, size = 18 }) {
  return (
      <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill={filled ? '#ef4444' : 'none'}
          stroke={filled ? 'none' : 'currentColor'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
  )
}

// La tarjeta es un <div role="button"> para poder contener el botón de favorito
// (un <button> dentro de otro <button> es HTML inválido).
function AlbumCard({ sample, isFavorite, onSelect, onToggleFavorite, showPrice = true }) {
  return (
      <div
          className="album-card"
          role="button"
          tabIndex={0}
          onClick={() => onSelect(sample)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onSelect(sample)
            }
          }}
          style={{ position: 'relative', cursor: 'pointer' }}
      >
        <button
            type="button"
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            onClick={(e) => onToggleFavorite(e, sample)}
            onKeyDown={(e) => e.stopPropagation()}
            style={{
              position: 'absolute', top: 10, right: 10, background: 'white', border: 'none',
              borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
        >
          <HeartIcon filled={isFavorite} />
        </button>
        <div className="album-image-wrapper">
          <img src={sample.cover} alt={`${sample.artist} - ${sample.album}`} className="album-image" />
          {sample.isNew && <span className="album-tag">Nuevo</span>}
        </div>
        <div className="album-info">
          <p className="album-artist">{sample.artist}</p>
          <p className="album-title">{sample.album}</p>
          {showPrice && <p className="album-price">Desde 2 €</p>}
        </div>
      </div>
  )
}

function BackLink({ onClick, children = '← Volver' }) {
  return (
      <button type="button" className="back-link" onClick={onClick}>
        {children}
      </button>
  )
}

function QuantityControl({ quantity, onChange, round = true }) {
  const style = round ? qtyButtonStyle : { ...qtyButtonStyle, borderRadius: 4 }
  return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button type="button" aria-label="Quitar una unidad" onClick={() => onChange(-1)} style={style}>-</button>
        <span style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>{quantity}</span>
        <button type="button" aria-label="Añadir una unidad" onClick={() => onChange(1)} style={style}>+</button>
      </div>
  )
}

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */

function App() {
  // Compra pendiente (si volvemos de Stripe). Se lee una sola vez, sin setState en efectos.
  const [pending] = useState(readPendingPurchase)

  const [view, setView] = useState(() => (isSuccessUrl() ? 'success' : 'list'))
  const [activeAlbum, setActiveAlbum] = useState(null)
  const [frameSize, setFrameSize] = useState('30x40')
  const [frameColor, setFrameColor] = useState('negro')
  const [activeArtistFilter, setActiveArtistFilter] = useState('todos')
  const [purchaseType, setPurchaseType] = useState('digital')

  // Formulario "¿No encuentras tu cuadro?"
  const [requestArtist, setRequestArtist] = useState('')
  const [requestAlbum, setRequestAlbum] = useState('')
  const [requestEmail, setRequestEmail] = useState('')

  // Compra directa ("Comprar ahora"): { album, options } o null si se paga la cesta
  const [buyNow, setBuyNow] = useState(null)
  const [checkoutEmail, setCheckoutEmail] = useState('')
  const [checkoutAddress, setCheckoutAddress] = useState('')

  const [favorites, setFavorites] = useState(() => readStorage('favorites', []))
  // Si volvemos de un pago correcto, la cesta empieza vacía
  const [cart, setCart] = useState(() => (isSuccessUrl() ? [] : readStorage('cart', [])))

  /* ----- Persistencia ----- */
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  /* ----- Historial del navegador (sin setState síncrono) ----- */
  useEffect(() => {
    if (isSuccessUrl()) {
      // Limpiamos la compra pendiente y la URL para que un refresco no repita el flujo
      localStorage.removeItem('pendingPurchase')
      window.history.replaceState({ view: 'success' }, '', window.location.pathname)
    } else if (!window.history.state) {
      window.history.replaceState({ view: 'list' }, '')
    }

    const handlePopState = (event) => setView(event.state?.view ?? 'list')
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  /* ----- Navegación ----- */
  function navigate(nextView) {
    setView(nextView)
    window.history.pushState({ view: nextView }, '')
    window.scrollTo(0, 0)
  }

  function goHome() {
    setActiveArtistFilter('todos')
    navigate('list')
  }

  function handleFilterSelect(artistName) {
    setActiveArtistFilter(artistName)
    if (view !== 'list') navigate('list')
  }

  function handleSelectSample(sample) {
    setActiveAlbum(sample)
    navigate('detail')
  }

  const goBack = () => window.history.back()

  /* ----- Favoritos ----- */
  const isFavorite = (album) => favorites.some((f) => sameAlbum(f, album))

  function toggleFavorite(event, album) {
    event.stopPropagation()
    setFavorites((prev) =>
        prev.some((f) => sameAlbum(f, album))
            ? prev.filter((f) => !sameAlbum(f, album))
            : [...prev, album]
    )
  }

  /* ----- Cesta ----- */
  function addToCart(album, options) {
    setCart((prev) => {
      const i = prev.findIndex((it) => sameCartItem(it, album, options))
      if (i !== -1) {
        return prev.map((it, idx) => (idx === i ? { ...it, quantity: it.quantity + 1 } : it))
      }
      return [...prev, { id: crypto.randomUUID(), album, options: { ...options }, quantity: 1 }]
    })
  }

  function updateCartQuantity(id, change) {
    setCart((prev) =>
        prev
            .map((it) => (it.id === id ? { ...it, quantity: it.quantity + change } : it))
            .filter((it) => it.quantity > 0)
    )
  }

  const cartCount = cart.reduce((sum, it) => sum + it.quantity, 0)
  const cartTotal = cart.reduce((sum, it) => sum + PRICES[it.options.purchaseType] * it.quantity, 0)

  /* ----- Checkout ----- */
  // Lo que se está pagando ahora: compra directa o la cesta entera
  const checkoutItems = buyNow
      ? [{ id: 'buy-now', album: buyNow.album, options: buyNow.options, quantity: 1 }]
      : cart
  const checkoutTotal = checkoutItems.reduce(
      (sum, it) => sum + PRICES[it.options.purchaseType] * it.quantity,
      0
  )
  const needsEmail = checkoutItems.some((it) => it.options.purchaseType === 'digital')
  const needsAddress = checkoutItems.some((it) => it.options.purchaseType === 'physical')

  function openCheckoutFromDetail(album, options) {
    setBuyNow({ album, options })
    setCheckoutEmail('')
    setCheckoutAddress('')
    navigate('checkout')
  }

  function openCheckoutFromCart() {
    setBuyNow(null)
    setCheckoutEmail('')
    setCheckoutAddress('')
    navigate('checkout')
  }

  function advanceToPayment() {
    if (needsEmail && !/^\S+@\S+\.\S+$/.test(checkoutEmail.trim())) {
      alert('Introduce un email válido para recibir tu imagen.')
      return
    }
    if (needsAddress && checkoutAddress.trim().length < 10) {
      alert('Introduce tu dirección de envío completa.')
      return
    }
    navigate('payment')
  }

  /* ----- Formulario de solicitud ----- */
  function openContactPage() {
    setRequestArtist('')
    setRequestAlbum('')
    setRequestEmail('')
    navigate('contact')
  }

  async function submitContactRequest() {
    if (!requestArtist.trim() || !requestAlbum.trim() || !requestEmail.trim()) {
      alert('Por favor, rellena el nombre del artista, del álbum y tu email.')
      return
    }

    try {
      const response = await fetch('/api/send-contact-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artist: requestArtist, album: requestAlbum, email: requestEmail }),
      })

      if (response.ok) {
        alert('¡Solicitud enviada! Nos pondremos en contacto contigo pronto.')
        setRequestArtist('')
        setRequestAlbum('')
        setRequestEmail('')
      } else {
        const error = await response.json().catch(() => ({}))
        alert('Error al enviar la solicitud: ' + (error.error || 'Error desconocido'))
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al enviar la solicitud. Inténtalo de nuevo.')
    }
  }

  /* ----- Datos derivados ----- */
  const filteredAlbums =
      activeArtistFilter === 'todos'
          ? SAMPLE_ALBUMS
          : SAMPLE_ALBUMS.filter((a) => a.artist === activeArtistFilter)
  const newAlbums = filteredAlbums.filter((a) => a.isNew)

  const itemInCart = activeAlbum
      ? cart.find((it) => sameCartItem(it, activeAlbum, { purchaseType, frameSize, frameColor }))
      : null

  const successArtist = pending?.album?.artist ?? ''
  const successAlbum = pending?.album?.album ?? ''
  const successOptions = pending?.options ?? null

  const legalPage = LEGAL_PAGES[view]

  const renderCard = (sample, extra = {}) => (
      <AlbumCard
          key={albumKey(sample)}
          sample={sample}
          isFavorite={isFavorite(sample)}
          onSelect={handleSelectSample}
          onToggleFavorite={toggleFavorite}
          {...extra}
      />
  )

  /* ------------------------------------------------------------------ */
  /* Render                                                              */
  /* ------------------------------------------------------------------ */

  return (
      <>
        <div className="top-bar">
          <div className="top-bar-left">ESP | Español</div>
          <div className="top-bar-center">
            OBTÉN AL MOMENTO TU PORTADA DE ÁLBUM FAVORITA
          </div>
          <div
              className="top-bar-right"
              style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', paddingRight: '0.5rem' }}
          >
            <button
                type="button"
                title="Favoritos"
                aria-label="Favoritos"
                style={iconButtonStyle}
                onClick={() => navigate('favorites')}
            >
              <HeartIcon size={22} filled={false} />
              {favorites.length > 0 && <span style={badgeStyle}>{favorites.length}</span>}
            </button>
            <button
                type="button"
                title="Cesta"
                aria-label="Cesta"
                style={iconButtonStyle}
                onClick={() => navigate('cart')}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {cartCount > 0 && <span style={badgeStyle}>{cartCount}</span>}
            </button>
          </div>
        </div>

        <header className="header header-main">
          <div className="logo" onClick={goHome} style={{ cursor: 'pointer' }} title="Volver al inicio">
            <span className="logo-primary">FRAME SOUND</span>
            <span className="logo-secondary">Studio</span>
          </div>
          <nav className="main-nav">
            {['todos', ...ARTISTS].map((artist) => (
                <button
                    key={artist}
                    type="button"
                    className={activeArtistFilter === artist ? 'nav-link nav-link-active' : 'nav-link'}
                    onClick={() => handleFilterSelect(artist)}
                >
                  {artist === 'todos' ? 'Todos' : artist}
                </button>
            ))}
          </nav>
        </header>

        <div className="page">
          {/* ---------------- Lista ---------------- */}
          {view === 'list' && (
              <main>
                <section className="new-section">
                  <div className="section-header">
                    <h3>Novedades</h3>
                    <p>Algunos de los últimos cuadros añadidos a la colección.</p>
                  </div>
                  {newAlbums.length > 0 ? (
                      <div className="album-grid">{newAlbums.map((s) => renderCard(s))}</div>
                  ) : (
                      <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>No hay novedades por el momento.</p>
                  )}
                </section>

                <section className="all-section">
                  <div className="section-header">
                    <h3>Todos los cuadros</h3>
                    <p>Explora toda la colección disponible ahora mismo.</p>
                  </div>
                  <div className="album-grid">{filteredAlbums.map((s) => renderCard(s))}</div>
                </section>
              </main>
          )}

          {/* ---------------- Detalle ---------------- */}
          {view === 'detail' && activeAlbum && (
              <main className="product-page">
                <BackLink onClick={goBack}>← Volver a la colección</BackLink>

                <div className="product-layout">
                  <div className="product-image-panel">
                    <div className="product-image-wrapper">
                      <img
                          src={activeAlbum.cover}
                          alt={`${activeAlbum.artist} - ${activeAlbum.album}`}
                          className="product-image"
                      />
                      <span className="product-watermark">MUESTRA</span>
                    </div>
                    <p className="product-note">
                      Las imágenes online incluyen una marca de agua para proteger el diseño. Tu cuadro
                      físico se entrega sin marca.
                    </p>
                  </div>

                  <div className="product-info">
                    <p className="product-artist">{activeAlbum.artist}</p>
                    <h2 className="product-title">{activeAlbum.album}</h2>
                    <p className="product-subtitle">
                      {purchaseType === 'physical'
                          ? 'Lámina impresa + marco personalizado'
                          : 'Imagen digital de alta calidad'}
                    </p>
                    <p className="product-price">
                      {purchaseType === 'physical' ? 'Desde 24,90 €' : 'Por solo 2 €'}
                    </p>

                    <div className="product-options" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <label className="field" style={{ marginBottom: '0.5rem' }}>
                        <span>Formato de compra</span>
                        <select value={purchaseType} onChange={(e) => setPurchaseType(e.target.value)}>
                          <option value="physical" disabled>Cuadro con marco (físico) - Todavía no disponible</option>
                          <option value="digital">Solo imagen digital</option>
                        </select>
                      </label>

                      {purchaseType === 'physical' && (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
                            <label className="field">
                              <span>Tamaño del marco</span>
                              <select value={frameSize} onChange={(e) => setFrameSize(e.target.value)}>
                                <option value="21x30">21 x 30 cm (A4)</option>
                                <option value="30x40">30 x 40 cm</option>
                                <option value="40x50">40 x 50 cm</option>
                              </select>
                            </label>
                            <label className="field">
                              <span>Color del marco</span>
                              <select value={frameColor} onChange={(e) => setFrameColor(e.target.value)}>
                                <option value="negro">Negro</option>
                                <option value="blanco">Blanco</option>
                                <option value="madera-clara">Madera clara</option>
                                <option value="madera-oscura">Madera oscura</option>
                              </select>
                            </label>
                          </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                      <button
                          type="button"
                          className="primary-button product-buy-button"
                          style={{ flex: 1 }}
                          onClick={() =>
                              openCheckoutFromDetail(activeAlbum, { frameSize, frameColor, purchaseType })
                          }
                      >
                        Comprar ahora
                      </button>

                      {itemInCart ? (
                          <div
                              style={{
                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                padding: '0.8rem 1.5rem', borderRadius: '2rem', border: '1px solid #000',
                              }}
                          >
                            <QuantityControl
                                quantity={itemInCart.quantity}
                                onChange={(change) => updateCartQuantity(itemInCart.id, change)}
                            />
                          </div>
                      ) : (
                          <button
                              type="button"
                              className="secondary-button"
                              style={{
                                flex: 1, padding: '0.8rem 1.5rem', borderRadius: '2rem', border: '1px solid #000',
                                backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 'bold',
                              }}
                              onClick={() => addToCart(activeAlbum, { frameSize, frameColor, purchaseType })}
                          >
                            Añadir a la cesta
                          </button>
                      )}
                    </div>

                    <p className="product-helper">
                      Completarás los datos de {purchaseType === 'physical' ? 'envío' : 'entrega'} en el siguiente paso.
                    </p>
                    <p className="product-helper">
                      Devoluciones en 14 días.{' '}
                      <button
                          type="button"
                          className="footer-link"
                          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline', font: 'inherit', color: 'inherit' }}
                          onClick={() => navigate('refund-policy')}
                      >
                        Ver condiciones
                      </button>
                    </p>
                  </div>
                </div>
              </main>
          )}

          {/* ---------------- Favoritos ---------------- */}
          {view === 'favorites' && (
              <main className="product-page">
                <BackLink onClick={goBack} />
                <div className="section-header" style={{ padding: '2rem 2rem 0' }}>
                  <h3>Tus favoritos</h3>
                  <p>Los cuadros que más te han llamado la atención.</p>
                </div>
                {favorites.length > 0 ? (
                    <div className="album-grid" style={{ padding: '0 2rem 2rem' }}>
                      {favorites.map((s) => renderCard(s, { showPrice: false }))}
                    </div>
                ) : (
                    <p style={{ color: '#6b7280', fontSize: '0.95rem', padding: '0 2rem' }}>
                      Aún no tienes cuadros guardados en favoritos.
                    </p>
                )}
              </main>
          )}

          {/* ---------------- Cesta ---------------- */}
          {view === 'cart' && (
              <main className="product-page">
                <BackLink onClick={goBack} />
                <div className="product-info" style={{ margin: '0 auto', maxWidth: 600, width: '100%', paddingTop: '2rem' }}>
                  <h2 className="product-title">Tu cesta</h2>
                  {cart.length > 0 ? (
                      <div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                          {cart.map((item) => (
                              <div
                                  key={item.id}
                                  style={{ display: 'flex', border: '1px solid #eee', borderRadius: 8, padding: '1rem' }}
                              >
                                <img
                                    src={item.album.cover}
                                    alt={`${item.album.artist} - ${item.album.album}`}
                                    style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4, marginRight: '1rem' }}
                                />
                                <div style={{ flex: 1 }}>
                                  <h4 style={{ margin: '0 0 0.25rem 0' }}>{item.album.album}</h4>
                                  <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>{item.album.artist}</p>
                                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem' }}>
                                    {item.options.purchaseType === 'physical'
                                        ? `Físico: ${item.options.frameSize} / ${item.options.frameColor}`
                                        : 'Imagen digital'}
                                  </p>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                                  <p style={{ margin: 0, fontWeight: 'bold' }}>
                                    {formatPrice(PRICES[item.options.purchaseType] * item.quantity)}
                                  </p>
                                  <QuantityControl
                                      quantity={item.quantity}
                                      round={false}
                                      onChange={(change) => updateCartQuantity(item.id, change)}
                                  />
                                </div>
                              </div>
                          ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', marginBottom: '1rem' }}>
                          <span>Total</span>
                          <strong>{formatPrice(cartTotal)}</strong>
                        </div>

                        <button
                            type="button"
                            className="primary-button product-buy-button"
                            style={{ width: '100%', fontSize: '1.1rem', padding: '0.9rem' }}
                            onClick={openCheckoutFromCart}
                        >
                          Continuar con el pedido
                        </button>
                      </div>
                  ) : (
                      <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>Tu cesta está vacía.</p>
                  )}
                </div>
              </main>
          )}

          {/* ---------------- Checkout ---------------- */}
          {view === 'checkout' && (
              <main className="product-page">
                <BackLink onClick={goBack} />
                <div className="product-info" style={{ margin: '0 auto', maxWidth: 500, width: '100%', paddingTop: '2rem' }}>
                  <h2 className="product-title">Completar pedido</h2>

                  {checkoutItems.length > 0 ? (
                      <>
                        <ul style={{ margin: '0 0 1.5rem', paddingLeft: '1.2rem' }}>
                          {checkoutItems.map((it) => (
                              <li key={it.id}>
                                <strong>{it.album.artist} - {it.album.album}</strong>
                                {it.quantity > 1 ? ` × ${it.quantity}` : ''}
                              </li>
                          ))}
                        </ul>

                        <div className="product-options">
                          {needsEmail && (
                              <label className="field" style={{ gridColumn: '1 / -1' }}>
                                <span>Email de entrega</span>
                                <input
                                    type="email"
                                    placeholder="Tu correo electrónico para recibir la imagen"
                                    value={checkoutEmail}
                                    onChange={(e) => setCheckoutEmail(e.target.value)}
                                    style={inputStyle}
                                />
                              </label>
                          )}
                          {needsAddress && (
                              <label className="field" style={{ gridColumn: '1 / -1' }}>
                                <span>Dirección de envío completa</span>
                                <input
                                    type="text"
                                    placeholder="Calle, número, piso, código postal, ciudad..."
                                    value={checkoutAddress}
                                    onChange={(e) => setCheckoutAddress(e.target.value)}
                                    style={inputStyle}
                                />
                              </label>
                          )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '1.5rem 0 0', fontSize: '1.05rem' }}>
                          <span>Total</span>
                          <strong>{formatPrice(checkoutTotal)}</strong>
                        </div>

                        <button
                            type="button"
                            className="primary-button product-buy-button"
                            style={{ marginTop: '1.5rem', width: '100%', fontSize: '1.1rem', padding: '0.8rem' }}
                            onClick={advanceToPayment}
                        >
                          Continuar al pago
                        </button>
                      </>
                  ) : (
                      <p style={{ color: '#6b7280' }}>No hay nada que pagar. Añade un cuadro a la cesta.</p>
                  )}
                </div>
              </main>
          )}

          {/* ---------------- Pago ---------------- */}
          {view === 'payment' && (
              <main className="product-page">
                <BackLink onClick={goBack} />
                <div className="product-info" style={{ margin: '0 auto', maxWidth: 500, width: '100%', paddingTop: '2rem' }}>
                  <h2 className="product-title">Pago seguro</h2>
                  <p className="product-subtitle" style={{ marginBottom: '2rem' }}>
                    Total a pagar: <strong>{formatPrice(checkoutTotal)}</strong>
                  </p>

                  <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: 8, border: '1px solid #e5e7eb', marginBottom: '1.5rem' }}>
                    {/* Stripe Checkout: el servidor debe calcular el precio con su propia tabla */}
                    <CheckoutButton
                        album={buyNow ? { artist: buyNow.album.artist, album: buyNow.album.album } : null}
                        options={buyNow ? buyNow.options : null}
                        cart={buyNow ? [] : cart}
                        customerEmail={checkoutEmail.trim()}
                        shippingAddress={checkoutAddress.trim()}
                        total={checkoutTotal}
                    />
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                    Puedes devolver tu pedido en 14 días. Consulta las{' '}
                    <button
                        type="button"
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline', font: 'inherit', color: 'inherit' }}
                        onClick={() => navigate('refund-policy')}
                    >
                      condiciones de devolución
                    </button>.
                  </p>
                </div>
              </main>
          )}

          {/* ---------------- Éxito ---------------- */}
          {view === 'success' && (
              <main className="product-page" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }} aria-hidden="true">🎉</div>
                <h2 className="product-title" style={{ fontSize: '2rem', marginBottom: '1rem', color: '#10b981' }}>
                  ¡Pago realizado con éxito!
                </h2>
                <p className="product-subtitle" style={{ maxWidth: 400, margin: '0 auto 2rem' }}>
                  {successArtist
                      ? <>Tu pedido de <strong>{successArtist} - {successAlbum}</strong> está confirmado.</>
                      : 'Tu pedido está confirmado.'}
                  {successOptions?.purchaseType === 'physical'
                      ? ' Nos pondremos en contacto contigo pronto con el número de seguimiento.'
                      : ' Tu imagen digital está lista para descargar.'}
                </p>

                {successOptions?.purchaseType === 'digital' && (
                    <div style={{ marginBottom: '2rem' }}>
                      <a
                          className="primary-button product-buy-button"
                          style={{ display: 'inline-block', marginBottom: '1rem', padding: '1rem 2rem', fontSize: '1.1rem', textDecoration: 'none' }}
                          href={`/api/download/${encodeURIComponent(successArtist || 'Unknown')}/${encodeURIComponent(successAlbum || 'Unknown')}`}
                          download={`${successArtist || 'Unknown'}-${successAlbum || 'Unknown'}.png`}
                      >
                        📥 Descargar imagen
                      </a>
                      <p style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '0.5rem' }}>
                        También recibirás un email con el enlace de descarga en las próximas horas.
                      </p>
                    </div>
                )}

                <button type="button" className="primary-button product-buy-button" onClick={goHome}>
                  Volver al inicio
                </button>
              </main>
          )}

          {/* ---------------- Solicitud ---------------- */}
          {view === 'contact' && (
              <main className="product-page">
                <BackLink onClick={goBack} />
                <div className="product-info" style={{ margin: '0 auto', maxWidth: 500, width: '100%', paddingTop: '2rem' }}>
                  <h2 className="product-title">¿No encuentras tu cuadro?</h2>
                  <p className="product-subtitle" style={{ marginBottom: '2rem' }}>
                    Dinos el artista y álbum que buscas y lo diseñamos para ti.
                  </p>

                  <div className="product-options">
                    <label className="field">
                      <span>Nombre del artista</span>
                      <input type="text" placeholder="Ej. Rosalía" value={requestArtist}
                             onChange={(e) => setRequestArtist(e.target.value)} style={inputStyle} />
                    </label>
                    <label className="field">
                      <span>Nombre del álbum</span>
                      <input type="text" placeholder="Ej. MOTOMAMI" value={requestAlbum}
                             onChange={(e) => setRequestAlbum(e.target.value)} style={inputStyle} />
                    </label>
                    <label className="field">
                      <span>Tu email</span>
                      <input type="email" placeholder="tuemail@ejemplo.com" value={requestEmail}
                             onChange={(e) => setRequestEmail(e.target.value)} style={inputStyle} />
                    </label>
                  </div>

                  <button
                      type="button"
                      className="primary-button product-buy-button"
                      style={{ marginTop: '2rem', width: '100%' }}
                      onClick={submitContactRequest}
                  >
                    Solicitar por email
                  </button>
                </div>
              </main>
          )}

          {/* ---------------- Páginas legales ---------------- */}
          {legalPage && (
              <main className="legal-page">
                <BackLink onClick={goBack} />
                <h2 className="legal-title">{legalPage.title}</h2>
                <div className="legal-content">
                  {legalPage.content}
                  <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#6b7280' }}>
                    Última actualización: octubre de 2026
                  </p>
                </div>
              </main>
          )}

          {!HIDE_CTA_VIEWS.includes(view) && (
              <button type="button" className="floating-cta" onClick={openContactPage}>
                ¿No encuentras el cuadro que buscas?
              </button>
          )}
        </div>

        <footer className="site-footer">
          <div className="footer-socials">
            <a href={`https://instagram.com/${INSTAGRAM_HANDLE}`} target="_blank" rel="noreferrer" className="footer-social-link" title="Instagram">
              Instagram
            </a>
            <a href={`https://tiktok.com/@${TIKTOK_HANDLE}`} target="_blank" rel="noreferrer" className="footer-social-link" title="TikTok">
              TikTok
            </a>
          </div>

          <div className="footer-bottom">
            <ul className="footer-policy-links">
              {FOOTER_LINKS.map(([id, label]) => (
                  <li key={id}>
                    <button
                        type="button"
                        className="footer-link"
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit', color: 'inherit' }}
                        onClick={() => navigate(id)}
                    >
                      {label}
                    </button>
                  </li>
              ))}
            </ul>
            <p className="footer-copyright">
              © 2026, FRAME SOUND Studio. Todos los derechos reservados.
            </p>
          </div>
        </footer>
      </>
  )
}

export default App
