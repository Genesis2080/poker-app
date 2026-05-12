# Deployment

La aplicación se despliega en **Vercel** usando el plan Hobby (gratuito).

## Arquitectura

```
Vercel
├── Frontend (static) → https://poker-app.vercel.app/
│   └── Build: vite build → dist/
└── API (serverless) → https://poker-app.vercel.app/api/*
    └── api/index.ts → Express app → serverless function
```

- El frontend y la API comparten **el mismo dominio** (misma origin)
- No hay necesidad de CORS en producción
- El `api/` directorio es detectado automáticamente por Vercel como serverless function

---

## 1. Prerrequisitos

- Cuenta en [Vercel](https://vercel.com) (GitHub login)
- Repositorio en GitHub (o GitLab/Bitbucket)
- Proyecto en [Supabase](https://supabase.com) (para auth)

---

## 2. Variables de entorno

Configurar en **Vercel Dashboard → Project → Settings → Environment Variables**:

| Variable | Valor | Ejemplo |
|---|---|---|
| `VITE_SUPABASE_URL` | URL de tu proyecto Supabase | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Anon key de Supabase | `eyJhbGciOi...` |
| `VITE_API_URL` | URL de la API (dejar vacío para prod) | *(no establecer)* |

En producción, `VITE_API_URL` usa el valor por defecto `/api` (mismo dominio).  
Solo se necesita para desarrollo local (apunta a `http://localhost:3001/api`).

---

## 3. Despliegue automático (Git)

1. Ir a [Vercel Dashboard → New Project](https://vercel.com/new)
2. Importar el repositorio de GitHub
3. Framework preset: **Vite** (detectado automáticamente)
4. Build command: `npm run build` (por defecto)
5. Output directory: `dist` (por defecto)
6. Install command: `npm install`
7. Añadir las **Environment Variables** de Supabase
8. Click **Deploy**

Vercel detecta automáticamente:
- El frontend Vite (build output en `dist/`)
- Las serverless functions en `api/` (Node.js con Express)

---

## 4. Despliegue manual (CLI)

```bash
# Login (solo primera vez)
npx vercel login

# Deploy a preview
npx vercel --yes

# Deploy a producción
npx vercel --prod --yes

# Con token CI/CD
npx vercel --prod --token=$VERCEL_TOKEN --yes
```

---

## 5. Verificación post-deploy

```powershell
# Probar la API
Invoke-WebRequest -Uri https://poker-app.vercel.app/api/flashcards -UseBasicParsing
# → 200, array de 10 flashcards

Invoke-WebRequest -Uri https://poker-app.vercel.app/api/sessions -UseBasicParsing
# → 200, array vacío []

# Probar creación
$body = '{"date":"2026-05-12","modality":"cash","buyIn":50,"cashOut":120,"timePlayedMinutes":90}'
Invoke-WebRequest -Uri https://poker-app.vercel.app/api/sessions -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
# → 201, sesión creada con UUID
```

---

## 6. Limitaciones

### 6a. Datos en memoria

El backend usa un **store en memoria** (`server/src/data/store.ts`).  
En Vercel (serverless), cada invocación puede ir a una instancia diferente.

**Consecuencias:**
- Los datos se pierden entre `cold starts` (varias horas sin uso)
- Dos requests concurrentes pueden ver estados distintos

**Solución:** Conectar a una base de datos (PostgreSQL, SQLite, etc.)  
Para un MVP/demo, el store en memoria es suficiente.

### 6b. Serverless timeouts

Vercel Hobby plan tiene timeout de **10 segundos** para serverless functions.  
Las operaciones CRUD actuales son mucho más rápidas (<100ms), sin impacto.

---

## 7. Estructura de archivos para Vercel

```
.
├── api/
│   └── index.ts         ← Serverless function (re-exporta Express app)
├── server/
│   └── src/
│       ├── app.ts       ← Express app (sin app.listen)
│       ├── index.ts     ← Local dev (con app.listen)
│       ├── routes/      ← Routers
│       ├── controllers/ ← Handlers
│       ├── services/    ← Lógica de negocio
│       ├── middleware/  ← Validación + errores
│       └── data/        ← Store en memoria + seed
├── src/
│   ├── api/
│   │   └── client.ts   ← Cliente tipado (fetch)
│   └── ...             ← Frontend React
├── dist/                ← Build output (Vite)
├── vercel.json          ← Configuración Vercel
└── package.json         ← Raíz (frontend + server deps)
```

---

## 8. Notas

- `.env` con `VITE_SUPABASE_*` está en `.gitignore` (no subir a git)
- Las variables de entorno en Vercel reemplazan a las del `.env`
- El archivo `api/index.ts` es ignorado en desarrollo local (se usa `npm run dev:server`)
- Para desarrollo, el frontend se conecta a `localhost:3001/api` vía `VITE_API_URL`
