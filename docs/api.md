# API REST — Poker App

**Base URL:** `http://localhost:3001/api`

---

## Sessions

### `GET /api/sessions`

Lista todas las sesiones.

**Response** `200 OK`
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "date": "2026-05-12",
    "modality": "cash",
    "buyIn": 50,
    "cashOut": 120,
    "timePlayedMinutes": 90
  }
]
```

---

### `GET /api/sessions/:id`

Obtiene una sesión por ID.

**Response** `200 OK`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "date": "2026-05-12",
  "modality": "cash",
  "buyIn": 50,
  "cashOut": 120,
  "timePlayedMinutes": 90
}
```

**Response** `404 Not Found`
```json
{ "error": "Sesión no encontrada" }
```

---

### `POST /api/sessions`

Crea una nueva sesión.

**Request body**
```json
{
  "date": "2026-05-12",
  "modality": "cash",
  "buyIn": 50,
  "cashOut": 120,
  "timePlayedMinutes": 90,
  "tournamentName": "Sunday Special",
  "notes": "Buena sesión"
}
```

**Response** `201 Created`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "date": "2026-05-12",
  "modality": "cash",
  "buyIn": 50,
  "cashOut": 120,
  "timePlayedMinutes": 90,
  "tournamentName": "Sunday Special",
  "notes": "Buena sesión"
}
```

**Response** `400 Bad Request`
```json
{
  "error": "Error de validación",
  "details": [
    { "field": "buyIn", "message": "El buy-in debe ser positivo" }
  ]
}
```

---

### `DELETE /api/sessions/:id`

Elimina una sesión.

**Response** `200 OK`
```json
{ "message": "Sesión eliminada correctamente" }
```

**Response** `404 Not Found`
```json
{ "error": "Sesión no encontrada" }
```

---

## Hands

### `GET /api/hands`

Lista todas las manos registradas.

**Response** `200 OK`
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "date": "2026-05-12",
    "position": "BTN",
    "result": "win",
    "heroHand": "AKs",
    "preflopAction": "raise 3bb",
    "street": "flop",
    "board": "K♦ 7♣ 2♠",
    "potSize": 45,
    "potWon": 45
  }
]
```

---

### `GET /api/hands/:id`

Obtiene una mano por ID.

**Response** `200 OK` — igual que el objeto individual arriba.

**Response** `404 Not Found`
```json
{ "error": "Mano no encontrada" }
```

---

### `POST /api/hands`

Registra una nueva mano.

**Request body**
```json
{
  "date": "2026-05-12",
  "position": "BTN",
  "result": "win",
  "heroHand": "AKs",
  "preflopAction": "raise 3bb",
  "street": "flop",
  "board": "K♦ 7♣ 2♠",
  "potSize": 45,
  "potWon": 45,
  "notes": "C-Bet estándar",
  "tags": ["value", "cb"]
}
```

**Response** `201 Created` — el objeto creado con `id`.

**Response** `400 Bad Request`
```json
{
  "error": "Error de validación",
  "details": [
    { "field": "heroHand", "message": "Las cartas son requeridas" }
  ]
}
```

---

### `PATCH /api/hands/:id`

Actualiza campos parciales de una mano.

**Request body** (todos opcionales)
```json
{
  "notes": "Actualización de análisis post-sesión",
  "tags": ["bluff", "analisis"]
}
```

**Response** `200 OK` — el objeto actualizado.

**Response** `404 Not Found`
```json
{ "error": "Mano no encontrada" }
```

---

### `DELETE /api/hands/:id`

Elimina una mano.

**Response** `200 OK`
```json
{ "message": "Mano eliminada correctamente" }
```

**Response** `404 Not Found`
```json
{ "error": "Mano no encontrada" }
```

---

## Study Plan

### `GET /api/study`

Lista el plan de estudio.

**Response** `200 OK`
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "topic": "Rangos de subida desde SB",
    "description": "Estudiar rangos GTO desde Small Blind vs distintos tamaños de subida",
    "street": "preflop",
    "category": "rangos",
    "completed": false,
    "priority": "high"
  }
]
```

---

### `POST /api/study`

Añade un elemento al plan de estudio.

**Request body**
```json
{
  "topic": "Rangos de subida desde SB",
  "description": "Estudiar rangos GTO",
  "street": "preflop",
  "category": "rangos",
  "priority": "high"
}
```

**Response** `201 Created` — el objeto creado con `id` y `completed: false`.

**Response** `400 Bad Request`
```json
{
  "error": "Error de validación",
  "details": [
    { "field": "topic", "message": "El tema es requerido" }
  ]
}
```

---

### `PATCH /api/study/:id/toggle`

Marca/desmarca un elemento como completado.

**Response** `200 OK`
```json
{
  "id": "550e8400...",
  "topic": "Rangos de subida desde SB",
  "completed": true,
  "...": "..."
}
```

**Response** `404 Not Found`
```json
{ "error": "Elemento de estudio no encontrado" }
```

---

## Flashcards

### `GET /api/flashcards`

Lista todas las flashcards.

---

### `POST /api/flashcards`

Crea una nueva flashcard.

**Request body**
```json
{
  "question": "¿Qué son las pot odds?",
  "answer": "Relación entre el tamaño del bote y lo que hay que pagar",
  "category": "matematicas",
  "difficulty": 3
}
```

**Response** `201 Created`

**Response** `400 Bad Request`
```json
{
  "error": "Error de validación",
  "details": [
    { "field": "difficulty", "message": "Number must be greater than or equal to 1" }
  ]
}
```

---

### `PATCH /api/flashcards/:id`

Actualiza campos de una flashcard.

**Request body**
```json
{ "difficulty": 4, "interval": 5 }
```

**Response** `200 OK`

**Response** `404 Not Found`
```json
{ "error": "Flashcard no encontrada" }
```

---

## Stats

### `GET /api/stats`

Estadísticas agregadas calculadas desde sesiones y manos.

**Response** `200 OK`
```json
{
  "totalHands": 15,
  "winRate": 60,
  "totalSessions": 8,
  "totalInvested": 400,
  "totalWon": 680,
  "roi": 70
}
```

---

## Códigos HTTP

| Código | Significado             |
| ------ | ----------------------- |
| 200    | OK / Éxito              |
| 201    | Creado                  |
| 400    | Error de validación     |
| 404    | Recurso no encontrado   |
| 500    | Error interno           |

---

## Ejecución

```bash
# Desde la raíz del proyecto
cd server
npm install
npm run dev        # Desarrollo con hot reload (puerto 3001)
npm run build      # Compilar TypeScript
npm start          # Producción
```
