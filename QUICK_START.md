esta es la # 🎵 Página de Álbumes - Guía Rápida de Stripe

## ¿Qué se corrigió?

✅ **API correctamente configurada** - Ahora usa Netlify Functions  
✅ **Mejor manejo de errores** - Mensajes de error más claros  
✅ **Validación de claves de Stripe** - Detecta configuraciones incompletas  
✅ **Compatibilidad con claves TEST y LIVE**  

## 🚀 Para ejecutar ahora

### Opción 1: Con Netlify Dev (RECOMENDADO)
```bash
npm run dev
```
Esto inicia tanto el frontend como la API en http://localhost:3000

### Opción 2: Solo frontend (sin API)
```bash
npm run dev:vite
```
Frontend en http://localhost:5173 (pero los pagos NO funcionarán)

## 📋 Checklist de Configuración

- [ ] Crear cuenta en https://stripe.com
- [ ] Obtener claves API en https://dashboard.stripe.com/apikeys
- [ ] Crear 2 productos en Stripe Dashboard (físico y digital)
- [ ] Actualizar `.env.local` con:
  - `VITE_STRIPE_PUBLISHABLE_KEY` (pk_test_...)
  - `STRIPE_SECRET_KEY` (sk_test_...)
  - `PRICE_ID_PHYSICAL` (price_...)
  - `PRICE_ID_DIGITAL` (price_...)

## 🧪 Probar pagos

**Tarjeta de prueba de Stripe:**
- Número: `4242 4242 4242 4242`
- Fecha: Mes/año futuros (ej: 12/26)
- CVC: Cualquier número (ej: 123)

## ❓ ¿Dónde están los archivos nuevos?

```
netlify/functions/create-checkout-session.js  ← API
netlify.toml                                   ← Configuración de Netlify
.env.example                                   ← Plantilla de env
STRIPE_SETUP.md                                ← Guía detallada
```

## 🔗 Próximos pasos

1. Actualiza `.env.local` con tus claves
2. Ejecuta `npm run dev`
3. Prueba un pago con la tarjeta 4242...
4. Verifica el pago en Stripe Dashboard

¿Necesitas ayuda? Revisa `STRIPE_SETUP.md` para instrucciones detalladas.

