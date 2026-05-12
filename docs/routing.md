# Sistema de Rutas - Poker App

Documentación de la configuración de React Router para la navegación de la aplicación.

---

## Índice

1. [Estructura de Rutas](#estructura-de-rutas)
2. [Configuración](#configuración)
3. [Navegación](#navegación)
4. [Ruta 404](#ruta-404)
5. [Protección de Rutas](#protección-de-rutas)
6. [React Router en Detalle](#react-router-en-detalle)
7. [Buenas Prácticas](#buenas-prácticas)

---

## Estructura de Rutas

```
/              → Home (página principal)
/hands         → Hands (manos de póker)
/study         → Study (plan de estudios)
/login         → Login (autenticación)
/*             → NotFound (página 404)
```

### Árbol de navegación

```
AppProvider
  └── BrowserRouter
        └── AppContent
              ├── Navbar (siempre visible)
              │     ├── Logo → /
              │     ├── Home → /
              │     ├── Hands → /hands
              │     ├── Study → /study
              │     └── Login/Logout → /login
              │
              └── Routes (contenido dinámico)
                    ├── /          → Home.tsx
                    ├── /hands     → Hands.tsx
                    ├── /study     → Study.tsx
                    ├── /login     → Login.tsx
                    └── *          → NotFound.tsx
```

---

## Configuración

### Ubicación: `src/App.tsx`

```tsx
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  )
}
```

### Tabla de Rutas

| Ruta | Componente | Archivo | Propósito |
|------|------------|---------|-----------|
| `/` | `Home` | `src/pages/Home.tsx` | Dashboard principal con sesiones, stats, flashcards |
| `/hands` | `Hands` | `src/pages/Hands.tsx` | Registro y análisis de manos jugadas |
| `/study` | `Study` | `src/pages/Study.tsx` | Plan de estudio por calles |
| `/login` | `Login` | `src/pages/Login.tsx` | Inicio de sesión / registro |
| `*` | `NotFound` | `src/pages/NotFound.tsx` | Página 404 para rutas no existentes |

### Definición de Rutas

```tsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/hands" element={<Hands />} />
  <Route path="/study" element={<Study />} />
  <Route path="/login" element={<Login />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

---

## Navegación

### NavLink con estilo activo

Usamos `NavLink` en lugar de `Link` para resaltar la ruta activa:

```tsx
const linkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm transition-colors ${isActive ? 'text-white font-medium' : 'text-gray-400 hover:text-white'}`

<NavLink to="/" end className={linkClass}>Home</NavLink>
<NavLink to="/hands" className={linkClass}>Hands</NavLink>
<NavLink to="/study" className={linkClass}>Study</NavLink>
```

- `end` en `/`: evita que coincida con todas las rutas (ya que `/` es prefijo de todas)
- `isActive`: React Router pasa automáticamente si la ruta coincide

### Navegación programática

Usamos `useNavigate` para redirigir después de acciones:

```tsx
// Login.tsx - redirigir al home tras login exitoso
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  
  const handleSubmit = async () => {
    const err = await login(email, password)
    if (!err) navigate('/')  // Redirigir al home
  }
}
```

### Navegación declarativa

Usamos `Link` y `NavLink` para enlaces:

```tsx
// Home.tsx - botón que navega a login
<Link to="/login" className="text-blue-400 hover:text-blue-300">
  Iniciar Sesión
</Link>

// NotFound.tsx - volver al home
<Link to="/" className="btn-primary">
  Volver al Home
</Link>
```

---

## Ruta 404

### Componente: `src/pages/NotFound.tsx`

```tsx
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="text-8xl mb-4">🃏</div>
      <h1 className="text-4xl font-bold text-gray-200 mb-2">404</h1>
      <p className="text-gray-400 mb-8">Esta página no existe en la baraja</p>
      <Link to="/" className="btn-primary">
        Volver al Home
      </Link>
    </div>
  )
}
```

- Se renderiza para cualquier ruta no definida gracias a `path="*"`
- Debe ser el último `Route` dentro de `Routes`
- Incluye un enlace para volver al home

---

## Protección de Rutas

### Sin autenticación obligatoria

Actualmente el login es **opcional**. No hay rutas protegidas porque:
- Los datos se guardan en localStorage (no en servidor)
- La app es funcional sin login
- El login solo añade personalización (nombre de usuario)

### Cómo implementar protección en el futuro

Si se necesitara proteger rutas, se haría así:

```tsx
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useApp()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

<Route path="/hands" element={
  <ProtectedRoute><Hands /></ProtectedRoute>
} />
```

O con un layout que redirige:

```tsx
function AppContent() {
  const { isAuthenticated, loading } = useApp()
  
  if (loading) return <Loading />
  if (!isAuthenticated) return <Login />
  
  return ( /* contenido normal */ )
}
```

---

## React Router en Detalle

### Componentes utilizados

| Componente | Propósito | Ejemplo |
|------------|-----------|---------|
| `BrowserRouter` | Provee el sistema de rutas basado en URL | `<BrowserRouter><App /></BrowserRouter>` |
| `Routes` | Contenedor de rutas (solo renderiza una) | `<Routes><Route ... /></Routes>` |
| `Route` | Define una ruta y su componente | `<Route path="/hands" element={<Hands />} />` |
| `NavLink` | Link con estado activo | `<NavLink to="/" end>Home</NavLink>` |
| `Link` | Enlace de navegación simple | `<Link to="/login">Login</Link>` |
| `useNavigate` | Navegación programática | `navigate('/')` |
| `useLocation` | Acceder a la URL actual | `const location = useLocation()` |

### Flujo de navegación

```
Usuario hace clic en <NavLink to="/hands">
  → React Router intercepta el evento (sin recargar la página)
  → Actualiza la URL en el navegador: /hands
  → Busca en <Routes> la primera coincidencia de path
  → Encuentra <Route path="/hands" element={<Hands />} />
  → Renderiza <Hands /> en el lugar de <Routes>
  → NavLink detecta isActive=true y aplica la clase activa
```

---

## Buenas Prácticas

| Práctica | Por qué |
|----------|---------|
| Usar `NavLink` con `isActive` | Feedback visual claro de la ruta actual |
| `end` en la ruta raíz `/` | Evita que coincida "Home" cuando estás en `/hands` |
| Ruta `*` al final de `Routes` | React Router evalúa en orden, `*` captura todo lo no definido |
| `BrowserRouter` en el nivel más alto | Toda la app tiene acceso al enrutador |
| `useNavigate` para redirecciones | Navegación programática sin recargar página |
| Componente por página | Cada página en su propio archivo (`src/pages/`) |

---

**Última actualización**: Mayo 2026
