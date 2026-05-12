# Retrospectiva del Proyecto

## 1. Conexión Frontend ↔ Backend ↔ API

La arquitectura final conecta tres capas mediante un contrato de tipos compartido y un flujo unidireccional de datos:

```
Páginas (React)
    │  useEffect + useState
    ▼
AppContext (Estado global)
    │  API calls via fetch
    ▼
api/client.ts (Cliente tipado)
    │  HTTP (JSON)
    ▼
Express Server (Vercel Serverless)
    │  routes → controllers → services
    ▼
In-memory Store (Mock DB)
```

### Flujo completo de una creación de sesión:

1. **Página** (`Home.tsx`): Usuario llena un formulario controlado con `useForm`
2. **Validación** (`useForm`): Reglas de validación en el frontend (buyIn requerido, etc.)
3. **Contexto** (`AppContext.addSession`): Llama a `api.sessions.create(payload)`
4. **API Client** (`api/client.ts`): Convierte el payload a JSON, hace `POST /api/sessions`
5. **Express** (`routes → controllers → services`): Valida con zod, genera UUID, guarda en store
6. **Respuesta**: Servidor devuelve `201` con el objeto creado (incluyendo UUID)
7. **Estado local**: `AppContext` actualiza su estado con el objeto devuelto
8. **Re-render**: React re-renderiza las páginas que consumen `data.sessions`

### Lo aprendido sobre la conexión:

- **El contrato de tipos es crítico**: `api/client.ts` define los tipos de entrada (`Omit<Session, 'id'>`) y salida (`Session`) que deben coincidir exactamente con el servidor. Cualquier desajuste (ej: campo opcional vs requerido) se detecta en compilación gracias a TypeScript.
- **El servidor es la única fuente de verdad**: Tras migrar de localStorage, todas las mutaciones pasan por la API. El estado local es un "caché" que se actualiza solo tras confirmación del servidor.
- **La URL de la API se configura por entorno**: `VITE_API_URL=http://localhost:3001/api` en desarrollo, `/api` (relativa) en producción. Esto evita problemas de CORS en producción al estar frontend y API en el mismo dominio.

---

## 2. Principales Problemas Encontrados

### 2a. Spread operator y sobreescritura de UUID (Server)

**Problema:** En los servicios del servidor (`sessions.ts`, `hands.ts`, etc.), el código creaba objetos así:

```typescript
const session = { id: crypto.randomUUID(), ...data }
```

Si `data` contenía un campo `id` (enviado desde el frontend), sobrescribía el UUID generado. Esto pasó desapercibido porque el seed del study plan enviaba objetos con IDs hardcodeados ('pf1', 'pf2'...).

**Solución:** Invertir el orden: `{ ...data, id: crypto.randomUUID() }`.

**Lección:** En JavaScript, el spread posterior sobrescribe propiedades anteriores. Siempre poner `id` al final cuando se genera automáticamente.

---

### 2b. Renombrado de `loading` a `authLoading` (Contexto)

**Problema:** Al migrar de localStorage a API, el AppContext empezó a tener dos tipos de carga: la autenticación (Supabase) y los datos (API). Se renombró la propiedad `loading` a `authLoading` en el contexto, pero `App.tsx` seguía referenciando `loading` (que ya no existía). TypeScript no lo detectó porque la destructuración `const { loading } = useApp()` solo falla en runtime.

**Solución:** Buscar y reemplazar todas las referencias a la propiedad renombrada.

**Lección:** Al cambiar nombres de propiedades en el contexto, usar grep para encontrar todas las referencias. Mejor aún: definir la interfaz del contexto en un solo lugar y dejar que TypeScript guíe la migración.

---

### 2c. Unawaited async calls (Promesas flotantes)

**Problema:** Tras convertir las funciones del contexto (`addSession`, `deleteHand`, etc.) de síncronas a asíncronas, los event handlers en las páginas seguían llamándolas sin `await`:

```tsx
<button onClick={() => deleteHand(hand.id)}>   // Promise no capturada
```

Esto producía unhandled promise rejections si la API fallaba.

**Solución:** Envolver en `async/await` + `try/catch` o usar `.catch(() => {})`.

**Lección:** Migrar de síncrono a asíncrono requiere revisar TODOS los puntos de llamada. El compilador no detecta promesas no await-ed.

---

### 2d. Estado `currentCard` fuera de sincronía

**Problema:** `currentCard` (índice de la flashcard actual) se inicializaba en `0` y se actualizaba con los botones anterior/siguiente. Pero si los datos se recargaban desde la API con menos flashcards, `currentCard` quedaba apuntando a un índice inexistente → `undefined` → crash al acceder a `.question`.

**Solución:** Añadir un `useEffect` que clampa `currentCard` cuando `flashcards.length` cambia.

**Lección:** Siempre que un índice apunte a un array dinámico, proteger contra cambios externos (refetch de API, eliminación de datos).

---

### 2e. Orden de propiedades en spread (design.md desactualizado)

**Problema:** `docs/design.md` describe la arquitectura inicial SIN backend (solo localStorage). Tras añadir el backend Express y la API, el documento quedó desactualizado. La sección "Persistencia" aún dice "Sin backend: Todos los datos se guardan en localStorage".

**Lección:** Los documentos de arquitectura deben actualizarse cuando cambia la fuente de verdad de los datos. Idealmente, mantener un diagrama de flujo actualizado.

---

### 2f. `.sort()` mutante dentro de `useMemo`

**Problema:** En `Hands.tsx`, el `useMemo` hacía `filtered.sort(...)` que muta el array original. Aunque `filtered` es una copia de `.filter()`, React espera que los callbacks de `useMemo` sean puros.

**Solución:** `[...filtered].sort(...)`.

---

## 3. Uso de IA Durante el Desarrollo

La IA se utilizó como **asistente de programación** durante todo el proyecto, en las siguientes modalidades:

### 3a. Generación de código

- **Componentes React**: La IA generó los componentes `Input`, `Button`, `Modal`, `AsyncHandler`, etc. a partir de descripciones de funcionalidad deseada. Por ejemplo: "Crea un componente Input controlado con label, error display y required".
- **Servidor Express**: La estructura completa de routes/controllers/services se generó con IA, incluyendo los esquemas de validación con zod.
- **API Client**: El cliente tipado con fetch, `ApiError`, y funciones por recurso fue generado íntegramente por IA.

### 3b. Refactorización y migración

- **Migración localStorage → API**: La IA reescribió `AppContext.tsx` para cambiar de persistencia local a llamadas HTTP, manteniendo la misma interfaz de funciones pero haciéndolas asíncronas.
- **Arquitectura por capas**: La IA separó el Express monolítico en routes/controllers/services/middleware.

### 3c. Depuración

- **Búsqueda de bugs**: Se usó la IA para revisar código en busca de bugs (promesas no await-ed, tipos incorrectos, edge cases). Por ejemplo, detectó que `deleteSession` se llamaba sin `await`.
- **Análisis de errores**: Cuando el build fallaba, se mostraba el error a la IA y generaba la corrección (ej: tipos de `req.params.id` en Express 5).

### 3d. Documentación

- **Documentos técnicos**: `docs/hooks.md`, `docs/context.md`, `docs/routing.md`, `docs/api-client.md`, `docs/forms.md` y `docs/testing.md` fueron generados por IA describiendo el código existente.
- **Cobertura**: La IA generó casos de prueba, endpoints a testear, y bugs conocidos para `docs/testing.md`.

### 3e. Forma de interacción

La interacción seguía este patrón:

1. **Usuario describe el objetivo**: "Añade login con Supabase", "Crea un plan de estudio"
2. **IA explora el códigobase**: Lee archivos relevantes para entender el contexto
3. **IA implementa**: Escribe/modifica archivos
4. **Usuario revisa**: Pide cambios o ajustes
5. **IA itera**: Corrige según feedback
6. **Verificación**: Build, test, o deploy para confirmar

**Ventajas observadas:**
- Velocidad de desarrollo ~3-5x comparado con escribir manualmente
- Detección temprana de edge cases (la IA sugiere validaciones, estados de carga, etc.)
- Consistencia en estilos y patrones (la IA replica el estilo del código existente)

**Limitaciones observadas:**
- La IA a veces genera código que no compila (tipos incorrectos, imports faltantes) → requiere iteración
- La IA no tiene contexto completo del proyecto → a veces sugiere soluciones que no encajan con la arquitectura existente
- Documentación generada puede contener imprecisiones (ej: describir funcionalidad planeada como ya implementada)

---

## 4. Reflexión Final

### Lo que funciona bien

1. **Arquitectura por capas**: La separación routes → controllers → services en el backend y componentes → contexto → API client en el frontend hace que cada capa sea testeable y reemplazable de forma independiente.

2. **Tipado compartido**: Usar los mismos tipos TypeScript en frontend y backend (definidos en `src/types/` y `server/src/types/`) elimina una clase entera de bugs de integración.

3. **Estados de red explícitos**: `AsyncHandler` con loading, error y retry cubre los tres estados que toda aplicación que consume una API debería manejar.

4. **Formularios controlados**: `useForm` con validación declarativa, blur y submit errors proporciona una UX sólida sin depender de librerías externas.

### Lo que mejoraría

1. **Base de datos real**: El store en memoria del servidor impide persistencia real. Conectar PostgreSQL o SQLite vía Prisma sería el siguiente paso lógico.

2. **Testing automatizado**: Las pruebas actuales son manuales. Añadir tests unitarios (Vitest) para servicios del backend y hooks del frontend, y tests de integración (Supertest) para los endpoints.

3. **Manejo de errores más granular**: Los errores de red y de validación se muestran al usuario, pero no hay logging ni tracking de errores en producción.

4. **SSR / SEO**: La app es 100% client-side. Para una app pública, considerar Next.js o añadir meta tags vía react-helmet.

5. **Optimistic UI**: Las mutaciones (crear sesión, eliminar mano) podrían actualizar la UI inmediatamente y revertir si la API falla, en lugar de esperar la respuesta del servidor.

### Progreso

| Etapa | Estado |
|-------|--------|
| Idea y planificación | ✅ Completado |
| Componentes base | ✅ Completado |
| Páginas (Home, Study, Hands) | ✅ Completado |
| Autenticación Supabase | ✅ Completado |
| Backend Express (API) | ✅ Completado |
| Migración localStorage → API | ✅ Completado |
| Despliegue Vercel | ✅ Preparado (pendiente de deploy) |
| Documentación | ✅ 14 documentos |

### Números finales

- **Archivos**: 60+ (frontend + backend)
- **Módulos**: 81 (build frontend)
- **Endpoints API**: 13 (5 recursos)
- **Documentos**: 15 en `docs/`
- **Bugs encontrados y corregidos**: 16 (documentados en `docs/testing.md`)
- **Deuda técnica**: Mínima (store en memoria es la principal)

---

**Última actualización**: Mayo 2026
