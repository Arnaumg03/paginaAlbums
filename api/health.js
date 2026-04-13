/* eslint-env node */
/* global process */

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  res.json({
    status: 'ok',
    stripe: process.env.STRIPE_SECRET_KEY ? 'configured' : 'not configured',
    email: (process.env.EMAIL_USER && process.env.EMAIL_PASS) ? 'configured' : 'not configured',
    priceIds: {
      physical: process.env.PRICE_ID_PHYSICAL || 'not set',
      digital: process.env.PRICE_ID_DIGITAL || 'not set'
    },
    webhook: process.env.STRIPE_WEBHOOK_SECRET ? 'configured' : 'not configured'
  })
}
