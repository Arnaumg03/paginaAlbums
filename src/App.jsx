import { useState } from 'react'
import './App.css'

function App() {
  const [artist, setArtist] = useState('')
  const [album, setAlbum] = useState('')
  const [style, setStyle] = useState('minimal')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [status, setStatus] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()

    if (!artist.trim() || !album.trim()) {
      setStatus({
        type: 'error',
        message: 'Pon al menos el artista y el álbum.',
      })
      return
    }

    setIsSending(true)
    setStatus(null)

    try {
      // Ejemplo de cómo sería la llamada real:
      //
      // const response = await fetch('http://localhost:8000/generate-poster', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ artist, album, style, email, notes }),
      // })
      //
      // if (!response.ok) throw new Error('Error al generar el póster')
      //
      // const blob = await response.blob()
      // const url = URL.createObjectURL(blob)
      // window.open(url, '_blank')

      await new Promise((resolve) => setTimeout(resolve, 1000))

      setStatus({
        type: 'success',
        message:
          'Petición preparada. Cuando conectes el backend de Python, aquí se generará el PDF/imagen automáticamente.',
      })
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          'Ha habido un problema al enviar la petición. Revisa el backend de Python cuando lo tengas configurado.',
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="page">
      <header className="header">
        <div className="brand">
          <span className="brand-mark">A4</span>
          <div>
            <h1>Cuadros de música personalizados</h1>
            <p>
              Genera una hoja A4 con tu artista y álbum favoritos lista para
              imprimir y enmarcar.
            </p>
          </div>
        </div>
        <nav className="nav">
          <a href="#formulario">Pedir cuadro</a>
          <a href="#como-funciona">Cómo funciona</a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div>
            <h2>Elige un artista, un álbum y crea tu póster A4</h2>
            <p>
              Esta web recoge los datos y se los pasa a tu script de Python que
              genera la hoja A4 lista para imprimir.
            </p>
            <ul className="hero-list">
              <li>Introduce artista, álbum y estilo del cuadro.</li>
              <li>Tu script de Python genera el diseño en tamaño A4.</li>
              <li>Imprimes la hoja y la metes en un marco estándar.</li>
            </ul>
            <a className="primary-button" href="#formulario">
              Rellenar el formulario
            </a>
          </div>
          <div className="hero-highlight">
            <p className="hero-badge">Formato A4 listo para marco</p>
            <p className="hero-price">Perfecto para regalos musicales</p>
          </div>
        </section>

        <section id="formulario" className="form-section">
          <div className="section-header">
            <h3>Datos para tu cuadro</h3>
            <p>
              Rellena la información y después tu backend de Python generará el
              archivo final.
            </p>
          </div>

          <form className="poster-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label className="field">
                <span>Artista *</span>
                <input
                  type="text"
                  placeholder="Ej: Radiohead"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  required
                />
              </label>

              <label className="field">
                <span>Álbum *</span>
                <input
                  type="text"
                  placeholder="Ej: OK Computer"
                  value={album}
                  onChange={(e) => setAlbum(e.target.value)}
                  required
                />
              </label>

              <label className="field">
                <span>Estilo del cuadro</span>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                >
                  <option value="minimal">Minimalista</option>
                  <option value="dark">Oscuro</option>
                  <option value="colorful">Colorido</option>
                  <option value="vintage">Vintage</option>
                </select>
              </label>

              <label className="field">
                <span>Email (opcional)</span>
                <input
                  type="email"
                  placeholder="Para enviarte el archivo generado"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </div>

            <label className="field">
              <span>Notas adicionales (opcional)</span>
              <textarea
                rows={3}
                placeholder="Texto que quieras añadir, colores preferidos, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>

            <div className="form-footer">
              <button className="primary-button" type="submit" disabled={isSending}>
                {isSending ? 'Enviando datos…' : 'Enviar datos al generador'}
              </button>
              <p className="form-helper">
                De momento esta demo sólo simula el envío. Cuando conectes el
                backend de Python, aquí se llamará a tu script.
              </p>
            </div>

            {status && (
              <p
                className={
                  status.type === 'success' ? 'status status-success' : 'status status-error'
                }
              >
                {status.message}
              </p>
            )}
          </form>
        </section>

        <section id="como-funciona" className="info-section">
          <h3>Cómo conectarlo con tu código de Python</h3>
          <ol className="steps-list">
            <li>
              Crea un pequeño servidor en Python (por ejemplo con FastAPI o Flask) con
              un endpoint <code>/generate-poster</code> que reciba{' '}
              <code>artist</code>, <code>album</code>, <code>style</code>, etc.
            </li>
            <li>
              Dentro de ese endpoint llama a tu función actual que genera la hoja A4
              y devuelve el PDF o la imagen.
            </li>
            <li>
              En este React, sustituye el bloque comentado del <code>fetch</code> por
              la URL real de tu servidor Python (por ejemplo{' '}
              <code>http://localhost:8000/generate-poster</code>).
            </li>
          </ol>
        </section>
      </main>

      <footer className="footer">
        <p>
          © {new Date().getFullYear()} Cuadros de música personalizados. Integrado con
          tu generador en Python.
        </p>
      </footer>
    </div>
  )
}

export default App
