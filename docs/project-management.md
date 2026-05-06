# Gestión del Proyecto - Poker App

## Estructura de Documentación

### `/docs` - Documentación del Proyecto
- **`agile.md`**: Investigación sobre metodologías Agile, Scrum y Kanban
- **`idea.md`**: Descripción inicial de la aplicación, funcionalidades y mejoras futuras
- **`kanban.md`**: Tablero Kanban simulado con tareas técnicas (alternativa a Trello)
- **`project-management.md`**: Este archivo - Documento de organización del trabajo

### `/src` - Código Fuente
```
src/
├── components/     # Componentes reutilizables (UI.tsx)
├── context/        # Estado global (AppContext.tsx)
├── data/           # Datos estáticos (studyPlan.ts)
├── hooks/          # Custom hooks (vacío actualmente)
├── pages/          # Páginas principales (Home.tsx, Study.tsx)
├── types/          # Definición de tipos TypeScript (index.ts)
├── utils/          # Utilidades (vacío actualmente)
├── App.tsx         # Configuración de rutas
├── index.css       # Estilos globales y variables CSS
└── main.tsx        # Punto de entrada
```

---

## Organización del Trabajo

### 1. Metodología: Kanban Simplificado
Utilizamos un enfoque Kanban documentado en `docs/kanban.md` con las columnas:
- **⬇️ Backlog**: Ideas futuras y funcionalidades opcionales
- **📋 Todo**: Tareas listas para desarrollo
- **🔵 In Progress**: Tareas en desarrollo activo
- **🟣 Review**: Tareas listas para revisión
- **✅ Done**: Tareas completadas

### 2. Flujo de Trabajo
1. **Investigación**: Investigar requisitos (ej. metodologías Agile)
2. **Documentación**: Crear/actualizar docs en `/docs`
3. **Desarrollo**: 
   - Crear/modificar componentes en `/src/pages`
   - Definir tipos en `/src/types`
   - Configurar estado en `/src/context`
   - Crear datos estáticos en `/src/data` si es necesario
4. **Corrección**: Fix errores de TypeScript y preparación para deploy
5. **Verificación**: Build local con `vite build` antes de push

### 3. Persistencia de Datos
- **Sin backend**: La aplicación usa `localStorage` para persistencia
- **Context API**: Manejo de estado con `AppContext.tsx`
- **Clave de almacenamiento**: `practice-app-data`

### 4. Gestión de Tipos TypeScript
- Tipos centralizados en `src/types/index.ts`
- Interfaces para: `Hand`, `StudyPlanItem`, `Flashcard`, `AppStats`
- Validación estricta con `verbatimModuleSyntax: true` en `tsconfig.app.json`

### 5. Estilos y UI
- **Tailwind CSS 4** para estilos utilitarios
- **Variables CSS personalizadas** en `index.css` (ej. `--accent`, `--surface`, `--text`)
- **Fuentes**: 
  - `--font-display`: Para títulos (Inter)
  - `--font-body`: Para texto general (Inter)
  - `--font-mono`: Para datos/código (JetBrains Mono)

---

## Tareas Completadas (Done)

### ✅ Fase 1: Configuración Inicial
- [x] Inicializar proyecto con Vite + React 19 + TypeScript
- [x] Configurar Tailwind CSS 4
- [x] Configurar React Router DOM 7
- [x] Crear estructura base de carpetas
- [x] Configurar Context API con localStorage

### ✅ Fase 2: Investigación y Documentación
- [x] Investigar metodologías Agile, Scrum y Kanban
- [x] Crear `docs/agile.md` con la investigación
- [x] Definir idea del proyecto en `docs/idea.md`
- [x] Crear tablero Kanban simulado en `docs/kanban.md`

### ✅ Fase 3: Página de Plan de Estudios (Study)
- [x] Crear `src/data/studyPlan.ts` con 20 temas organizados por calles
- [x] Crear componentes UI básicos (`PageHeader`, `Badge`) en `src/components/UI.tsx`
- [x] Definir variables CSS en `src/index.css`
- [x] Actualizar tipos en `src/types/index.ts` (añadir `description`, `category`)
- [x] Crear `src/pages/Study.tsx` con:
  - [x] Vista por calles (Preflop, Flop, Turn, River, General)
  - [x] Barra de progreso total y por categoría
  - [x] Filtros por categoría y búsqueda
  - [x] Vista expandible para descripciones
  - [x] Checkbox interactivo para marcar completados
- [x] Configurar ruta en `src/App.tsx`

### ✅ Fase 4: Preparación para Deploy
- [x] Eliminar referencias a IA/Ollama del proyecto
- [x] Corregir errores de TypeScript (`ReactNode` type-only import)
- [x] Arreglar barras de progreso (calcular desde datos dinámicos)
- [x] Eliminar script de Trello (`scripts/import-to-trello.js`)
- [x] Verificar build local exitoso (`vite build`)

---

## Tareas Pendientes (Todo/Backlog)

### 📋 Por Hacer
- [ ] **Página de Manos (Hands)**: Crear `src/pages/Hands.tsx` con:
  - [ ] Formulario de registro de manos
  - [ ] Lista de manos registradas
  - [ ] Parser de Hand History (opcional)
- [ ] **Flashcards con SM-2**: Implementar sistema de repetición espaciada
- [ ] **Estadísticas avanzadas**: Gráficos con Recharts/Chart.js

### ⬇️ Backlog (Futuro)
- [ ] Modo oscuro/claro
- [ ] Exportación de datos (JSON/CSV/PDF)
- [ ] Importación automática de Hand History
- [ ] Reproductor visual de manos
- [ ] Análisis de rivales
- [ ] Base de datos externa (Firebase/Supabase) - **Requeriría backend**

---

## Convenciones de Código

### Commits
- Formato: `tipo: descripción breve`
- Ejemplos:
  - `feat: agregar página de plan de estudios`
  - `fix: corregir barras de progreso en Study`
  - `docs: investigación sobre metodologías Agile`
  - `refactor: eliminar referencias a IA/Ollama`

### Nombrado
- **Archivos**: PascalCase para páginas (`Study.tsx`, `Home.tsx`), camelCase para utilidades (`studyPlan.ts`)
- **Componentes**: PascalCase (`PageHeader`, `Checkbox`)
- **Funciones**: camelCase (`toggleItem`, `getItemsForStreet`)
- **Variables CSS**: kebab-case con doble guion (`--font-display`, `--border2`)

---

## Deploy y Entorno

### Entorno de Desarrollo
```bash
npm run dev    # Inicia servidor Vite en localhost:5173
```

### Build para Producción
```bash
npm run build  # Genera carpeta dist/
npm run preview  # Previsualiza build localmente
```

### Despliegue en Vercel
- **Configuración**: Automático desde rama `main` en GitHub
- **Requisitos**: 
  - ✅ TypeScript sin errores (`tsc -b`)
  - ✅ Build exitoso de Vite
  - ✅ Sin `as const` inválidos en objetos de estilo
  - ✅ Imports type-only para tipos (`import type { ... }`)

---

## Notas Importantes

1. **Sin Backend**: La aplicación funciona 100% en el cliente con `localStorage`
2. **React 19**: Uso de la nueva transformación JSX (no requiere importar `React`)
3. **TypeScript Estricto**: Errores deben corregirse antes de push a `main`
4. **Vercel**: El deploy fallará si hay errores de TypeScript no corregidos
5. **Política de Scripts en Windows**: Usar `cmd /c` si PowerShell bloquea `npx`

---

Última actualización: Mayo 2026
