/* eslint-env node */
/* global process */
import nodemailer from 'nodemailer'

export const handler = async (event) => {
  // Manejo de CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'OK' })
    }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    let body
    try {
      body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
    } catch (e) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid JSON in request body' })
      }
    }

    const { artist, album } = body

    if (!artist || !album) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Artist and album are required' })
      }
    }

    // Configurar el transporter de nodemailer
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // framesoundstudio@gmail.com
        pass: process.env.EMAIL_PASS // app password
      }
    })

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'framesoundstudio@gmail.com',
      subject: 'Solicitud de nuevo cuadro personalizado',
      text: `Hola, no he encontrado el cuadro que busco en la web.

Artista deseado: ${artist}
Álbum deseado: ${album}`
    }

    await transporter.sendMail(mailOptions)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Email sent successfully' })
    }
  } catch (err) {
    console.error('send-contact-email error:', err)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || 'Unknown error' })
    }
  }
}
