# Formularios Controlados

## Arquitectura

```
Input component (controlled UI)
  ↓
useForm hook (estado + validación)
  ↓
Página (lógica de negocio + persistencia)
```

---

## Hook: `useForm`

**Ubicación:** `src/hooks/useForm.tsx`

### Retorno

| Propiedad       | Tipo                                      | Descripción                               |
| --------------- | ----------------------------------------- | ----------------------------------------- |
| `values`        | `T`                                       | Objeto con valores actuales del formulario |
| `errors`        | `Partial<Record<keyof T, string>>`        | Errores de validación por campo           |
| `isDirty`       | `boolean`                                 | `true` si algún campo fue modificado      |
| `isValid`       | `boolean`                                 | `true` si no hay errores                  |
| `handleChange`  | `(field: keyof T, value: any) => void`    | Actualiza un valor y limpia su error      |
| `handleBlur`    | `(field: keyof T) => void`                | Valida el campo al perder el foco         |
| `setFieldValue` | `(field: keyof T, value: any) => void`    | Setter directo (sin limpiar error)        |
| `setFieldError` | `(field: keyof T, error: string) => void` | Asigna error manualmente                  |
| `resetForm`     | `() => void`                              | Vuelve al estado inicial                  |
| `submitForm`    | `() => void`                              | Valida todo y ejecuta `onSubmit`          |

### Parámetros

```tsx
useForm<T>(
  initialValues: T,
  validationRules: { field: keyof T; rule: (value, values) => string | null }[],
  onSubmit: (values: T) => void
)
```

---

## Componente: `Input`

**Ubicación:** `src/components/Input.tsx`

```tsx
<Input
  label="Email"
  type="email"
  value={values.email}
  onChange={(v) => handleChange('email', v)}
  onBlur={() => handleBlur('email')}
  error={errors.email}
  required
  placeholder="tu@email.com"
/>
```

El error se muestra como `<p className="text-red-400">` debajo del input.  
El borde se colorea rojo con `border-red-500` cuando hay error.

---

## Patrón Completo

```tsx
function MiFormulario() {
  const [confirmText, setConfirmText] = useState('')

  const { values, errors, handleChange, handleBlur, submitForm } = useForm(
    { nombre: '', email: '' },                          // valores iniciales
    [                                                   // reglas de validación
      { field: 'nombre', rule: (v) => !v ? 'El nombre es obligatorio' : null },
      { field: 'email', rule: (v) => !v.includes('@') ? 'Email inválido' : null },
    ],
    (vals) => {                                         // onSubmit
      guardarDatos(vals)
      setConfirmText('Guardado correctamente')
      setTimeout(() => setConfirmText(''), 2500)
    }
  )

  return (
    <form onSubmit={(e) => { e.preventDefault(); submitForm() }}>
      {confirmText && (
        <div className="fixed top-4 right-4 z-50 bg-green-900/90 text-green-300 px-5 py-3 rounded-xl shadow-2xl border border-green-700/50 backdrop-blur-sm flex items-center gap-2">
          <span>✅</span>
          <span>{confirmText}</span>
        </div>
      )}

      <Input label="Nombre" value={values.nombre} onChange={(v) => handleChange('nombre', v)} error={errors.nombre} />
      <Input label="Email" type="email" value={values.email} onChange={(v) => handleChange('email', v)} error={errors.email} />
      <Button type="submit">Guardar</Button>
    </form>
  )
}
```

---

## Validaciones Existentes

| Formulario      | Ubicación          | Reglas                                                    |
| --------------- | ------------------ | --------------------------------------------------------- |
| Nueva Sesión    | `Home.tsx`         | `buyIn`, `cashOut`, `timePlayedMinutes` requeridos        |
| Nueva Mano      | `Hands.tsx`        | `heroHand` requerido                                      |
| Login/Register  | `Login.tsx`        | `email`, `password` requeridos; `password` ≥ 6 caracteres |

**Login.tsx** usa validación manual inline (no `useForm`) porque se integra con Supabase y `handleSubmit` es async.

---

## Confirmación Visual

Toda creación de datos muestra un toast fijo en `top-4 right-4` con fondo verde:
- **Sesión →** "Sesión registrada correctamente"
- **Mano →** "Mano registrada correctamente"

El toast se auto-destruye tras 2.5s vía `setTimeout`.  
Al cerrar el modal manualmente, el toast también se limpia (`handleCloseModal`).

---

## Buenas Prácticas

1. **Campos controlados:** `value` + `onChange` en lugar de refs o DOM directo
2. **Validación en blur:** `handleBlur` valida el campo individual sin esperar el submit
3. **Errores se limpian al escribir:** `handleChange` hace `setErrors(prev => ({ ...prev, [field]: undefined }))`
4. **submitForm valida todo:** corre todas las reglas antes de llamar `onSubmit`; si hay errores, los muestra y no ejecuta `onSubmit`
5. **resetForm vuelve al inicio:** útil después de crear un registro y querer limpiar el formulario
