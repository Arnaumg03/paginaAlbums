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

  const sampleAlbums = [
    {
      artist: 'Bad Bunny',
      album: 'Un Verano Sin Ti',
      style: 'colorful',
      cover: badBunnyUnVerano,
    },
    {
      artist: 'Bad Bunny',
      album: 'YHLQMDLG',
      style: 'colorful',
      cover: badBunnyYhlqmdlg,
    },
    {
      artist: 'Bad Bunny',
      album: 'DEBI TIRAR MAS FOTOS',
      style: 'colorful',
      cover: badBunnyDebiTirarMasFotos1,
    },
    {
      artist: 'Bad Bunny',
      album: 'DEBI TIRAR MAS FOTOS',
      style: 'colorful',
      cover: badBunnyDebiTirarMasFotos2,
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
    <div className="page">
      <header className="header">
        <div className="brand">
          <span className="brand-mark">BF</span>
          <div>
            <h1>BeatFrames · Tienda de cuadros de álbumes</h1>
            <p>Decora tu casa con portadas de tus discos favoritos, listas para colgar.</p>
          </div>
        </div>
      </header>

      {view === 'list' && (
        <main>
          <section className="hero">
            <div>
              <h2>Cuadros premium de tus álbumes favoritos</h2>
              <p>
                Elige entre nuestros diseños de ejemplo o pídeme un cuadro totalmente
                personalizado con el álbum que quieras.
              </p>
              <ul className="hero-list">
                <li>Impresión en alta calidad en formato A4.</li>
                <li>Opciones de marco en distintos tamaños y colores.</li>
                <li>Perfecto para regalar o decorar tu estudio.</li>
              </ul>
            </div>
            <div className="hero-highlight">
              <p className="hero-badge">Colección limitada</p>
              <p className="hero-price">Desde 24,90 €</p>
            </div>
          </section>

          <section className="gallery-section">
            <div className="section-header">
              <h3>Colección destacada</h3>
              <p>
                Haz clic en cualquiera de estos cuadros para ver los detalles, elegir el
                marco y solicitar tu pedido.
              </p>
            </div>

            <div className="album-grid">
              {sampleAlbums.map((sample) => (
                <button
                  key={`${sample.artist}-${sample.album}`}
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

          <section className="cta-section">
            <h2>¿Quieres un cuadro de otro álbum?</h2>
            <p>
              Si te gustaría un cuadro con otro artista o disco, mándame un mensaje con los
              detalles y te preparo un diseño personalizado.
            </p>
            <button
              type="button"
              className="primary-button"
              onClick={() => handleContact(null)}
            >
              Pedir cuadro personalizado
            </button>
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
                Las imágenes online incluyen una marca de agua para proteger el diseño. Tu
                cuadro físico se entrega sin marca.
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
    </div>
  )
}

export default App
