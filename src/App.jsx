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

function App() {
  const CONTACT_EMAIL = 'tu-email@ejemplo.com'
  const [view, setView] = useState('list')
  const [activeAlbum, setActiveAlbum] = useState(null)
  const [frameSize, setFrameSize] = useState('30x40')
  const [frameColor, setFrameColor] = useState('negro')
  const [activeArtistFilter, setActiveArtistFilter] = useState('todos')
  const [purchaseType, setPurchaseType] = useState('physical')

  const [contactArtist, setContactArtist] = useState('')
  const [contactAlbum, setContactAlbum] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactAddress, setContactAddress] = useState('')
  const [contactOptions, setContactOptions] = useState(null)

  // Local storage properties
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites')
    return saved ? JSON.parse(saved) : []
  })
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  function toggleFavorite(event, albumObject) {
    event.stopPropagation()
    // Identificamos el álbum único combinando su título y la URL de su portada, 
    // porque en la base tienes álbumes con el mismo nombre y diseño distinto
    const isFavorited = favorites.some((fav) => fav.album === albumObject.album && fav.cover === albumObject.cover)

    if (isFavorited) {
      setFavorites(favorites.filter(fav => !(fav.album === albumObject.album && fav.cover === albumObject.cover)))
    } else {
      setFavorites([...favorites, albumObject])
    }
  }

  function addToCart(albumObject, options) {
    // Verificamos si ya existe EXACTAMENTE la misma configuración en la cesta
    const existingIndex = cart.findIndex(item =>
      item.album.album === albumObject.album &&
      item.album.cover === albumObject.cover &&
      item.options.purchaseType === options.purchaseType &&
      item.options.frameSize === options.frameSize &&
      item.options.frameColor === options.frameColor
    )

    if (existingIndex !== -1) {
      // Si ya existe, sencillamente sumamos 1 a su cantidad
      const newCart = [...cart]
      newCart[existingIndex].quantity = (newCart[existingIndex].quantity || 1) + 1
      setCart(newCart)
    } else {
      const newItem = {
        id: Date.now(),
        album: albumObject,
        options: { ...options },
        quantity: 1
      }
      setCart([...cart, newItem])
    }
  }

  function updateCartQuantity(id, change) {
    setCart(cart.map(item => {
      if (item.id === id) {
        return { ...item, quantity: item.quantity + change }
      }
      return item
    }).filter(item => item.quantity > 0)) // si la cantidad llega a 0 se elimina
  }

  function removeFromCart(id) {
    setCart(cart.filter(item => item.id !== id))
  }

  function goHome() {
    setView('list')
    setActiveArtistFilter('todos')
    window.history.pushState({ view: 'list' }, '')
  }

  useEffect(() => {
    // Si entramos por primera vez y no hay estado en el historial, definimos el inicial
    if (!window.history.state) {
      window.history.replaceState({ view: 'list' }, '')
    }

    const handlePopState = (event) => {
      if (event.state && event.state.view) {
        setView(event.state.view)
      } else {
        setView('list')
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const sampleAlbums = [
    {
      artist: 'Bad Bunny',
      album: 'Un Verano Sin Ti',
      style: 'colorful',
      cover: badBunnyUnVerano,
      isNew: true,
    },
    {
      artist: 'Bad Bunny',
      album: 'YHLQMDLG',
      style: 'colorful',
      cover: badBunnyYhlqmdlg,
      isNew: true,
    },
    {
      artist: 'Bad Bunny',
      album: 'DEBI TIRAR MAS FOTOS',
      style: 'colorful',
      cover: badBunnyDebiTirarMasFotos1,
      isNew: true,
    },
    {
      artist: 'Bad Bunny',
      album: 'DEBI TIRAR MAS FOTOS',
      style: 'colorful',
      cover: badBunnyDebiTirarMasFotos2,
      isNew: true,
    },
    {
      artist: 'Mora',
      album: 'ESTRELLA',
      style: 'minimal',
      cover: moraEstrella,
    },
    {
      artist: 'Mora',
      album: 'LO MISMO DE SIEMPRE',
      style: 'dark',
      cover: moraLoMismo,
    },
    {
      artist: 'Anuel AA',
      album: 'Emmanuel',
      style: 'dark',
      cover: anuelEmmanuel,
    },
    {
      artist: 'JC Reyes',
      album: 'VIVIR PA QUEDARSE',
      style: 'vintage',
      cover: jcReyesVivir,
    },
    {
      artist: 'Quevedo',
      album: 'BUENAS NOCHES (versión 1)',
      style: 'colorful',
      cover: quevedoBuenasNoches1,
    },
    {
      artist: 'Quevedo',
      album: 'BUENAS NOCHES (versión 2)',
      style: 'colorful',
      cover: quevedoBuenasNoches2,
    },
  ]

  const artists = Array.from(new Set(sampleAlbums.map((album) => album.artist)))

  const filteredAlbums =
    activeArtistFilter === 'todos'
      ? sampleAlbums
      : sampleAlbums.filter((album) => album.artist === activeArtistFilter)

  const newAlbums = filteredAlbums.filter((album) => album.isNew)
  const allAlbums = filteredAlbums

  function handleSelectSample(sample) {
    setActiveAlbum(sample)
    setView('detail')
    window.history.pushState({ view: 'detail' }, '')
  }

  function handleBackToList() {
    window.history.back()
  }

  function openContactPage() {
    setContactArtist('')
    setContactAlbum('')
    setView('contact')
    window.history.pushState({ view: 'contact' }, '')
  }

  function openCheckoutPage(sample, options) {
    setContactArtist(sample.artist)
    setContactAlbum(sample.album)
    setContactOptions(options)
    setContactEmail('')
    setContactAddress('')
    setView('checkout')
    window.history.pushState({ view: 'checkout' }, '')
  }

  function advanceToPayment() {
    setView('payment')
    window.history.pushState({ view: 'payment' }, '')
  }

  function simulateFakePayment() {
    setView('success')
    window.history.pushState({ view: 'success' }, '')
  }

  function submitContactRequest() {
    const subject = encodeURIComponent('Solicitud de nuevo cuadro personalizado')
    const bodyLines = [
      'Hola, no he encontrado el cuadro que busco en la web.',
      '',
      `Artista deseado: ${contactArtist}`,
      `Álbum deseado: ${contactAlbum}`,
    ].filter(Boolean).join('\n')

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${encodeURIComponent(
      bodyLines,
    )}`
  }

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-left">ESP | Español</div>
        <div className="top-bar-center">
          ENVÍO GRATUITO A PARTIR DE 59 € · ENTREGA EN 3–5 DÍAS LABORABLES
        </div>
        <div className="top-bar-right" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            type="button"
            className="top-bar-button"
            onClick={() => {
              setView('favorites')
              window.history.pushState({ view: 'favorites' }, '')
            }}
          >
            🤍 Favoritos ({favorites.length})
          </button>
          <button
            type="button"
            className="top-bar-button"
            onClick={() => {
              setView('cart')
              window.history.pushState({ view: 'cart' }, '')
            }}
          >
            🛒 Cesta ({cart.length})
          </button>
        </div>
      </div>

      <header className="header header-main">
        <div
          className="logo"
          onClick={goHome}
          style={{ cursor: 'pointer' }}
          title="Volver al inicio"
        >
          <span className="logo-primary">SONORA</span>
          <span className="logo-secondary">Studio</span>
        </div>
        <nav className="main-nav">
          <button
            type="button"
            className={
              activeArtistFilter === 'todos'
                ? 'nav-link nav-link-active'
                : 'nav-link'
            }
            onClick={() => setActiveArtistFilter('todos')}
          >
            Todos
          </button>
          {artists.map((artist) => (
            <button
              key={artist}
              type="button"
              className={
                activeArtistFilter === artist
                  ? 'nav-link nav-link-active'
                  : 'nav-link'
              }
              onClick={() => setActiveArtistFilter(artist)}
            >
              {artist}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <button
            type="button"
            className="icon-button"
            aria-label="Buscar álbum"
          >
            <span className="icon-search" />
          </button>
        </div>
      </header>

      <div className="page">
        {view === 'list' && (
          <main>

            <section className="new-section">
              <div className="section-header">
                <h3>Novedades</h3>
                <p>Algunos de los últimos cuadros añadidos a la colección.</p>
              </div>

              {newAlbums.length > 0 ? (
                <div className="album-grid">
                  {newAlbums.map((sample) => (
                    <button
                      key={`new-${sample.artist}-${sample.album}-${sample.cover}`}
                      type="button"
                      className="album-card"
                      onClick={() => handleSelectSample(sample)}
                      style={{ position: 'relative' }}
                    >
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(e, sample)}
                        style={{ position: 'absolute', top: '10px', right: '10px', background: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                      >
                        {favorites.some(fav => fav.album === sample.album && fav.cover === sample.cover) ? '❤️' : '🤍'}
                      </button>
                      <div className="album-image-wrapper">
                        <img
                          src={sample.cover}
                          alt={`${sample.artist} - ${sample.album}`}
                          className="album-image"
                        />
                        {sample.isNew && <span className="album-tag">Nuevo</span>}
                      </div>
                      <div className="album-info">
                        <p className="album-artist">{sample.artist}</p>
                        <p className="album-title">{sample.album}</p>
                        <p className="album-price">Desde 24,90 €</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                  No hay novedades por el momento.
                </p>
              )}
            </section>

            <section className="all-section">
              <div className="section-header">
                <h3>Todos los cuadros</h3>
                <p>Explora toda la colección disponible ahora mismo.</p>
              </div>

              <div className="album-grid">
                {allAlbums.map((sample) => (
                  <button
                    key={`${sample.artist}-${sample.album}-${sample.cover}`}
                    type="button"
                    className="album-card"
                    onClick={() => handleSelectSample(sample)}
                    style={{ position: 'relative' }}
                  >
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(e, sample)}
                      style={{ position: 'absolute', top: '10px', right: '10px', background: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                    >
                      {favorites.some(fav => fav.album === sample.album && fav.cover === sample.cover) ? '❤️' : '🤍'}
                    </button>
                    <div className="album-image-wrapper">
                      <img
                        src={sample.cover}
                        alt={`${sample.artist} - ${sample.album}`}
                        className="album-image"
                      />
                      {sample.isNew && <span className="album-tag">Nuevo</span>}
                    </div>
                    <div className="album-info">
                      <p className="album-artist">{sample.artist}</p>
                      <p className="album-title">{sample.album}</p>
                      <p className="album-price">Desde 24,90 €</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </main>
        )}

        {view === 'detail' && activeAlbum && (
          <main className="product-page">
            <button type="button" className="back-link" onClick={handleBackToList}>
              ← Volver a la colección
            </button>

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
                  Las imágenes online incluyen una marca de agua para proteger el diseño.
                  Tu cuadro físico se entrega sin marca.
                </p>
              </div>

              <div className="product-info">
                <p className="product-artist">{activeAlbum.artist}</p>
                <h2 className="product-title">{activeAlbum.album}</h2>
                <p className="product-subtitle">
                  {purchaseType === 'physical'
                    ? 'Lámina impresa + marco personalizado'
                    : 'Documento digital (JPG) de alta calidad'}
                </p>
                <p className="product-price">
                  {purchaseType === 'physical' ? 'Desde 24,90 €' : 'Por solo 2 €'}
                </p>

                <div className="product-options" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <label className="field" style={{ marginBottom: '0.5rem' }}>
                    <span>Formato de compra</span>
                    <select
                      value={purchaseType}
                      onChange={(event) => setPurchaseType(event.target.value)}
                    >
                      <option value="physical">Cuadro con marco (Físico)</option>
                      <option value="digital">Solo documento digital (JPG)</option>
                    </select>
                  </label>

                  {purchaseType === 'physical' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
                      <label className="field">
                        <span>Tamaño del marco</span>
                        <select
                          value={frameSize}
                          onChange={(event) => setFrameSize(event.target.value)}
                        >
                          <option value="21x30">21 x 30 cm (A4)</option>
                          <option value="30x40">30 x 40 cm</option>
                          <option value="40x50">40 x 50 cm</option>
                        </select>
                      </label>

                      <label className="field">
                        <span>Color del marco</span>
                        <select
                          value={frameColor}
                          onChange={(event) => setFrameColor(event.target.value)}
                        >
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
                      openCheckoutPage(activeAlbum, { frameSize, frameColor, purchaseType })
                    }
                  >
                    Comprar ahora
                  </button>
                  {(() => {
                    const itemInCart = cart.find(item =>
                      item.album.album === activeAlbum.album &&
                      item.album.cover === activeAlbum.cover &&
                      item.options.purchaseType === purchaseType &&
                      item.options.frameSize === frameSize &&
                      item.options.frameColor === frameColor
                    )

                    return itemInCart ? (
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', padding: '0.8rem 1.5rem', borderRadius: '2rem', border: '1px solid #000', backgroundColor: 'transparent' }}>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(itemInCart.id, -1)}
                          style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', border: '1px solid #ddd', cursor: 'pointer', borderRadius: '50%', fontWeight: 'bold' }}
                        >
                          -
                        </button>
                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{itemInCart.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(itemInCart.id, 1)}
                          style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', border: '1px solid #ddd', cursor: 'pointer', borderRadius: '50%', fontWeight: 'bold' }}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="secondary-button"
                        style={{ flex: 1, padding: '0.8rem 1.5rem', borderRadius: '2rem', border: '1px solid #000', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}
                        onClick={() => addToCart(activeAlbum, { frameSize, frameColor, purchaseType })}
                      >
                        Añadir a la cesta
                      </button>
                    )
                  })()}
                </div>
                <p className="product-helper">
                  Completarás los datos de {purchaseType === 'physical' ? 'envío' : 'entrega'} en el siguiente paso.
                </p>
              </div>
            </div>
          </main>
        )}

        {view === 'favorites' && (
          <main className="product-page">
            <button type="button" className="back-link" onClick={handleBackToList}>
              ← Volver
            </button>
            <div className="section-header" style={{ padding: '2rem 2rem 0' }}>
              <h3>Tus Favoritos</h3>
              <p>Aquellos cuadros que más te han llamado la atención.</p>
            </div>
            {favorites.length > 0 ? (
              <div className="album-grid" style={{ padding: '0 2rem 2rem' }}>
                {favorites.map((sample, index) => (
                  <button
                    key={`fav-${sample.artist}-${sample.album}-${index}`}
                    type="button"
                    className="album-card"
                    onClick={() => handleSelectSample(sample)}
                    style={{ position: 'relative' }}
                  >
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(e, sample)}
                      style={{ position: 'absolute', top: '10px', right: '10px', background: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                    >
                      ❤️
                    </button>
                    <div className="album-image-wrapper">
                      <img
                        src={sample.cover}
                        alt={`${sample.artist} - ${sample.album}`}
                        className="album-image"
                      />
                    </div>
                    <div className="album-info">
                      <p className="album-artist">{sample.artist}</p>
                      <p className="album-title">{sample.album}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p style={{ color: '#6b7280', fontSize: '0.95rem', padding: '0 2rem' }}>
                Aún no tienes álbumes guardados en favoritos.
              </p>
            )}
          </main>
        )}

        {view === 'cart' && (
          <main className="product-page">
            <button type="button" className="back-link" onClick={handleBackToList}>
              ← Volver
            </button>
            <div className="product-info" style={{ margin: '0 auto', maxWidth: '600px', width: '100%', paddingTop: '2rem' }}>
              <h2 className="product-title">Tu Cesta</h2>
              {cart.length > 0 ? (
                <div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                    {cart.map((item) => (
                      <div key={item.id} style={{ display: 'flex', border: '1px solid #eee', borderRadius: '8px', padding: '1rem', position: 'relative' }}>
                        <img src={item.album.cover} alt="album" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', marginRight: '1rem' }} />
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 0.25rem 0' }}>{item.album.album}</h4>
                          <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>{item.album.artist}</p>
                          <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem' }}>
                            {item.options.purchaseType === 'physical' ? `Físico: ${item.options.frameSize} / ${item.options.frameColor}` : 'Digital (JPG)'}
                          </p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                          <p style={{ margin: 0, fontWeight: 'bold' }}>{item.options.purchaseType === 'physical' ? '24,90 €' : '2,00 €'} x {item.quantity}</p>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                            <button
                              onClick={() => updateCartQuantity(item.id, -1)}
                              style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', border: '1px solid #ddd', cursor: 'pointer', borderRadius: '4px' }}
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.id, 1)}
                              style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', border: '1px solid #ddd', cursor: 'pointer', borderRadius: '4px' }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="primary-button product-buy-button"
                    style={{ width: '100%', fontSize: '1.1rem', padding: '0.9rem' }}
                    onClick={advanceToPayment}
                  >
                    Proceder al Pago
                  </button>
                </div>
              ) : (
                <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                  Tu cesta está vacía ahora mismo.
                </p>
              )}
            </div>
          </main>
        )}

        {view === 'checkout' && (
          <main className="product-page">
            <button type="button" className="back-link" onClick={() => window.history.back()}>
              ← Volver
            </button>
            <div className="product-info" style={{ margin: '0 auto', maxWidth: '500px', width: '100%', paddingTop: '2rem' }}>
              <h2 className="product-title">Completar pedido</h2>
              <p className="product-subtitle" style={{ marginBottom: '2rem' }}>
                Estás comprando: <strong>{contactArtist} - {contactAlbum}</strong>
              </p>

              <div className="product-options">
                {contactOptions && contactOptions.purchaseType === 'digital' && (
                  <label className="field" style={{ gridColumn: '1 / -1' }}>
                    <span>Email de entrega</span>
                    <input
                      type="email"
                      placeholder="Tu correo electrónico para recibir el JPG..."
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit' }}
                    />
                  </label>
                )}

                {(!contactOptions || contactOptions.purchaseType === 'physical') && (
                  <label className="field" style={{ gridColumn: '1 / -1' }}>
                    <span>Dirección de envío completa</span>
                    <input
                      type="text"
                      placeholder="Calle, Número, Piso, Código Postal, Ciudad..."
                      value={contactAddress}
                      onChange={(e) => setContactAddress(e.target.value)}
                      style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit' }}
                    />
                  </label>
                )}
              </div>

              <button
                type="button"
                className="primary-button product-buy-button"
                style={{ marginTop: '2rem', width: '100%', fontSize: '1.1rem', padding: '0.8rem' }}
                onClick={advanceToPayment}
              >
                Continuar al Pago
              </button>
            </div>
          </main>
        )}

        {view === 'payment' && (
          <main className="product-page">
            <button type="button" className="back-link" onClick={() => window.history.back()}>
              ← Volver
            </button>
            <div className="product-info" style={{ margin: '0 auto', maxWidth: '500px', width: '100%', paddingTop: '2rem' }}>
              <h2 className="product-title">Pasarela de Pago Segura</h2>
              <p className="product-subtitle" style={{ marginBottom: '2rem' }}>
                Total a pagar: <strong>{contactOptions?.purchaseType === 'physical' ? '24,90 €' : '2,00 €'}</strong>
              </p>

              <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '1.5rem' }}>
                <label className="field" style={{ marginBottom: '1rem' }}>
                  <span>Número de tarjeta</span>
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem', width: '100%', boxSizing: 'border-box', fontFamily: 'monospace' }}
                  />
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <label className="field">
                    <span>Caducidad</span>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem', width: '100%', boxSizing: 'border-box' }}
                    />
                  </label>
                  <label className="field">
                    <span>CVC</span>
                    <input
                      type="text"
                      placeholder="123"
                      style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem', width: '100%', boxSizing: 'border-box' }}
                    />
                  </label>
                </div>
              </div>

              <div style={{ backgroundColor: '#fefce8', padding: '1rem', borderRadius: '8px', border: '1px solid #fef08a', color: '#854d0e', fontSize: '0.9rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                Simulación de entorno de pruebas. Ningún cargo real se realizará.
              </div>

              <button
                type="button"
                className="primary-button product-buy-button"
                style={{ width: '100%', fontSize: '1.1rem', padding: '0.9rem', backgroundColor: '#10b981', color: 'white', border: 'none' }}
                onClick={simulateFakePayment}
              >
                Pagar {contactOptions?.purchaseType === 'physical' ? '24,90 €' : '2,00 €'}
              </button>
            </div>
          </main>
        )}

        {view === 'success' && (
          <main className="product-page" style={{ textAlign: 'center', paddingTop: '4rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
            <h2 className="product-title" style={{ fontSize: '2rem', marginBottom: '1rem', color: '#10b981' }}>¡Pago realizado con éxito!</h2>
            <p className="product-subtitle" style={{ maxWidth: '400px', margin: '0 auto 2rem' }}>
              Tu pedido de <strong>{contactArtist} - {contactAlbum}</strong> está confirmado.
              {contactOptions && contactOptions.purchaseType === 'physical'
                ? ' Nos pondremos en contacto contigo pronto con el número de seguimiento.'
                : ' Te enviaremos el documento JPG al correo proporcionado en breve.'}
            </p>
            <button
              type="button"
              className="primary-button product-buy-button"
              onClick={handleBackToList}
            >
              Volver al inicio
            </button>
          </main>
        )}

        {view === 'contact' && (
          <main className="product-page">
            <button type="button" className="back-link" onClick={() => window.history.back()}>
              ← Volver
            </button>
            <div className="product-info" style={{ margin: '0 auto', maxWidth: '500px', width: '100%', paddingTop: '2rem' }}>
              <h2 className="product-title">¿No encuentras tu cuadro?</h2>
              <p className="product-subtitle" style={{ marginBottom: '2rem' }}>
                Dinos el artista y álbum que buscas y lo diseñamos para ti.
              </p>

              <div className="product-options">
                <label className="field">
                  <span>Nombre del artista</span>
                  <input
                    type="text"
                    placeholder="Ej. Rosalía"
                    value={contactArtist}
                    onChange={(e) => setContactArtist(e.target.value)}
                    style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  />
                </label>

                <label className="field">
                  <span>Nombre del álbum</span>
                  <input
                    type="text"
                    placeholder="Ej. MOTOMAMI"
                    value={contactAlbum}
                    onChange={(e) => setContactAlbum(e.target.value)}
                    style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  />
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

        {view !== 'contact' && view !== 'checkout' && view !== 'payment' && view !== 'success' && view !== 'cart' && view !== 'favorites' && (
          <button
            type="button"
            className="floating-cta"
            onClick={openContactPage}
          >
            ¿No encuentras tu cuadro?
          </button>
        )}
      </div>
    </>
  )
}
export default App
