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
        <div className="top-bar-right">
          <button type="button" className="top-bar-button">
            Ir a la caja
          </button>
        </div>
      </div>

      <header className="header header-main">
        <div className="logo">
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
                    >
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
                  >
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

                <button
                  type="button"
                  className="primary-button product-buy-button"
                  onClick={() =>
                    openCheckoutPage(activeAlbum, { frameSize, frameColor, purchaseType })
                  }
                >
                  Comprar
                </button>
                <p className="product-helper">
                  Completarás los datos de {purchaseType === 'physical' ? 'envío' : 'entrega'} en el siguiente paso.
                </p>
              </div>
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

        {view !== 'contact' && view !== 'checkout' && view !== 'payment' && view !== 'success' && (
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
