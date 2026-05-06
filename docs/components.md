# Guía de Componentes - Poker App#

## Índice
1. [Button](#button)
2. [Input](#input)
3. [Modal](#modal)
4. [Card](#card)
5. [List](#list)
6. [UI (PageHeader, Badge)](#ui-pageheader-badge)

---

## Button

### Descripción
Botón reutilizable con múltiples variantes visuales y tamaños.

### Ubicación
`src/components/Button.tsx`

### Props (Interfaz TypeScript)
```typescript
interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
}
```

### Variantes
| Variante | Clases Tailwind | Uso |
|----------|----------------|-----|
| `primary` (default) | `bg-purple-600 hover:bg-purple-700 text-white` | Acciones principales |
| `secondary` | `bg-gray-700 hover:bg-gray-600 text-gray-100` | Acciones secundarias |
| `danger` | `bg-red-600 hover:bg-red-700 text-white` | Eliminar, acciones destructivas |
| `ghost` | `bg-transparent hover:bg-gray-800 text-gray-300` | Acciones sutiles |

### Tamaños
| Tamaño | Padding | Fuente |
|---------|---------|--------|
| `sm` | `px-3 py-1.5` | `text-sm` |
| `md` (default) | `px-4 py-2` | `text-base` |
| `lg` | `px-6 py-3` | `text-lg` |

### Ejemplos de Uso
```tsx
import { Button } from '../components/Button'

// Básico
<Button onClick={handleClick}>Guardar</Button>

// Con variante y tamaño
<Button variant="danger" size="sm" onClick={deleteItem}>
  Eliminar
</Button>

// Deshabilitado
<Button disabled={!isValid} onClick={submitForm}>
  Enviar
</Button>

// Tipo submit en formulario
<Button type="submit">Guardar</Button>
```

---

## Input

### Descripción
Campo de entrada de texto con soporte para labels, mensajes de error y estilos Tailwind.

### Ubicación
`src/components/Input.tsx`

### Props (Interfaz TypeScript)
```typescript
interface InputProps {
  label?: string
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  required?: boolean
  className?: string
  id?: string
}
```

### Ejemplos de Uso
```tsx
import { Input } from '../components/Input'

// Input básico
<Input
  label="Nombre"
  value={name}
  onChange={setName}
  placeholder="Ingresa tu nombre"
/>

// Con validación de error
<Input
  label="Email"
  type="email"
  value={email}
  onChange={setEmail}
  error={emailError}
  required
/>

// Sin label
<Input
  value={search}
  onChange={setSearch}
  placeholder="Buscar..."
  className="max-w-xs"
/>
```

### Estilos
- **Normal**: `bg-gray-800 border-gray-700 text-gray-100`
- **Focus**: `ring-2 ring-purple-500 border-transparent`
- **Error**: `border-red-500`
- **Hover**: `hover:border-gray-600`

---

## Modal

### Descripción
Modal accesible con overlay oscuro, botón de cierre y áreas para header, body y footer.

### Ubicación
`src/components/Modal.tsx`

### Props (Interfaz TypeScript)
```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}
```

### Tamaños
| Tamaño | Clase Max-Width |
|---------|------------------|
| `sm` | `max-w-sm` (384px) |
| `md` (default) | `max-w-md` (448px) |
| `lg` | `max-w-lg` (512px) |

### Ejemplos de Uso
```tsx
import { Modal } from '../components/Modal'
import { Button } from './Button'

const [isOpen, setIsOpen] = useState(false)

// Modal básico
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Confirmar acción">
  <p>¿Estás seguro de eliminar este elemento?</p>
</Modal>

// Con footer personalizado
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Nueva Mano"
  footer={
    <>
      <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
      <Button onClick={handleSave}>Guardar</Button>
    </>
  }
>
  <form>{/* Campos del formulario */}</form>
</Modal>
```

### Características de Accesibilidad
- Overlay con `backdrop-blur-sm`
- Botón de cierre con `aria-label="Cerrar modal"`
- Cierre al hacer click en el overlay
- `onClick` con `e.stopPropagation()` en el modal

---

## Card

### Descripción
Tarjeta contenedor con opción de título, subtítulo, acciones y efecto hover.

### Ubicación
`src/components/Card.tsx`

### Props (Interfaz TypeScript)
```typescript
interface CardProps {
  children: ReactNode
  title?: string
  subtitle?: string
  action?: ReactNode
  className?: string
  hoverable?: boolean
  onClick?: () => void
}
```

### Ejemplos de Uso
```tsx
import { Card } from '../components/Card'

// Tarjeta simple
<Card title="Estadísticas" subtitle="Resumen de tu progreso">
  <p>Aquí van las estadísticas...</p>
</Card>

// Con acción
<Card
  title="Plan de Estudios"
  action={<Button size="sm">Ver todo</Button>}
>
  <p>3 temas pendientes</p>
</Card>

// Clickable (hoverable)
<Card
  title="Mano #123"
  subtitle="Preflop - BTN"
  hoverable
  onClick={() => viewHand('123')}
>
  <p>Resultado: Victoria</p>
</Card>
```

### Estilos
- **Normal**: `bg-gray-800 border-gray-700 rounded-xl`
- **Hoverable**: `hover:bg-gray-750 hover:border-gray-600 cursor-pointer`

---

## List

### Descripción
Componente de lista genérico y tipado que puede renderizar cualquier tipo de datos.

### Ubicación
`src/components/List.tsx`

### Props (Interfaz TypeScript Genérica)
```typescript
interface ListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  keyExtractor?: (item: T) => string
  emptyMessage?: string
  className?: string
  itemClassName?: string
}
```

### Ejemplos de Uso
```tsx
import { List } from '../components/List'

// Lista de strings
const fruits = ['Manzana', 'Banana', 'Naranja']

<List
  items={fruits}
  renderItem={(fruit) => <div className="p-2">{fruit}</div>}
  emptyMessage="No hay frutas"
/>

// Lista tipada de objetos (Hands)
interface Hand {
  id: string
  result: 'win' | 'loss'
}

const hands: Hand[] = [...]

<List
  items={hands}
  keyExtractor={(hand) => hand.id}
  renderItem={(hand) => (
    <div className="p-4 border-b border-gray-700">
      Mano {hand.id} - {hand.result}
    </div>
  )}
  className="divide-y divide-gray-700"
/>
```

### Características
- **Genérico**: Funciona con cualquier tipo de datos (`<T>`)
- **Empty state**: Muestra mensaje cuando `items.length === 0`
- **Keys personalizadas**: Usa `keyExtractor` o índice por defecto
- **Clases dinámicas**: `className` para el contenedor, `itemClassName` para cada item

---

## UI (PageHeader, Badge)

### Ubicación
`src/components/UI.tsx`

### PageHeader

#### Props
```typescript
interface PageHeaderProps {
  title: string
  subtitle: string
  action?: ReactNode
}
```

#### Ejemplo
```tsx
<PageHeader
  title="Plan de Estudios"
  subtitle="Domina el póker calle por calle"
  action={<Button onClick={resetAll}>Resetear</Button>}
/>
```

### Badge

#### Props
```typescript
interface BadgeProps {
  children: ReactNode
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple'
}
```

#### Colores
| Color | Clases Tailwind |
|-------|----------------|
| `blue` (default) | `bg-blue-900/30 text-blue-400` |
| `green` | `bg-green-900/30 text-green-400` |
| `red` | `bg-red-900/30 text-red-400` |
| `yellow` | `bg-yellow-900/30 text-yellow-400` |
| `purple` | `bg-purple-900/30 text-purple-400` |

#### Ejemplo
```tsx
<Badge color="green">Completado</Badge>
<Badge color="red">Error</Badge>
```

---

## Patrones de Composición

### 1. Composición de Modal + Formulario
```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Nueva Mano"
  footer={
    <>
      <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
      <Button onClick={handleSubmit}>Guardar</Button>
    </>
  }
>
  <form onSubmit={handleSubmit}>
    <div className="space-y-4">
      <Input label="Posición" value={position} onChange={setPosition} />
      <Input label="Resultado" value={result} onChange={setResult} />
    </div>
  </form>
</Modal>
```

### 2. Lista de Tarjetas
```tsx
<List
  items={studyPlan}
  renderItem={(item) => (
    <Card
      key={item.id}
      title={item.topic}
      subtitle={item.category}
      hoverable
      onClick={() => toggleItem(item.id)}
    >
      {item.description}
    </Card>
  )}
/>
```

### 3. Uso de Button en conjunto
```tsx
<div className="flex gap-3">
  <Button variant="ghost" size="sm">Cancelar</Button>
  <Button variant="danger" size="sm" onClick={deleteItem}>Eliminar</Button>
  <Button size="sm" onClick={saveItem}>Guardar</Button>
</div>
```

---

## Convenciones de Estilos

### Colores Principales
- **Fondo principal**: `bg-gray-900`
- **Fondo secundario**: `bg-gray-800`
- **Bordes**: `border-gray-700`
- **Texto principal**: `text-gray-100`
- **Texto secundario**: `text-gray-400`
- **Acento**: `text-purple-400`, `bg-purple-600`

### Transiciones
Todos los componentes usan `transition-colors duration-200` para suavizar cambios de estado.

### Estructura de Clases
```tsx
className={`
  // Estilos base
  flex items-center justify-center
  
  // Estados condicionales
  ${isActive ? 'bg-purple-600' : 'bg-gray-800'}
  
  // Hover y focus
  hover:bg-purple-700 focus:ring-2
  
  // Personalización
  ${className}
`}
```

---

**Última actualización**: Mayo 2026
