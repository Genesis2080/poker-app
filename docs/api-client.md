# API Client Layer

La capa de red se compone de tres partes que trabajan juntas para gestionar los estados de carga, éxito y error.

---

## 1. API Client (`src/api/client.ts`)

Cliente tipado usando `fetch` nativo que expone funciones por recurso.

### `ApiError`

Error personalizado con `status`, `message` y `details` (errores de validación del backend).

### Funciones expuestas

| Recurso       | Método   | Función                            | Retorno                  |
| ------------- | -------- | ---------------------------------- | ------------------------ |
| `sessions`    | `list`   | `GET /api/sessions`                | `Promise<Session[]>`     |
|               | `getById`| `GET /api/sessions/:id`            | `Promise<Session>`       |
|               | `create` | `POST /api/sessions`               | `Promise<Session>`       |
|               | `delete` | `DELETE /api/sessions/:id`         | `Promise<{message}>`     |
| `hands`       | `list`   | `GET /api/hands`                   | `Promise<Hand[]>`        |
|               | `getById`| `GET /api/hands/:id`               | `Promise<Hand>`          |
|               | `create` | `POST /api/hands`                  | `Promise<Hand>`          |
|               | `patch`  | `PATCH /api/hands/:id`             | `Promise<Hand>`          |
|               | `delete` | `DELETE /api/hands/:id`            | `Promise<{message}>`     |
| `study`       | `list`   | `GET /api/study`                   | `Promise<StudyPlanItem[]>` |
|               | `create` | `POST /api/study`                  | `Promise<StudyPlanItem>` |
|               | `toggle` | `PATCH /api/study/:id/toggle`      | `Promise<StudyPlanItem>` |
| `flashcards`  | `list`   | `GET /api/flashcards`              | `Promise<Flashcard[]>`   |
|               | `create` | `POST /api/flashcards`             | `Promise<Flashcard>`     |
|               | `patch`  | `PATCH /api/flashcards/:id`        | `Promise<Flashcard>`     |
| `stats`       | `get`    | `GET /api/stats`                   | `Promise<AppStats>`      |

### Tipos de payload (sin ID)

```typescript
type CreateSessionPayload = Omit<Session, 'id'>
type CreateHandPayload = Omit<Hand, 'id'>
type CreateStudyPayload = Omit<StudyPlanItem, 'id' | 'completed'>
type CreateFlashcardPayload = Omit<Flashcard, 'id'>
```

El servidor genera el `id` con `crypto.randomUUID()`.

### Contrato de red

```
fetch → ApiError(0, "No se pudo conectar con el servidor")  ← Network error
fetch → !ok → ApiError(status, message, details)             ← HTTP error (400, 404, 500)
fetch → ok → JSON tipado                                     ← Éxito (200, 201)
```

---

## 2. Gestión de estados (`AsyncHandler.tsx`)

Componente que maneja los tres estados de red en la UI:

| Prop        | Tipo                  | Descripción                              |
| ----------- | --------------------- | ---------------------------------------- |
| `loading`   | `boolean`             | Muestra spinner + "Cargando datos..."    |
| `error`     | `string \| null`      | Muestra mensaje de error + botón retry   |
| `onRetry`   | `() => void`          | Función para reintentar la carga         |
| `children`  | `ReactNode`           | Contenido cuando hay datos               |

```tsx
<AsyncHandler loading={dataLoading} error={dataError} onRetry={retryLoadData}>
  <HomeContent />
</AsyncHandler>
```

---

## 3. Flujo en AppContext

### Carga inicial (`loadAllData`)

1. Llamadas paralelas a `sessions.list()`, `hands.list()`, `study.list()`, `flashcards.list()`
2. Si flashcards están vacías → se crean desde `createDefaultFlashcards()` vía API
3. Si study plan está vacío → se crea desde `INITIAL_STUDY_PLAN` vía API
4. En error → `dataError` se setea, aparece pantalla de error con retry
5. En éxito → `data` se actualiza, se renderiza la UI

### Mutaciones (ej. `addSession`)

1. Llama a `api.sessions.create(payload)` 
2. En éxito → actualiza estado local con el objeto devuelto por el server (con `id` real)
3. En error → lanza `ApiError`, atrapado en el `onSubmit` del formulario
4. `submitError` se muestra como mensaje rojo en el modal

### Estados expuestos

| Estado          | Tipo                  | Uso                                |
| --------------- | --------------------- | ---------------------------------- |
| `authLoading`   | `boolean`             | Carga de sesión Supabase           |
| `dataLoading`   | `boolean`             | Carga inicial de datos desde API   |
| `dataError`     | `string \| null`      | Error de carga inicial             |
| `retryLoadData` | `() => Promise<void>` | Reintentar carga inicial           |

### Eliminación de localStorage

Los datos (sessions, hands, study, flashcards) ya no persisten en localStorage. 
La API es la única fuente de verdad. Si el servidor se reinicia, los datos se pierden 
(almacenamiento en memoria). Para persistencia real, conectar a una base de datos en el backend.

---

## 4. `useForm` y llamadas async

El hook `useForm` soporta `onSubmit` asíncrono:

```typescript
const { submitForm, submitError } = useForm(initialValues, rules, async (vals) => {
  await addSession({ ...vals })
  setConfirmText('Creado correctamente')
  setIsModalOpen(false)
})
```

- Si `onSubmit` lanza un error, `submitError` se setea automáticamente
- `submitForm` es `async` y seguro de llamar sin `await`
- El error se muestra en el formulario vía `{submitError && <div>...</div>}`

---

## 5. Mapa de archivos

```
src/api/client.ts          → Cliente tipado (fetch + ApiError)
src/components/AsyncHandler.tsx → Componente de estados
src/context/AppContext.tsx  → Integración: carga + mutaciones
src/hooks/useForm.tsx      → Soporte async + submitError
src/pages/Home.tsx          → AsyncHandler + submitError
src/pages/Hands.tsx         → AsyncHandler + submitError
src/pages/Study.tsx         → AsyncHandler
```
