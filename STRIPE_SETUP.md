# Guía de Configuración de Stripe

## ⚠️ Problemas Corregidos

1. **Claves de Stripe mixtas**: Tenías una clave pública LIVE pero una secreta TEST
2. **Price IDs vacíos**: Los placeholders de precios estaban sin configurar
3. **API no funcional**: El servidor no estaba correctamente configurado para servir la API

## ✅ Configuración Correcta

### 1. Actualizar el archivo `.env.local`

Reemplaza los placeholders con tus valores reales:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... # Tu clave pública TEST (o LIVE si está en producción)
STRIPE_SECRET_KEY=sk_test_...           # Tu clave secreta TEST (debe ser del mismo ambiente)
PRICE_ID_PHYSICAL=price_...              # ID del producto físico
PRICE_ID_DIGITAL=price_...               # ID del producto digital
```

### 2. Obtener tus claves de Stripe

1. Ve a [Stripe Dashboard](https://dashboard.stripe.com)
2. Ve a **Developers → API Keys**
3. Copia:
   - **Publishable Key** → VITE_STRIPE_PUBLISHABLE_KEY
   - **Secret Key** → STRIPE_SECRET_KEY

⚠️ **IMPORTANTE**: Las claves deben ser del mismo ambiente (ambas TEST o ambas LIVE)

### 3. Crear los Prices en Stripe

1. Ve a **Products** en Stripe Dashboard
2. Crea un nuevo producto llamado "Álbum Físico"
3. Añade un price de 24,90 € (copiar el ID: `price_...`)
4. Crea otro producto "Álbum Digital"
5. Añade un price de 2,00 € (copiar el ID: `price_...`)

### 4. Instalar dependencias

```bash
npm install
```

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

Esto iniciará:
- **Frontend**: http://localhost:3000 (Vite)
- **API (serverless)**: http://localhost:3000/api/create-checkout-session

## 🔍 Verificar que funciona

1. Abre http://localhost:3000
2. Haz clic en "Comprar"
3. Deberías ser redirigido a Stripe Checkout
4. Usa tarjeta de prueba: `4242 4242 4242 4242` (mes/año futuros, cualquier CVC)

## 🐛 Troubleshooting

### Error: "Price IDs not configured"
→ Verifica que `PRICE_ID_PHYSICAL` y `PRICE_ID_DIGITAL` están en `.env.local`

### Error: "Stripe not configured on server"
→ Verifica que `STRIPE_SECRET_KEY` está en `.env.local`

### Error: "Stripe no está configurado correctamente"
→ Verifica que `VITE_STRIPE_PUBLISHABLE_KEY` está en `.env.local` y comienza con `pk_`

### La API no responde
→ Ejecuta `npm run dev` (no `npm run dev:vite`). El comando debe ejecutar Netlify Dev que sirve las funciones.

## 📝 Estructura de archivos

```
netlify/functions/
└── create-checkout-session.js    # API serverless
.env.local                         # Variables de entorno (NO subir a Git)
.env.example                       # Plantilla de .env.local
netlify.toml                       # Configuración de Netlify
```

## 🚀 Para producción

1. Usa claves LIVE de Stripe (pk_live_, sk_live_)
2. Despliega en Netlify: `npm run build` genera la build
3. Las serverless functions se despliegan automáticamente

