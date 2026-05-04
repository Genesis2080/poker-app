# Metodologías Ágiles: Agile, Scrum y Kanban

## ¿Qué es Agile y su objetivo?
Agile no es una metodología rígida, sino un enfoque mental para la gestión de proyectos, nacido del **Manifiesto Ágil** (2001) redactado por 17 expertos en desarrollo de software. Surge como alternativa al modelo en cascada (Waterfall), que era demasiado lineal y no permitía adaptarse a cambios en los requisitos.

Sus 4 valores fundamentales son:
1. Individuos e interacciones sobre procesos y herramientas
2. Software funcionando sobre documentación extensiva
3. Colaboración con el cliente sobre negociación contractual
4. Respuesta ante el cambio sobre seguir un plan

El objetivo principal de Agile es entregar valor al cliente de forma temprana y continua, mediante ciclos iterativos cortos que permitan adaptarse a cambios en los requisitos, fomentar la colaboración del equipo y priorizar el software funcional como medida principal de progreso.

---

## ¿Qué es Scrum? Conceptos principales
Scrum es el marco de trabajo Agile más utilizado. Divide el trabajo en **sprints**: periodos de tiempo fijos (de 1 a 4 semanas, habitualmente 2) en los que el equipo se compromete a entregar un incremento del producto potencialmente entregable.

### Roles de Scrum
- **Product Owner**: Representa a los stakeholders y al cliente. Gestiona y prioriza el *Product Backlog*, asegura que el equipo trabaje en las tareas con mayor valor para el negocio.
- **Scrum Master**: Facilitador del proceso. Elimina obstáculos que bloquean al equipo, asegura que se sigan las reglas de Scrum y capacita al equipo en la metodología.
- **Equipo de Desarrollo**: Grupo autoorganizado y multifuncional (3-9 personas) que ejecuta el trabajo y entrega los incrementos del producto.

### Conceptos clave
- **Product Backlog**: Lista dinámica y priorizada de todas las funcionalidades, correcciones y mejoras necesarias para el producto. La gestiona el Product Owner.
- **Sprint Backlog**: Subconjunto de elementos del Product Backlog seleccionados para el sprint actual, junto con el plan para completarlos. Durante el sprint no se añaden nuevas tareas.
- **Sprint Planning**: Reunión al inicio del sprint para definir el objetivo del sprint y seleccionar los elementos del backlog que se trabajarán.
- **Daily Scrum**: Reunión diaria de 15 minutos donde el equipo sincroniza su trabajo, revisa progreso y expone bloqueos.
- **Sprint Review**: Al final del sprint, el equipo presenta el incremento completado a los stakeholders para recibir feedback y ajustar el Product Backlog.
- **Sprint Retrospective**: Reunión post-sprint donde el equipo reflexiona sobre su proceso de trabajo y define mejoras para los próximos sprints.

---

## ¿Qué es Kanban y cómo se usa?
Kanban es un método de gestión visual de flujo de trabajo, originado en el sistema de producción de Toyota. Su objetivo es optimizar la eficiencia mediante la visualización del trabajo y la limitación de tareas en curso.

Se implementa usando un **Tablero Kanban**, que consta de:
- **Columnas**: Representan las etapas del flujo de trabajo (ej. Por hacer, En progreso, En revisión, Terminado).
- **Tarjetas**: Cada una representa una tarea individual. Se mueven de columna en columna a medida que avanza el trabajo.
- **Límites WIP (Work In Progress)**: Restricción del número máximo de tarjetas que pueden estar en una columna al mismo tiempo. Esto evita la sobrecarga del equipo y expone cuellos de botella.
- **Sistema Pull**: Los miembros del equipo "tiran" la siguiente tarea de mayor prioridad del backlog solo cuando tienen capacidad, en lugar de recibir tareas asignadas de forma obligatoria.

Kanban no tiene iteraciones fijas ni roles obligatorios, y permite añadir o repriorizar tareas en cualquier momento, siempre que se respeten los límites WIP.

---

## Diferencias entre Scrum y Kanban
| Característica | Scrum | Kanban |
|----------------|-------|--------|
| Iteraciones | Sprints fijos (1-4 semanas) | Flujo continuo, sin iteraciones predefinidas |
| Roles | 3 roles obligatorios (PO, Scrum Master, Equipo) | Sin roles obligatorios, se adapta a la estructura existente |
| Planificación | Trabajo planificado por sprint, sin cambios durante el sprint | Trabajo se añade/reprioriza en cualquier momento, respetando límites WIP |
| Eventos | 4 eventos obligatorios (Planning, Daily, Review, Retrospective) | Sin eventos obligatorios |
| Entrega | Incrementos al final de cada sprint | Entrega continua a medida que se completan las tareas |
| Estructura | Marco prescriptivo con reglas definidas | Marco flexible, no disruptivo con procesos existentes |

---

## ¿Cuándo usar cada metodología?
### Usar Scrum cuando:
- El proyecto tiene requisitos cambiantes o poco definidos inicialmente.
- Se necesita una cadencia regular de feedback y entregas.
- El equipo se beneficia de una estructura clara y roles definidos.
- Se trabaja en desarrollo de nuevos productos o proyectos complejos con alcance variable.

### Usar Kanban cuando:
- El equipo gestiona flujos de trabajo constantes y repetitivos (ej. mantenimiento de software, soporte técnico, operaciones).
- Se busca mejorar el flujo de trabajo existente sin realizar cambios disruptivos.
- No se requieren iteraciones fijas, y el trabajo debe entregarse de forma continua.
- Se quiere limitar la carga de trabajo del equipo y reducir cuellos de botella de forma visual.
