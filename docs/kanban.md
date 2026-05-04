# Tablero Kanban - Poker App

Representación local del tablero Trello con columnas: **Backlog**, **Todo**, **In Progress**, **Review**, **Done**.

---

## 🟢 Hecho
### [x] Configuración inicial del proyecto
**Subtareas técnicas:**
- [x] Inicializar proyecto con Vite + React 19
- [x] Configurar TypeScript
- [x] Instalar y configurar Tailwind CSS 4
- [x] Configurar React Router DOM 7
- [x] Crear estructura base de carpetas (`src/components`, `src/pages`, `src/types`, etc.)

### [x] Página de inicio (Home) funcional
**Subtareas técnicas:**
- [x] Diseñar interfaz con estadísticas básicas usando Tailwind
- [x] Implementar componentes de estadísticas (Hero, Hands, Study progress)
- [x] Configurar navegación entre páginas (Home, Hands, Study)

---

## 🟡 In Progress
### [ ] Registro y gestión de manos de póker
**Subtareas técnicas:**
- [ ] Definir tipos TypeScript para `Hand` (fecha, posición, cartas, resultado, stakes, mesa, formato)
- [ ] Crear `HandService` para operaciones CRUD con localStorage
- [ ] Implementar página de lista de manos (`/hands`)
- [ ] Crear formulario de registro/edición de manos con validación
- [ ] Añadir sistema de etiquetas (bluff, value bet, hero call) y notas
- [ ] Implementar parser de Hand History de PokerStars (opcional)

---

## 🔵 Todo
### [ ] Plan de estudios estructurado
**Subtareas técnicas:**
- [ ] Definir tipos TypeScript para `StudyTopic` (calle, título, descripción, prioridad, estado)
- [ ] Crear `StudyService` para persistencia en localStorage
- [ ] Implementar página de plan de estudios (`/study`)
- [ ] Añadir filtros por calle (Preflop, Flop, Turn, River, General) y estado
- [ ] Implementar marcado de temas como completados
- [ ] Añadir funcionalidad de priorización (alta/media/baja)

### [ ] Flashcards con repetición espaciada (SM-2)
**Subtareas técnicas:**
- [ ] Definir tipos TypeScript para `Flashcard` (pregunta, respuesta, categoría, facilidad, última revisión)
- [ ] Implementar algoritmo SM-2 para cálculo de próxima revisión
- [ ] Crear interfaz de creación de flashcards
- [ ] Implementar flujo de revisión diaria
- [ ] Añadir seguimiento de historial de revisiones

### [ ] Panel de estadísticas avanzado
**Subtareas técnicas:**
- [ ] Calcular métricas de póker (VPIP, PFR, 3-bet, C-bet) desde datos de manos
- [ ] Implementar gráficos de evolución con librería (ej. Chart.js o Recharts)
- [ ] Mostrar progreso de plan de estudios y flashcards pendientes
- [ ] Añadir exportación de estadísticas a JSON/CSV

---

## 🟣 Review
*(No hay tarjetas en revisión actualmente)*

---

## ⚫ Backlog
### [ ] Persistencia de datos con localStorage
**Subtareas técnicas:**
- [ ] Implementar guardado automático para todas las entidades
- [ ] Manejar serialización/deserialización de fechas en localStorage
- [ ] Añadir migración de datos para cambios en modelos

### [ ] Modo oscuro/claro
**Subtareas técnicas:**
- [ ] Configurar Tailwind dark mode con `class` strategy
- [ ] Implementar toggle de tema en navbar
- [ ] Persistir preferencia de tema en localStorage

### [ ] Exportación de datos
**Subtareas técnicas:**
- [ ] Implementar exportación de manos a JSON/CSV
- [ ] Añadir generación de PDF con resumen de estadísticas
- [ ] Implementar importación de datos desde archivo

## Movimiento de tarjetas simulado
1. **Configuración inicial** y **Home page** → Done (completadas)
2. **Gestión de manos** → In Progress (trabajando en modelos y servicios)
3. Resto de funcionalidades → Todo/Backlog según prioridad
4. Al completar desarrollo → Mover a Review para validación
5. Tras aprobación → Mover a Done
