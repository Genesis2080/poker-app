# Guía de Hooks - Poker App

Guía completa de todos los hooks nativos y personalizados utilizados en la aplicación.

---

## Índice

1. [Hooks Nativos de React](#hooks-nativos-de-react)
   - [useState](#usestate)
   - [useEffect](#useeffect)
   - [useMemo](#usememo)
   - [useCallback](#usecallback)
2. [Hooks Personalizados](#hooks-personalizados)
   - [useForm](#useform)
   - [useToggle](#usetoggle)
   - [useLocalStorage](#uselocalstorage)
   - [useCalculation](#usecalculation)
   - [useOptimizedCallback](#useoptimizedcallback)
3. [Dónde se usa cada Hook](#dónde-se-usa-cada-hook)
4. [Patrones de Uso en la App](#patrones-de-uso-en-la-app)
5. [Buenas Prácticas](#buenas-prácticas)

---

## Hooks Nativos de React

### useState

**Propósito**: Gestionar estado local en componentes funcionales.

**Firma**:
```typescript
const [state, setState] = useState<Type>(initialValue)
```

**Uso en la app**:
- `AppContext.tsx`: Estado global de datos y autenticación
- `Home.tsx`: Estado del modal, filtros, flashcards
- `Study.tsx`: Filtros, búsqueda, items expandidos
- `Hands.tsx`: Filtros, búsqueda, modal, mano expandida
- `Login.tsx`: Email, contraseña, modo login/register, errores
- Custom hooks: `useForm`, `useToggle`, `useLocalStorage`

**Ejemplo**:
```tsx
// AppContext - estado global de datos
const [data, setData] = useState<AppData>(loadData)

// Home - estado local de UI
const [isModalOpen, setIsModalOpen] = useState(false)
const [modality, setModality] = useState<GameModality>('cash')
```

**Notas**:
- Usa lazy initialization para cargar datos de localStorage antes del render: `useState<AppData>(loadData)`
- Usa el updater funcional `setData(prev => ...)` para evitar depender del estado actual

---

### useEffect

**Propósito**: Ejecutar efectos secundarios (sincronización con APIs, localStorage, subscripciones).

**Firma**:
```typescript
useEffect(() => {
  // efecto
  return () => { /* cleanup */ }
}, [dependencies])
```

**Uso en la app**:
- `AppContext.tsx`: Restaurar sesión de Supabase, guardar datos en localStorage
- `useLocalStorage.tsx`: Sincronizar estado con localStorage

**Ejemplo**:
```tsx
// AppContext - restaurar sesión al montar
useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session?.user) setUser(toAuthUser(session.user))
    setLoading(false)
  })

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) setUser(toAuthUser(session.user))
    else setUser(null)
  })

  return () => subscription.unsubscribe()
}, [])

// AppContext - guardar datos en localStorage en cada cambio
useEffect(() => {
  localStorage.setItem('practice-app-data', JSON.stringify(data))
}, [data])
```

**Notas**:
- El array vacío `[]` ejecuta el efecto solo al montar/desmontar
- El cleanup `return () => subscription.unsubscribe()` previene memory leaks
- El efecto con `[data]` como dependencia se ejecuta en cada cambio de datos

---

### useMemo

**Propósito**: Memorizar valores calculados costosos para evitar recalcularlos en cada render.

**Firma**:
```typescript
const memoizedValue = useMemo(() => {
  return expensiveCalculation(a, b)
}, [a, b])
```

**Uso en la app**:
- `Study.tsx`: Cálculos de progreso por calle, filtros, búsqueda
- `Hands.tsx`: Filtrado y ordenación de manos
- `Home.tsx` y `Hands.tsx` (via `useCalculation`): Estadísticas de sesiones

**Ejemplo**:
```tsx
// Study.tsx - filtrar y ordenar items solo cuando cambian los datos
const filteredStudyArray = useMemo(() => {
  let filtered = studyArray
  if (filter !== 'all') filtered = filtered.filter(i => i.category === filter)
  if (search.trim()) {
    const q = search.toLowerCase()
    filtered = filtered.filter(i =>
      i.topic.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
    )
  }
  return filtered
}, [studyArray, filter, search])

// Home.tsx via useCalculation - estadísticas de sesiones
const stats = useCalculation(() => {
  const totalInvested = sessions.reduce((sum, s) => sum + s.buyIn, 0)
  const roi = totalInvested > 0 ? ((totalWon - totalInvested) / totalInvested) * 100 : 0
  // ... más cálculos
  return { totalInvested, roi, chartData, ... }
}, [data.sessions, filterModality])
```

**Notas**:
- Es clave para rendimiento cuando hay listas grandes o cálculos complejos
- No abuses de `useMemo` para operaciones simples
- `useCalculation` es un wrapper que mejora la legibilidad

---

### useCallback

**Propósito**: Memorizar funciones para evitar que se creen en cada render, previniendo re-renders innecesarios en componentes hijos.

**Firma**:
```typescript
const memoizedFn = useCallback(() => {
  doSomething(a, b)
}, [a, b])
```

**Uso en la app**:
- `AppContext.tsx`: Todas las funciones del contexto están memorizadas (`addHand`, `addSession`, `deleteSession`, `login`, `logout`, etc.)
- `useToggle.tsx`: `toggle`, `turnOn`, `turnOff`, `setValue`
- `useForm.tsx`: `handleChange`, `handleBlur`, `submitForm`, etc.

**Ejemplo**:
```tsx
// AppContext - funciones del contexto memorizadas
const addSession = useCallback((session: Session) => {
  setData((prev) => {
    const newSessions = [session, ...prev.sessions]
    const totalInvested = newSessions.reduce((sum, s) => sum + s.buyIn, 0)
    const totalWon = newSessions.reduce((sum, s) => sum + s.cashOut, 0)
    const roi = totalInvested > 0 ? ((totalWon - totalInvested) / totalInvested) * 100 : 0
    return {
      ...prev,
      sessions: newSessions,
      stats: { ...prev.stats, totalSessions: newSessions.length, totalInvested, totalWon, roi }
    }
  })
}, [])

// useForm - manejadores de eventos memorizados
const handleChange = useCallback((field: keyof T, value: any) => {
  setValues(prev => ({ ...prev, [field]: value }))
  setIsDirty(true)
  setErrors(prev => ({ ...prev, [field]: undefined }))
}, [])
```

**Notas**:
- Es **fundamental** en contextos: sin `useCallback`, cada render crea nuevas funciones, causando que TODOS los consumidores del contexto se re-rendericen
- Combinado con `React.memo` en componentes hijos, previene renders innecesarios
- Las funciones que usan el updater funcional (`setData(prev => ...)`) pueden tener `[]` como dependencias

---

## Hooks Personalizados

### useForm

**Propósito**: Gestión completa de formularios con validación, errores, estado sucio y envío.

**Ubicación**: `src/hooks/useForm.tsx`

**Firma**:
```typescript
const form = useForm<T>(
  initialValues,     // Valores iniciales del formulario
  validationRules,    // Reglas de validación [{ field, rule }]
  onSubmit           // Callback al enviar formulario válido
)
```

**Retorna**:
| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `values` | `T` | Valores actuales |
| `errors` | `Partial<Record<keyof T, string>>` | Errores por campo |
| `isDirty` | `boolean` | Si se ha modificado algún campo |
| `isValid` | `boolean` | Si no hay errores activos |
| `handleChange` | `(field, value) => void` | Cambia valor y limpia error |
| `handleBlur` | `(field) => void` | Valida al salir del campo |
| `submitForm` | `() => void` | Valida todo y ejecuta onSubmit |

**Hooks usados internamente**: `useState`, `useCallback`

**Ejemplo de uso** (Home.tsx):
```tsx
const { values, errors, handleChange, handleBlur, submitForm } = useForm(
  { date: today, buyIn: '', cashOut: '', timePlayedMinutes: '' },
  [
    { field: 'buyIn', rule: (v) => !v ? 'El dinero invertido es requerido' : null },
    { field: 'cashOut', rule: (v) => !v ? 'El dinero ganado es requerido' : null },
  ],
  (vals) => {
    addSession({ id: Date.now().toString(), buyIn: parseFloat(vals.buyIn), ... })
    setIsModalOpen(false)
  }
)
```

---

### useToggle

**Propósito**: Manejar estados booleanos con métodos explícitos.

**Ubicación**: `src/hooks/useToggle.tsx`

**Firma**:
```typescript
const { isOn, toggle, turnOn, turnOff, setValue } = useToggle(initialValue?: boolean)
```

**Retorna**:
| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `isOn` | `boolean` | Estado actual |
| `toggle` | `() => void` | Cambia al valor opuesto |
| `turnOn` | `() => void` | Fuerza `true` |
| `turnOff` | `() => void` | Fuerza `false` |
| `setValue` | `(value: boolean) => void` | Establece valor específico |

**Hooks usados internamente**: `useState`, `useCallback` (todas las funciones están memorizadas)

---

### useLocalStorage

**Propósito**: Estado persistido en localStorage con sincronización automática.

**Ubicación**: `src/hooks/useLocalStorage.tsx`

**Firma**:
```typescript
const { value, setValue, remove } = useLocalStorage<T>(key, initialValue)
```

**Retorna**:
| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `value` | `T` | Valor actual (tipado genérico) |
| `setValue` | `(value: T \| ((prev: T) => T)) => void` | Actualiza y persiste |
| `remove` | `() => void` | Elimina y resetea a valor inicial |

**Hooks usados internamente**: `useState` (con lazy initialization), `useEffect`

---

### useCalculation

**Propósito**: Wrapper de `useMemo` para cálculos costosos con sintaxis más limpia.

**Ubicación**: `src/hooks/index.tsx`

**Firma**:
```typescript
const result = useCalculation(calculate, deps)
```

**Ejemplo**:
```tsx
const stats = useCalculation(() => {
  return {
    totalInvested: sessions.reduce((sum, s) => sum + s.buyIn, 0),
    roi: ...,
    chartData: ...
  }
}, [sessions])
```

**Hook interno**: `useMemo` (es un wrapper directo)

---

### useOptimizedCallback

**Propósito**: Wrapper de `useCallback` con tipado preservado.

**Ubicación**: `src/hooks/index.tsx`

**Firma**:
```typescript
const memoizedFn = useOptimizedCallback(fn, deps)
```

**Hook interno**: `useCallback` (es un wrapper directo)

---

## Dónde se usa cada Hook

| Archivo | useState | useEffect | useMemo | useCallback | Custom Hooks |
|---------|----------|-----------|---------|-------------|--------------|
| `AppContext.tsx` | ✅ data, user, loading | ✅ localStorage, auth | ❌ | ✅ Todas las funciones | ❌ |
| `Home.tsx` | ✅ Modal, filtros, flashcards | ❌ | ✅ via useCalculation | ❌ | `useForm`, `useCalculation` |
| `Study.tsx` | ✅ Filtro, búsqueda, expandido | ❌ | ✅ Progreso, filtros | ❌ | ❌ |
| `Hands.tsx` | ✅ Modal, filtros, expandido | ❌ | ✅ Filtrado de manos | ❌ | `useForm`, `useCalculation` |
| `Login.tsx` | ✅ Email, password, error | ❌ | ❌ | ❌ | ❌ |
| `App.tsx` | ❌ | ❌ | ❌ | ❌ | ❌ |
| `useForm.tsx` | ✅ values, errors, touched | ❌ | ❌ | ✅ handleChange, handleBlur, etc. | ❌ |
| `useToggle.tsx` | ✅ isOn | ❌ | ❌ | ✅ toggle, turnOn, turnOff | ❌ |
| `useLocalStorage.tsx` | ✅ value | ✅ sync | ❌ | ❌ | ❌ |

---

## Patrones de Uso en la App

### 1. Contexto con useCallback (AppContext)

Todas las funciones del contexto están envueltas en `useCallback(fn, [])` porque:
- Usan el updater funcional `setData(prev => ...)` → no dependen del estado actual
- Dependencias: `supabase` es un módulo global, `setData` es estable
- Beneficio: los consumidores del contexto no se re-renderizan cuando las funciones cambian

### 2. Cálculos Memorizados con useMemo (Study / Hands)

Los cálculos de progreso y filtrado se memorizan porque:
- Operan sobre arrays que pueden ser grandes (listas de manos, items de estudio)
- Se recalculan solo cuando cambian sus dependencias (datos, filtros)
- `useCalculation` es un alias para mejorar la legibilidad

### 3. Formularios con useForm (Home / Hands)

El hook `useForm` encapsula:
- Estado de valores, errores y campos tocados (useState)
- Validación al escribir y al salir del campo (useCallback)
- Envío solo si es válido (submitForm)
- Las funciones están memorizadas para evitar re-renders

### 4. Persistencia con useLocalStorage

El hook `useLocalStorage`:
- Carga datos con lazy initialization → no bloquea el render
- Sincroniza cambios con `useEffect` → actualiza localStorage automáticamente
- Manejo de errores con try/catch → no rompe la app si localStorage falla

### 5. Autenticación con useEffect (AppContext)

El `useEffect` con cleanup:
- `getSession()` → restaura sesión al montar la app
- `onAuthStateChange()` → escucha cambios en tiempo real
- `subscription.unsubscribe()` → previene memory leaks al desmontar

---

## Buenas Prácticas

| Práctica | Por qué |
|----------|---------|
| `useCallback(fn, [])` en funciones de contexto | Previene re-renders masivos en todos los consumidores |
| Lazy initialization en useState | Carga datos antes del primer render, evita sobrescritura |
| Updater funcional `setData(prev => ...)` | No depende del estado actual, permite `[]` en useCallback |
| useMemo en listas filtradas | Evita filtrar en cada render, solo cuando cambian datos o filtros |
| Cleanup en useEffect (`return () => unsubscribe()`) | Previene memory leaks al desmontar componentes |
| Tipado genérico en custom hooks | Mayor reutilización y seguridad (useForm\<T>, useLocalStorage\<T>) |
| Funciones memorizadas en hooks | Los consumidores reciben referencias estables |

---

**Última actualización**: Mayo 2026
