import { useState } from 'react'
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
  }

  function handleBackToList() {
    setView('list')
    setActiveAlbum(null)
  }

  function handleContact(sample, options) {
    const subject = encodeURIComponent('Pedido cuadro personalizado de álbum')
    const bodyLines = [
      'Hola, quiero un cuadro personalizado.',
      '',
      sample ? `Ejemplo que me gusta: ${sample.artist} - ${sample.album}` : '',
      '',
      options ? `Tamaño de marco: ${options.frameSize}` : '',
      options ? `Color de marco: ${options.frameColor}` : '',
      '',
      'Artista deseado:',
      'Álbum deseado:',
    ].join('\n')

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

          {newAlbums.length > 0 && (
            <section className="new-section">
              <div className="section-header">
                <h3>Novedades</h3>
                <p>Algunos de los últimos cuadros añadidos a la colección.</p>
              </div>

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
            </section>
          )}

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
                <p className="product-subtitle">Lámina A4 + marco personalizado</p>
                <p className="product-price">Desde 24,90 €</p>

                <div className="product-options">
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

                <button
                  type="button"
                  className="primary-button product-buy-button"
                  onClick={() =>
                    handleContact(activeAlbum, { frameSize, frameColor })
                  }
                >
                  Continuar al pago por email
                </button>
                <p className="product-helper">
                  Te responderé con los pasos de pago y los detalles de envío según tus
                  preferencias.
                </p>
              </div>
            </div>
          </main>
        )}

        <button
          type="button"
          className="floating-cta"
          onClick={() => handleContact(null)}
        >
          Pedir cuadro personalizado
        </button>
      </div>
    </>
  )
}

export default App
