# Poker App

Aplicación de estudio de póker con gestión de sesiones, manos, flashcards y plan de estudios.

## 🌐 URLs

- **Frontend:** [https://poker-app.vercel.app](https://poker-app.vercel.app) (pendiente de deploy)
- **API:** `/api` (mismo dominio, serverless function)

## 🚀 Stack

- **Frontend:** React 19 + TypeScript + Vite 8 + Tailwind CSS 4
- **Backend:** Node.js + Express 5 + TypeScript (Vercel Serverless)
- **Auth:** Supabase Auth (email + password)
- **Deploy:** Vercel (frontend + API serverless)

## 📦 Instalación

```bash
git clone <repo-url>
cd poker-app

# Instalar frontend + server deps
npm install
cd server && npm install && cd ..

# Variables de entorno
cp .env.example .env  # Editar con tus credenciales Supabase
```

## 🏃 Desarrollo

```bash
# Terminal 1 — Backend (Express en puerto 3001)
npm run dev:server

# Terminal 2 — Frontend (Vite en puerto 5173)
npm run dev
```

## 📁 Estructura

```
api/                    → Vercel serverless function entry point
server/src/
  app.ts                → Express app (exportada para Vercel)
  index.ts              → Entry point local (app.listen)
  routes/               → Express routers
  controllers/          → Request handlers
  services/             → Business logic
  middleware/           → Validation (zod) + error handler
  data/                 → In-memory store + seed data
src/
  api/client.ts         → API client tipado (fetch)
  context/AppContext.tsx → Estado global con carga vía API
  components/           → UI components (AsyncHandler, etc.)
  pages/                → Home, Hands, Study, Login, NotFound
  hooks/                → useForm, useCalculation
docs/                   → Documentación
```

## 📚 Documentación

- [API Endpoints](docs/api.md) — Contrato REST
- [API Client](docs/api-client.md) — Capa de red y estados
- [Formularios](docs/forms.md) — Formularios controlados
- [Deployment](docs/deployment.md) — Despliegue en Vercel
- [Testing](docs/testing.md) — Pruebas manuales
