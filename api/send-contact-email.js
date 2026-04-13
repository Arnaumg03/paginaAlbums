import nodemailer from 'nodemailer'

export default async function handler(req, res) {
    // Permitir CORS (opcional)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    try {
        const { artist, album, email } = req.body

        if (!artist || !album || !email) {
            return res.status(400).json({ error: 'Artist, album and email are required' })
        }

        // ⚠️ IMPORTANTE: usa App Password de Gmail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // te llega a ti
            replyTo: email, // 🔥 responder va al cliente
            subject: 'Nueva solicitud de cuadro personalizado',
            html: `
        <h2>Nueva solicitud desde la web</h2>
        <p><strong>Artista:</strong> ${artist}</p>
        <p><strong>Álbum:</strong> ${album}</p>
        <p><strong>Email cliente:</strong> ${email}</p>
      `
        }

        await transporter.sendMail(mailOptions)

        return res.status(200).json({ message: 'Email enviado correctamente' })
    } catch (error) {
        console.error('Error enviando email:', error)
        return res.status(500).json({ error: 'Error enviando email' })
    }
}
