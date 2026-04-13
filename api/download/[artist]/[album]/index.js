/* eslint-env node */
/* global process */
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { artist, album } = req.query

    if (!artist || !album) {
      return res.status(400).json({ error: 'Parámetros artist y album requeridos' })
    }

    // Aquí deberías tener lógica para encontrar la imagen correcta
    // Por simplicidad, servimos una imagen de ejemplo
    const imagePath = path.join(__dirname, '..', '..', '..', '..', 'fotosAlbumsProva', '13.png') // Ejemplo

    // Verificar que el archivo existe
    const fs = await import('fs')
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: 'Imagen no encontrada' })
    }

    // Configurar headers para descarga
    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Content-Disposition', `attachment; filename="${artist}-${album}.png"`)

    // Enviar el archivo
    const stream = fs.createReadStream(imagePath)
    stream.pipe(res)
  } catch (err) {
    console.error('Error en descarga:', err)
    res.status(500).json({ error: 'Error al descargar la imagen' })
  }
}
