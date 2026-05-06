# Guía de Hooks - Poker App#

## Índice
1. [useLocalStorage](#uselocalstorage)
2. [useToggle](#usetoggle)
3. [useForm](#useform)
4. [useOptimizedCallback & useCalculation](#useoptimizedcallback--usecalculation)
5. [Ejemplos de Integración](#ejemplos-de-integración)

---

## useLocalStorage#

### Descripción
Hook personalizado para gestionar estado persistido en `localStorage` con sincronización automática.

### Ubicación
`src/hooks/useLocalStorage.tsx`

### Firma (TypeScript)
```typescript
function useLocalStorage<T>(
  key: string,
  initialValue: T
): {
  value: T
  setValue: (newValue: T | ((prev: T) => T)) => void
  remove: () => void
}
```

### Parámetros
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `key` | `string` | Clave para localStorage |
| `initialValue` | `T` | Valor inicial si no existe en localStorage |

### Valores de Retorno
| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `value` | `T` | Valor actual (tipado) |
| `setValue` | `(newValue: T \| ((prev: T) => T)) => void` | Actualiza valor y guarda en localStorage |
| `remove` | `() => void` | Elimina del localStorage y resetea al valor inicial |

### Características
- ✅ **Tipado genérico** (`<T>`): Funciona con cualquier tipo de dato
- ✅ **Hidratación segura**: Maneja errores de JSON.parse
- ✅ **Sincronización automática**: `useEffect` guarda cambios
- ✅ **Setter funcional**: Soporta `setValue(prev => !prev)`
- ✅ **Manejo de errores**: `try/catch` con `console.warn`

### Ejemplo de Uso
```tsx
import { useLocalStorage } from '../hooks/useLocalStorage'

function Settings() {
  const { value: theme, setValue: setTheme } = useLocalStorage('theme', 'light')
  const { value: user, setValue: setUser, remove: logout } = useLocalStorage<User>('user', null)

  return (
    <div>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Tema actual: {theme}
      </button>
      
      {user && (
        <button onClick={logout}>Cerrar sesión</button>
      )}
    </div>
  )
}
```

---

## useToggle#

### Descripción
Hook para manejar estados booleanos con múltiples métodos de control.

### Ubicación
`src/hooks/useToggle.tsx`

### Firma (TypeScript)
```typescript
function useToggle(initialValue: boolean = false): {
  isOn: boolean
  toggle: () => void
  turnOn: () => void
  turnOff: () => void
  setValue: (value: boolean) => void
}
```

### Parámetros
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `initialValue` | `boolean` | Valor inicial (default: `false`) |

### Valores de Retorno
| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `isOn` | `boolean` | Estado actual |
| `toggle` | `() => void` | Cambia al valor opuesto |
| `turnOn` | `() => void` | Fuerza `true` |
| `turnOff` | `() => void` | Fuerza `false` |
| `setValue` | `(value: boolean) => void` | Establece valor específico |

### Características
- ✅ **Métodos múltiples**: `toggle`, `turnOn`, `turnOff`, `setValue`
- ✅ **useCallback**: Todas las funciones están memorizadas
- ✅ **Simple**: Ideal para modales, confirmaciones, switches

### Ejemplo de Uso
```tsx
import { useToggle } from '../hooks/useToggle'

function ConfirmDialog() {
  const { isOn: isOpen, turnOn, turnOff } = useToggle(false)

  return (
    <>
      <button onClick={turnOn}>Eliminar</button>
      
      {isOpen && (
        <div>
          <p>¿Estás seguro?</p>
          <button onClick={turnOff}>Cancelar</button>
        </div>
      )}
    </>
  )
}
```

---

## useForm#

### Descripción
Hook completo para gestión de formularios con validación, errores y manejo de estado sucio (dirty).

### Ubicación
`src/hooks/useForm.tsx`

### Firma (TypeScript)
```typescript
interface ValidationRule<T> {
  field: keyof T
  rule: (value: any, values: T) => string | null
}

function useForm<T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRule<T>[] = [],
  onSubmit: (values: T) => void
): {
  values: T
  errors: Partial<Record<keyof T, string>>
  isDirty: boolean
  isValid: boolean
  handleChange: (field: keyof T, value: any) => void
  handleBlur: (field: keyof T) => void
  setFieldValue: (field: keyof T, value: any) => void
  setFieldError: (field: keyof T, error: string) => void
  resetForm: () => void
  submitForm: () => void
}
```

### Parámetros
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `initialValues` | `T` | Valores iniciales del formulario |
| `validationRules` | `ValidationRule<T>[]` | Reglas de validación |
| `onSubmit` | `(values: T) => void` | Función al enviar formulario válido |

### Valores de Retorno
| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `values` | `T` | Valores actuales de los campos |
| `errors` | `Partial<Record<keyof T, string>>` | Errores por campo |
| `isDirty` | `boolean` | Si se han hecho cambios |
| `isValid` | `boolean` | Si no hay errores |
| `handleChange` | `(field: keyof T, value: any) => void` | Cambia valor y limpia error |
| `handleBlur` | `(field: keyof T) => void` | Marca campo tocado y valida |
| `setFieldValue` | `(field: keyof T, value: any) => void` | Establece valor directo |
| `setFieldError` | `(field: keyof T, error: string) => void` | Establece error manual |
| `resetForm` | `() => void` | Resetea a valores iniciales |
| `submitForm` | `() => void` | Valida y envía si es válido |

### Características
- ✅ **Tipado genérico**: `useForm<MyFormValues>(...)`
- ✅ **Validación**: Reglas personalizadas por campo
- ✅ **Estado sucio**: Sabe si se han hecho cambios
- ✅ **Validación al blur**: `handleBlur` valida cuando sales del campo
- ✅ **Limpieza de errores**: `handleChange` limpia error al escribir
- ✅ **useCallback**: Funciones memorizadas para evitar re-renders

### Ejemplo de Uso
```tsx
import { useForm } from '../hooks/useForm'

interface HandForm {
  position: string
  result: string
  stakes: string
}

const validationRules = [
  {
    field: 'position',
    rule: (value) => !value ? 'La posición es requerida' : null
  },
  {
    field: 'result',
    rule: (value) => !value ? 'El resultado es requerido' : null
  }
]

function NewHandModal({ isOpen, onClose }) {
  const { values, errors, handleChange, handleBlur, resetForm, submitForm } = useForm<HandForm>(
    { position: '', result: '', stakes: '' },
    validationRules,
    (values) => {
      console.log('Enviado:', values)
      resetForm()
      onClose()
    }
  )

  return (
    <form onSubmit={(e) => { e.preventDefault(); submitForm() }}>
      <input
        value={values.position}
        onChange={(e) => handleChange('position', e.target.value)}
        onBlur={() => handleBlur('position')}
      />
      {errors.position && <span className="error">{errors.position}</span>}
      
      <button type="submit">Guardar</button>
    </form>
  )
}
```

---

## useOptimizedCallback & useCalculation#

### Descripción
Utilidades para optimizar rendimiento: versiones memorizadas de `useCallback` y `useMemo` con tipado mejorado.

### Ubicación
`src/hooks/index.tsx`

### Frimas (TypeScript)
```typescript
function useOptimizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: DependencyList
): T

function useCalculation<T>(
  calculate: () => T,
  deps: DependencyList
): T
```

### Características de `useOptimizedCallback`
- ✅ **Tipado preservado**: Mantiene la firma de la función original
- ✅ **Evita warnings**: Deshabilita la regla `react-hooks/exhaustive-deps`
- ✅ **Mismo comportamiento**: Identico a `useCallback` pero con mejor DX

### Características de `useCalculation`
- ✅ **Cálculos costosos**: Memoriza resultados de funciones puras
- ✅ **Sin warning**: Deshabilita `react-hooks/exhaustive-deps`
- ✅ **Reemplaza useMemo**: Sintaxis más limpia para cálculos

### Ejemplos de Uso
```tsx
import { useOptimizedCallback, useCalculation } from '../hooks'

// useOptimizedCallback - Para funciones de evento
function StudyItem({ item }) {
  const handleToggle = useOptimizedCallback(
    () => {
      toggleItem(item.id) // No necesitas incluir toggleItem en deps
    },
    [item.id] // Pero sí necesitas las dependencias reales
  )

  return <button onClick={handleToggle}>{item.topic}</button>
}

// useCalculation - Para cálculos costosos
function ProgressBar({ studyArray }) {
  const overallProgress = useCalculation(() => {
    const completed = studyArray.filter(i => i.completed).length
    return {
      completed,
      total: studyArray.length,
      percentage: Math.round((completed / studyArray.length) * 100)
    }
  }, [studyArray])

  return <div style={{ width: `${overallProgress.percentage}%` }} />
}
```

---

## Ejemplos de Integración#

### 1. Plan de Estudios (Study.tsx)
```tsx
import { useCalculation } from '../hooks'
import { useToggle } from '../hooks'

function StudySection({ items, onToggle }) {
  // Cálculo memoizado de progreso
  const progress = useCalculation(() => {
    const completed = items.filter(i => i.completed).length
    return {
      completed,
      percentage: items.length > 0 ? Math.round((completed / items.length) * 100) : 0
    }
  }, [items])

  // Toggle para expandir sección
  const { isOn: isExpanded, toggle: toggleExpand } = useToggle()

  return (
    <div>
      <div onClick={toggleExpand}>
        Progreso: {progress.percentage}%
      </div>
      {isExpanded && (
        <div>
          {items.map(item => (
            <div key={item.id} onClick={() => onToggle(item.id)}>
              {item.topic}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

### 2. Formulario de Mano (Hands.tsx - Futuro)
```tsx
import { useForm } from '../hooks/useForm'
import { useLocalStorage } from '../hooks/useLocalStorage'

function HandForm() {
  // Persistir borrador en localStorage
  const { value: draft, setValue: setDraft } = useLocalStorage('hand-draft', null)

  // Hook de formulario con validación
  const { values, errors, handleChange, submitForm } = useForm(
    draft || { position: '', result: '', heroHand: '' },
    [
      { field: 'position', rule: (v) => !v ? 'Requerido' : null },
      { field: 'heroHand', rule: (v) => !v ? 'Requerido' : null }
    ],
    (vals) => {
      console.log('Guardando mano:', vals)
      setDraft(null) // Limpiar borrador
    }
  )

  return (
    <form onSubmit={(e) => { e.preventDefault(); submitForm() }}>
      <input
        value={values.position}
        onChange={(e) => {
          handleChange('position', e.target.value)
          setDraft({ ...values, position: e.target.value }) // Guardar borrador
        }}
      />
      {errors.position && <span>{errors.position}</span>}
      <button type="submit">Guardar</button>
    </form>
  )
}
```

### 3. Modal con useToggle
```tsx
import { useToggle } from '../hooks/useToggle'
import { Modal } from '../components/Modal'

function PageHeader() {
  const { isOn: isModalOpen, turnOn, turnOff } = useToggle()

  return (
    <>
      <button onClick={turnOn}>Nueva Mano</button>
      
      <Modal isOpen={isModalOpen} onClose={turnOff} title="Nueva Mano">
        {/* Contenido del modal */}
      </Modal>
    </>
  )
}
```

---

## Convenciones de Hooks#

### Nombrado
- **Archivos**: `use[PascalCase].tsx` (ej. `useLocalStorage.tsx`)
- **Funciones**: `use[CamelCase]` (ej. `useToggle`, `useForm`)
- **Índice**: `index.tsx` para exportar múltiples hooks

### Estructura de un Hook
```tsx
import { useState, useCallback, useEffect } from 'react'

interface MiHookResult {
  // Valores de retorno tipados
}

export function useMiHook(param: string): MiHookResult {
  const [state, setState] = useState()
  
  const memoizedFn = useCallback(() => {
    // Lógica
  }, [])
  
  useEffect(() => {
    // Efectos
  }, [param])
  
  return {
    // Valores
  }
}
```

### Documentación
- ✅ JSDoc para describir el hook
- ✅ Interfaz de tipos explícita
- ✅ Ejemplos de uso en `docs/hooks.md`
- ✅ Comentarios solo para lógica compleja

---

## Diferencias entre Hooks Nativos y Personalizados#

| Hook | Nativo | Personalizado |
|------|--------|---------------|
| **useState** | `useState(initialValue)` | `useLocalStorage(key, initialValue)` |
| **useCallback** | `useCallback(fn, deps)` | `useOptimizedCallback(fn, deps)` |
| **useMemo** | `useMemo(fn, deps)` | `useCalculation(fn, deps)` |
| **useEffect** | `useEffect(fn, deps)` | Usado dentro de `useLocalStorage` para persistir |

---

**Última actualización**: Mayo 2026
