# Diseño de Arquitectura - Poker App

## 1. Estructura de Componentes Principales

### Jerarquía de Componentes
```
App.tsx (Configuración de rutas y providers)
├── AppProvider (Context API - Estado global)
├── BrowserRouter
│   ├── Navbar (Navegación)
│   └── Routes
│       ├── / → Home.tsx
│       │   ├── StatsOverview (Estadísticas generales)
│       │   └── QuickActions (Accesos rápidos)
│       ├── /hands → Hands.tsx
│       │   ├── HandList (Lista de manos)
│       │   ├── HandForm (Registro/edición)
│       │   └── HandViewer (Visualizador de mano)
│       └── /study → Study.tsx
│           ├── StreetSection (Sección por calle)
│           │   └── TopicRow (Fila de tema)
│           ├── GeneralSection (Temas generales)
│           └── Sidebar
│               ├── ProgressBar (Barra de progreso)
│               ├── SearchInput (Búsqueda)
│               ├── CategoryFilter (Filtro por categoría)
│               └── ProgressByStreet (Progreso por calle)
```

### Componentes Reutilizables (`src/components/`)
- **`UI.tsx`**:
  - `PageHeader`: Encabezado de página con título y subtítulo
  - `Badge`: Etiqueta de categoría con colores
  - `Button`: Botón reutilizable (futuro)
  - `Input`: Input reutilizable (futuro)
  - `Modal`: Para formularios (futuro)

---

## 2. Gestión de Estado

### Context API (`src/context/AppContext.tsx`)

**Estado Global (`AppData`)**:
```typescript
interface AppData {
  hands: Hand[]              // Manos registradas
  studyPlan: StudyPlanItem[]  // Plan de estudios
  flashcards: Flashcard[]      // Cartas de memoria
  stats: AppStats            // Estadísticas derivadas
}
```

**Acciones Disponibles**:
- `addHand(hand)` - Añadir nueva mano
- `updateHand(id, updates)` - Actualizar mano existente
- `deleteHand(id)` - Eliminar mano
- `toggleStudyItem(id)` - Marcar/desmarcar tema completado
- `addFlashcard(card)` - Añadir flashcard
- `updateFlashcard(id, updates)` - Actualizar flashcard

### Persistencia
- **Sin backend**: Todos los datos se guardan en `localStorage`
- **Clave**: `practice-app-data`
- **Serialización**: JSON.stringify/parse automático
- **Efecto**: `useEffect` se activa en cada cambio de `data`

---

## 3. Diseño de Backend/API

### ⚠️ DECISIÓN: SIN BACKEND

La aplicación funciona **100% en el cliente** (browser):
- ✅ No hay servidor propio
- ✅ No hay base de datos externa
- ✅ No hay endpoints REST
- ✅ Datos guardados localmente en el dispositivo del usuario

### ¿Por qué no hay backend?
1. **Aplicación personal**: Cada usuario tiene sus propios datos
2. **Privacidad**: Las manos de póker son datos sensibles
3. **Simplicidad**: localStorage es suficiente para las prácticas
4. **Costo**: Evita hosting de base de datos

### Esquema de Datos Persistidos (localStorage)

```typescript
// Clave: 'practice-app-data'
{
  "hands": [
    {
      "id": "uuid-1",
      "date": "2026-05-06",
      "position": "BTN",
      "result": "win",
      "heroHand": "AhKd",
      "stakes": "1/2",
      "tableName": "Table 1",
      "notes": "Good steal attempt",
      "tags": ["steal", "3bet"],
      "heroStack": 200,
      "potSize": 15,
      "potWon": 25
    }
  ],
  "studyPlan": [
    {
      "id": "pf1",
      "topic": "Ranges de opening",
      "description": "Estudiar rangos...",
      "street": "preflop",
      "category": "estrategia",
      "completed": false,
      "priority": "high"
    }
  ],
  "flashcards": [
    {
      "id": "fc1",
      "question": "¿Qué hacer con AKo en BTN?",
      "answer": "Open por 2.5BB...",
      "category": "preflop",
      "difficulty": 0.3,
      "interval": 1,
      "easeFactor": 2.5,
      "nextReview": 1715000000000,
      "reviews": 0
    }
  ],
  "stats": {
    "totalHands": 50,
    "winRate": 55.2,
    "vpip": 22.5,
    "pfr": 18.3,
    "threeBet": 8.5,
    "cbet": 65.0
  }
}
```

---

## 4. Diagrama de Flujo de Datos

### Arquitectura Actual (Sin Backend)
```
┌─────────────────────────────────────────────────────┐
│                   NAVEGADOR (Cliente)                │
│                                                     │
│  ┌──────────────┐       ┌──────────────────┐      │
│  │  Components  │──────▶│  AppContext     │      │
│  │  (Pages)     │       │  (Estado)       │      │
│  └──────┬───────┘       └────────┬─────────┘      │
│         │                      │                 │
│         │ (Lectura/escritura) │                 │
│         ▼                      ▼                 │
│  ┌──────────────┐       ┌──────────────────┐      │
│  │  localStorage │◀─────│  useEffect      │      │
│  │  (Persist.)  │       │  (Auto-guardado)│      │
│  └──────────────┘       └──────────────────┘      │
│                                                     │
└─────────────────────────────────────────────────────┘
         │
         │ (Deploy estático)
         ▼
┌──────────────────┐
│   VERCEL CDN   │  ← Solo archivos estáticos (HTML, JS, CSS)
│   (Frontend)    │
└──────────────────┘
```

### Flujo de una Acción (ej. Toggle Study Item)
```
Usuario hace click en checkbox
         │
         ▼
TopicRow (componente)
         │
         ▼
toggleItem(id) ← Study.tsx
         │
         ▼
setData(prev => ({
  ...prev,
  studyPlan: prev.studyPlan.map(item =>
    item.id === id ? { ...item, completed: !item.completed } : item
  )
})) ← AppContext.tsx
         │
         ▼
useEffect(() => {
  localStorage.setItem('practice-app-data', JSON.stringify(data))
}, [data]) ← Se guarda automáticamente
         │
         ▼
localStorage actualizado
         │
         ▼
Re-render con nuevo estado
         │
         ▼
ProgressBar se actualiza (porque studyArray cambió)
```

---

## 5. Decisiones de Arquitectura

### ✅ Decisiones Tomadas
1. **Context API sobre Redux/Zustand**:
   - Razón: Proyecto pequeño, no necesita gestor de estado complejo
   - Beneficio: Menos dependencias, más simple

2. **localStorage sobre IndexedDB**:
   - Razón: Datos estructurados y ligeros (<5MB)
   - Beneficio: API simple, sincronización automática

3. **Tailwind CSS sobre CSS Modules**:
   - Razón: Desarrollo rápido, consistencia
   - Beneficio: Menos archivos CSS, utilidades predefinidas

4. **TypeScript con verbatimModuleSyntax**:
   - Razón: Tipado estricto, mejor DX
   - Beneficio: Errores atrapados en compilación

5. **Vite sobre CRA/Next.js**:
   - Razón: Build más rápido, configuración mínima
   - Beneficio: HMR instantáneo, soporte moderno

### ⚠️ Limitaciones Actuales
- **Sin sincronización**: Los datos están atados al navegador
- **Sin cuentas de usuario**: No hay login/registro
- **Sin respaldo en nube**: Si se borra localStorage, se pierden datos
- **Sin acceso desde otros dispositivos**: Cada navegador tiene sus propios datos

### 🔮 Futuro: Si se requiere Backend
```
┌─────────────┐    HTTP    ┌─────────────┐    ORM     ┌─────────────┐
│   React    │──────────▶│  API REST   │──────────▶│  Database  │
│  (Vite)   │  (fetch)  │  (Express)  │  (Prisma)  │  (Postgres) │
└─────────────┘           └─────────────┘           └─────────────┘
                              │
                              ▼
                     ┌─────────────┐
                     │  Supabase   │ (Alternativa BaaS)
                     │  (Firebase) │
                     └─────────────┘
```

**Endpoints que se necesitarían**:
- `GET /api/hands` - Listar manos
- `POST /api/hands` - Crear mano
- `PUT /api/hands/:id` - Actualizar mano
- `DELETE /api/hands/:id` - Eliminar mano
- `GET /api/study-plan` - Obtener plan
- `PATCH /api/study-plan/:id` - Toggle completado
- `GET /api/flashcards/due` - Flashcards pendientes
- `POST /api/flashcards/:id/review` - Registrar revisión

---

## 6. Estructura de Datos por Componente

### Home.tsx
**Datos necesarios**: `stats` (derivados de `hands`)
```typescript
const { totalHands, winRate, vpip, pfr } = data.stats
```

### Study.tsx
**Datos necesarios**: `studyPlan` (array) + cálculos de progreso
```typescript
const studyArray = data.studyPlan || []
const completed = studyArray.filter(i => i.completed).length
const percentage = (completed / studyArray.length) * 100
```

### Hands.tsx (Futuro)
**Datos necesarios**: `hands` + cálculo de estadísticas
```typescript
const hands = data.hands || []
const stats = {
  totalHands: hands.length,
  winRate: calculateWinRate(hands),
  vpip: calculateVPIP(hands),
  // ...
}
```

---

## 7. Resumen de Tecnologías

| Capa | Tecnología | Propósito |
|------|-----------|----------|
| **Frontend** | React 19 | UI components |
| **Build** | Vite 8 | Bundling, dev server |
| **Estilos** | Tailwind CSS 4 | Utility-first CSS |
| **Routing** | React Router DOM 7 | Navegación |
| **Estado** | Context API | Estado global |
| **Persistencia** | localStorage | Almacenamiento local |
| **Tipos** | TypeScript 5 | Tipado estático |
| **Deploy** | Vercel | Hosting estático |
| **Linting** | ESLint | Calidad de código |

---

**Última actualización**: Mayo 2026
