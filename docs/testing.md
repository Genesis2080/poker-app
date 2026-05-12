# Manual Testing

## 1. Server

```bash
cd server
npm install
npm run dev       # http://localhost:3001
```

### Smoke tests (via curl/PowerShell)

```powershell
# Flashcards seeded
Invoke-WebRequest -Uri http://localhost:3001/api/flashcards -UseBasicParsing
# → 200, array of 10 cards

# Sessions CRUD
$body = '{"date":"2026-05-12","modality":"cash","buyIn":50,"cashOut":120,"timePlayedMinutes":90}'
Invoke-WebRequest -Uri http://localhost:3001/api/sessions -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
# → 201, returns created session with UUID

Invoke-WebRequest -Uri http://localhost:3001/api/sessions -UseBasicParsing
# → 200, array with the session

Invoke-WebRequest -Uri http://localhost:3001/api/sessions/nonexistent -UseBasicParsing
# → 404, { error: "Sesión no encontrada" }

# Validation error
$badBody = '{"modality":"cash","buyIn":-5,"cashOut":120,"timePlayedMinutes":90}'
Invoke-WebRequest -Uri http://localhost:3001/api/sessions -Method POST -Body $badBody -ContentType "application/json" -UseBasicParsing
# → 400, { error: "Error de validación", details: [...] }

# Hands CRUD
$hand = '{"date":"2026-05-12","position":"BTN","result":"win","heroHand":"AKs"}'
$r = Invoke-WebRequest -Uri http://localhost:3001/api/hands -Method POST -Body $hand -ContentType "application/json" -UseBasicParsing
$id = ($r.Content | ConvertFrom-Json).id
# → 201

Invoke-WebRequest -Uri "http://localhost:3001/api/hands/$id" -Method PATCH -Body '{"notes":"test"}' -ContentType "application/json" -UseBasicParsing
# → 200, notes updated

Invoke-WebRequest -Uri "http://localhost:3001/api/hands/$id" -Method DELETE -UseBasicParsing
# → 200, { message: "Mano eliminada correctamente" }
```

### HTTP codes esperados

| Código | Escenario                        |
| ------ | -------------------------------- |
| 200    | GET list, GET by id, PATCH, DELETE |
| 201    | POST (creación exitosa)          |
| 400    | POST/PATCH con datos inválidos   |
| 404    | GET/PATCH/DELETE con id inexistente |
| 500    | Error interno del servidor       |

---

## 2. Frontend

```bash
npm run dev        # http://localhost:5173
```

### Prerrequisito

El servidor debe estar corriendo en `http://localhost:3001`.  
Si no, la app muestra pantalla de error con botón **Reintentar**.

### Test cases

#### 2a. Pantalla de carga y error

| Paso | Acción                                    | Resultado esperado                              |
| ---- | ----------------------------------------- | ----------------------------------------------- |
| 1    | Abrir `http://localhost:5173`             | Spinner "Cargando datos..."                     |
| 2    | Tras ~500ms                               | Datos cargados (dashboard Home)                 |
| 3    | Parar el servidor, recargar               | Pantalla error "No se pudo conectar..." + retry |
| 4    | Click "Reintentar"                        | Spinner, luego éxito si server revive           |

#### 2b. Sesiones (Home)

| Paso | Acción                                                 | Resultado esperado                                           |
| ---- | ------------------------------------------------------ | ------------------------------------------------------------ |
| 1    | Click "Nueva Sesión"                                   | Modal se abre                                                |
| 2    | Dejar buy-in vacío, click "Guardar"                    | Error rojo "El dinero invertido es requerido"                |
| 3    | Llenar todos los campos, click "Guardar"               | Modal se cierra, toast "✅ Sesión registrada correctamente", sesión aparece en lista |
| 4    | Click ✕ en sesión                                      | Sesión eliminada, desaparece de lista                        |
| 5    | Click filtro "Torneo"                                  | Solo sesiones de torneo visibles                             |
| 6    | Click "Todas"                                          | Todas las sesiones visibles                                  |

#### 2c. Manos (Hands)

| Paso | Acción                                                 | Resultado esperado                                           |
| ---- | ------------------------------------------------------ | ------------------------------------------------------------ |
| 1    | Nav → Hands                                            | Pantalla con carga, luego stats vacíos + lista vacía         |
| 2    | Click "+ Nueva Mano"                                   | Modal se abre                                                |
| 3    | Dejar cartas vacío, click "Guardar"                    | Error "Las cartas son requeridas"                            |
| 4    | Llenar cartas + resultado, click "Guardar"             | Modal se cierra, toast verde, mano aparece en lista          |
| 5    | Hover sobre mano                                       | Aparece botón ✕ de eliminar                                  |
| 6    | Click ✕                                                | Mano eliminada                                               |
| 7    | Click en mano                                          | Se expande detalle (notas, tags, etc.)                       |
| 8    | Click "Marcar como estudiada"                          | Tag "estudiada" aparece, botón cambia a "✓ Estudiada"        |
| 9    | Escribir en buscador                                   | Filtra manos por texto                                       |
| 10   | Usar filtro resultado / posición                       | Filtra manos                                                |

#### 2d. Plan de Estudio

| Paso | Acción                                                 | Resultado esperado                                           |
| ---- | ------------------------------------------------------ | ------------------------------------------------------------ |
| 1    | Nav → Study                                            | 10 flashcards seedeadas, progreso general 0%                 |
| 2    | Click en ítem                                          | Se marca como completado (check + tachado)                   |
| 3    | Click filtro por calle                                 | Solo items de esa calle                                      |
| 4    | Escribir en buscador                                   | Filtra temas                                                |

#### 2e. Login (opcional)

| Paso | Acción                                                 | Resultado esperado                                           |
| ---- | ------------------------------------------------------ | ------------------------------------------------------------ |
| 1    | Nav → "Iniciar Sesión"                                 | Formulario login/registro                                    |
| 2    | Click "Entrar" sin datos                               | Error "Completa todos los campos"                            |
| 3    | Password < 6 chars                                     | Error "La contraseña debe tener al menos 6 caracteres"       |
| 4    | Registro exitoso                                       | Redirige a Home, navbar muestra username                     |
| 5    | Click "Salir"                                          | Vuelve a estado no autenticado                               |

#### 2f. 404

| Paso | Acción                                                 | Resultado esperado                                           |
| ---- | ------------------------------------------------------ | ------------------------------------------------------------ |
| 1    | Navegar a `/xyz`                                       | Página 404 🃏 con botón "Volver al Home"                    |

#### 2g. Diseño responsive

| Breakpoint | Comportamiento esperado                              |
| ---------- | ---------------------------------------------------- |
| ≥1024px    | Layout de escritorio: 4 columnas de stats, navbar completo |
| 768-1023px | Tablet: 2-3 columnas, layout adaptado                |
| <768px     | Mobile: 1-2 columnas, flex-wrap activo, sin overflow horizontal |
| <400px     | Filtros con wrap, modales full-width                 |

Verificar en cada página:
- ✅ Sin scroll horizontal
- ✅ Botones alcanzables con el pulgar
- ✅ Texto no se corta
- ✅ Modales ocupan todo el ancho en mobile

---

## 3. Bugs encontrados y corregidos

| #  | Archivo          | Bug                                                      | Fix                                      |
| -- | ---------------- | -------------------------------------------------------- | ---------------------------------------- |
| 1  | `App.tsx:10`     | Usa `loading` que ya no existe (renombrado a `authLoading`) | Cambiado a `authLoading`               |
| 2  | `Home.tsx:341`   | `deleteSession` async no await-ed                        | `.catch(() => {})`                      |
| 3  | `Home.tsx:409`   | `updateFlashcard` async no await-ed                      | `async/await` + `try/catch`             |
| 4  | `Home.tsx:17`    | `currentCard` no se sincroniza si flashcards cambian     | `useEffect` que clampa el valor         |
| 5  | `Home.tsx:266`   | `grid-cols-4` sin breakpoint → roto en mobile            | `grid-cols-2 md:grid-cols-4`           |
| 6  | `Home.tsx:120,169,294` | Padding/flex sin responsive                        | `p-4 md:p-8`, `flex-wrap`, `p-6 md:p-12` |
| 7  | `Hands.tsx:137`  | Toast de confirmación renderizado sin condición          | Envuelto en `{confirmText && ...}`       |
| 8  | `Hands.tsx:256`  | Falta clase `group` en el div padre del delete button    | Añadido `group`                         |
| 9  | `Hands.tsx:79`   | `.sort()` muta el array dentro de `useMemo`              | `[...filtered].sort(...)`               |
| 10 | `Hands.tsx:145,152` | Header padding no responsive, stats overflow         | `p-4 md:p-8`, `flex-wrap`               |
| 11 | `Hands.tsx:290,317` | `deleteHand`/`updateHand` async no await-ed          | `async/await` + `try/catch`             |
| 12 | `Hands.tsx:361,377,398` | Grids del modal sin breakpoint responsive       | `grid-cols-1 md:grid-cols-2`            |
| 13 | `Hands.tsx:290`  | Delete button invisible por falta de `group`             | Añadido `group` al contenedor           |
| 14 | `server/*/services/*.ts` | Spread `id` después de `data` → `data.id` sobreescribe la UUID | `...data, id: crypto.randomUUID()` |
| 15 | `Study.tsx:69,92` | Header padding no responsive, grid saltaba de 2→5 columnas | `p-4 md:p-8`, `md:grid-cols-3` añadido |
| 16 | `NotFound.tsx:5` | `py-20` no responsive                                    | `py-10 md:py-20`                        |

---

## 4. Resumen de cobertura

| Funcionalidad       | Estado |
| ------------------- | ------ |
| API endpoints       | ✅ 13/13 endpoints funcionando |
| Validación (400)    | ✅ Campos requeridos, tipos incorrectos |
| 404 en API          | ✅ Recurso inexistente |
| Carga y error UI    | ✅ AsyncHandler con spinner/error/retry |
| Sesiones CRUD       | ✅ Crear, listar, eliminar |
| Manos CRUD          | ✅ Crear, listar, actualizar, eliminar |
| Study plan          | ✅ Ver, filtrar, toggle completado |
| Flashcards          | ✅ Ver, navegar, flip, marcar estudiada |
| Login Supabase      | ✅ Login, registro, logout |
| Diseño responsive   | ✅ 4 breakpoints testeados |
| Errores consola     | ✅ Build limpio, sin TS errors |
| Console runtime     | ✅ Sin warnings ni errores (verificado) |
