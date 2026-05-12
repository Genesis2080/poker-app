# Context API - Poker App

Documentación de la implementación de Context API para estado global en la aplicación.

---

## Índice

1. [¿Qué es Context API?](#qué-es-context-api)
2. [Estructura del Contexto](#estructura-del-contexto)
3. [Implementación Paso a Paso](#implementación-paso-a-paso)
4. [Consumidores del Contexto](#consumidores-del-contexto)
5. [Casos de Uso](#casos-de-uso)
6. [¿Cuándo usar Context API?](#cuándo-usar-context-api)
7. [Alternativas y Limitaciones](#alternativas-y-limitaciones)

---

## ¿Qué es Context API?

Context API es un sistema de React que permite compartir estado entre componentes sin necesidad de pasar props manualmente por cada nivel del árbol (prop drilling).

### Flujo de datos con Context API

```
AppProvider (contiene el estado global)
  │
  ├── App (consume: isAuthenticated, user, logout)
  │     │
  │     ├── Home (consume: data.sessions, addSession, updateFlashcard)
  │     ├── Hands (consume: data.hands, addHand, updateHand, deleteHand)
  │     ├── Study (consume: data.studyPlan, setData)
  │     └── Login (consume: login, register)
```

Sin Context API, el estado tendría que pasarse así:
```
App (estado global)
  ├── Navbar (recibe user, isAuthenticated, logout como props)
  ├── Home (recibe sessions, addSession como props)
  ├── Hands (recibe hands, addHand como props)
  ├── Study (recibe studyPlan, setData como props)
  └── Login (recibe login, register como props)
```

---

## Estructura del Contexto

### 1. Tipos de datos (`src/types/index.ts`)

```typescript
interface AppData {
  hands: Hand[]           // Manos de póker registradas
  studyPlan: StudyPlanItem[]  // Plan de estudios
  flashcards: Flashcard[] // Flashcards de estudio
  sessions: Session[]     // Sesiones de juego
  stats: AppStats         // Estadísticas calculadas
}

interface AuthUser {
  email: string
  username: string
}
```

### 2. Interfaz del Contexto (`AppContextType`)

El contexto expone:

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `data` | `AppData` | Todos los datos de la aplicación |
| `setData` | `Dispatch<SetStateAction<AppData>>` | Setter directo de datos |
| `user` | `AuthUser \| null` | Usuario autenticado o null |
| `isAuthenticated` | `boolean` | Si hay sesión activa |
| `loading` | `boolean` | Si está cargando la sesión |
| `login` | `(email, password) => Promise<string \| null>` | Inicia sesión |
| `register` | `(email, password, username) => Promise<string \| null>` | Registra usuario |
| `logout` | `() => Promise<void>` | Cierra sesión |
| `addHand` | `(hand: Hand) => void` | Añade mano |
| `updateHand` | `(id, updates) => void` | Actualiza mano |
| `deleteHand` | `(id) => void` | Elimina mano |
| `addStudyItem` | `(item) => void` | Añade item de estudio |
| `toggleStudyItem` | `(id) => void` | Marca/desmarca item |
| `addFlashcard` | `(card) => void` | Añade flashcard |
| `updateFlashcard` | `(id, updates) => void` | Actualiza flashcard |
| `addSession` | `(session) => void` | Añade sesión |
| `deleteSession` | `(id) => void` | Elimina sesión |

---

## Implementación Paso a Paso

### Paso 1: Crear el Contexto (`src/context/AppContext.tsx`)

```typescript
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'

// 1. Definir la interfaz del contexto (qué datos y funciones expone)
interface AppContextType {
  data: AppData
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<string | null>
  logout: () => Promise<void>
  addSession: (session: Session) => void
  deleteSession: (id: string) => void
  // ... más funciones
}

// 2. Crear el contexto con valor inicial undefined
const AppContext = createContext<AppContextType | undefined>(undefined)
```

### Paso 2: Implementar el Provider

```typescript
export function AppProvider({ children }: { children: ReactNode }) {
  // Estado global
  const [data, setData] = useState<AppData>(loadData)  // Lazy initialization
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Efectos secundarios (persistencia, auth)
  useEffect(() => {
    supabase.auth.getSession().then(...)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(...)
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    localStorage.setItem('practice-app-data', JSON.stringify(data))
  }, [data])

  // Funciones del contexto (memorizadas para evitar re-renders)
  const addSession = useCallback((session: Session) => {
    setData((prev) => {
      const newSessions = [session, ...prev.sessions]
      return { ...prev, sessions: newSessions, stats: { ... } }
    })
  }, [])

  // 3. Proveer el contexto a los hijos
  return (
    <AppContext.Provider value={{ data, user, isAuthenticated, login, logout, addSession, ... }}>
      {children}
    </AppContext.Provider>
  )
}
```

### Paso 3: Hook personalizado para consumir

```typescript
export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
```

### Paso 4: Envolver la aplicación

```tsx
// App.tsx
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

### Paso 5: Consumir en componentes

```tsx
// Home.tsx
const { data, addSession, deleteSession } = useApp()

// Login.tsx
const { login, register } = useApp()

// Hands.tsx
const { data, addHand, updateHand, deleteHand } = useApp()
```

---

## Consumidores del Contexto

| Componente | Archivo | Datos que consume |
|------------|---------|-------------------|
| `AppContent` | `App.tsx:9` | `isAuthenticated, user, logout, loading` |
| `Login` | `Login.tsx:6` | `login, register` |
| `Home` | `Home.tsx:11` | `data, addSession, deleteSession, updateFlashcard` |
| `Study` | `Study.tsx:15` | `data, setData` |
| `Hands` | `Hands.tsx:19` | `data, addHand, updateHand, deleteHand` |

Cada componente solo consume lo que necesita, no el contexto completo:

```tsx
// Solo consume sesiones
const { data, addSession } = useApp()

// Solo consume manos
const { data, addHand, updateHand } = useApp()

// Solo consume auth
const { isAuthenticated, user, logout } = useApp()
```

---

## Casos de Uso

### 1. Autenticación Global

El estado de autenticación se comparte entre todos los componentes:

```tsx
// App.tsx - decide qué mostrar según auth
const { isAuthenticated, loading } = useApp()
if (loading) return <Loading />
if (!isAuthenticated) return <LoginPage />

// Navbar - muestra usuario o botón login
const { user, logout } = useApp()
{isAuthenticated ? (
  <span>{user.username} <button onClick={logout}>Salir</button>
) : (
  <Link to="/login">Iniciar Sesión</Link>
)}
```

### 2. Persistencia Automática

Los datos se guardan en localStorage automáticamente:

```tsx
useEffect(() => {
  localStorage.setItem('practice-app-data', JSON.stringify(data))
}, [data])
```

Sin necesidad de que cada componente maneje su propia persistencia.

### 3. Operaciones de Datos Centralizadas

Todas las mutaciones de datos pasan por el mismo Provider:

```tsx
// addSession - centraliza la lógica de añadir sesión Y actualizar stats
const addSession = useCallback((session: Session) => {
  setData((prev) => {
    const newSessions = [session, ...prev.sessions]
    const roi = ((totalWon - totalInvested) / totalInvested) * 100
    return {
      ...prev,
      sessions: newSessions,
      stats: { ...prev.stats, totalSessions: newSessions.length, roi }
    }
  })
}, [])
```

El Home llama a `addSession(session)` y automáticamente se actualizan las estadísticas en toda la app.

---

## ¿Cuándo usar Context API?

### ✅ Usa Context API cuando:

| Situación | Ejemplo |
|-----------|---------|
| **Estado global necesario en múltiples componentes** | Autenticación, tema, idioma |
| **Datos que rara vez cambian** | Usuario logueado, config de la app |
| **Evitar prop drilling profundo** | Pasar datos de App → Navbar → UserMenu → Avatar |
| **Estado compartido entre rutas** | Datos que persisten al navegar entre Home/Hands/Study |
| **Lógica de negocio centralizada** | Operaciones CRUD con efectos secundarios (actualizar stats al añadir sesión) |

### ❌ NO uses Context API cuando:

| Situación | Alternativa |
|-----------|-------------|
| **Estado que cambia muy frecuentemente** (ej: cada frame) | `useRef` + eventos, o estado local |
| **Estado local a un solo componente** | `useState` en el componente |
| **Datos que solo usan 2-3 componentes cercanos** | Props normales (prop drilling de 1-2 niveles es aceptable) |
| **Rendimiento crítico con muchos consumidores** | Zustand, Jotai, o estado local con selectores |
| **Datos de formularios temporales** | `useForm` hook (estado local) |

### Regla general:

> Si el estado se necesita en 3+ componentes de diferentes ramas del árbol, y no cambia a >60fps, Context API es la solución correcta.

---

## Alternativas y Limitaciones

### Limitaciones

- **Re-renders**: Todos los consumidores se re-renderizan cuando CAMBIA EL VALOR DEL CONTEXTO (no solo el dato que consumen)
- **Solución**: Separar contextos (AuthContext, DataContext, UIContext) para aislar cambios

### Alternativas

| Alternativa | Cuándo usarla |
|-------------|---------------|
| **Props** | Datos que bajan 1-2 niveles |
| **Composición** | Pasar componentes como children para evitar prop drilling |
| **Zustand / Jotai** | Estado global con selectores precisos (evita re-renders) |
| **React Query / SWR** | Datos del servidor con caché |
| **Redux** | Estado global muy complejo con middleware |

### Nuestra arquitectura:

```
AppProvider (AuthContext + DataContext combinados)
  ├── Autenticación (user, login, register, logout)
  ├── Datos globales (hands, sessions, studyPlan, flashcards)
  ├── Mutaciones (addSession, deleteHand, updateFlashcard, etc.)
  └── Persistencia (localStorage + Supabase Auth)
```

Para esta aplicación, un solo contexto es suficiente porque:
- Los datos cambian con poca frecuencia (acciones del usuario)
- Todos los componentes necesitan datos y/o funciones del contexto
- La simplicidad de un solo contexto supera el beneficio marginal de separarlo

---

**Última actualización**: Mayo 2026
