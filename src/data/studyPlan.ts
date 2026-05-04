export interface StudyItem {
  id: string
  topic: string
  description: string
  street: 'preflop' | 'flop' | 'turn' | 'river' | 'general'
  category: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
}

export const STREET_ORDER = ['preflop', 'flop', 'turn', 'river'] as const

export const STREET_LABELS: Record<string, string> = {
  preflop: 'Preflop',
  flop: 'Flop',
  turn: 'Turn',
  river: 'River',
}

export const STREET_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  preflop: { bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.2)', text: '#4ade80' },
  flop: { bg: 'rgba(56,189,248,0.08)', border: 'rgba(56,189,248,0.2)', text: '#38bdf8' },
  turn: { bg: 'rgba(251,146,60,0.08)', border: 'rgba(251,146,60,0.2)', text: '#fb923c' },
  river: { bg: 'rgba(244,114,182,0.08)', border: 'rgba(244,114,182,0.2)', text: '#f472b6' },
}

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  fundamentos: { bg: 'rgba(74,222,128,0.1)', text: '#4ade80', label: 'Fundamentos' },
  estrategia: { bg: 'rgba(56,189,248,0.1)', text: '#38bdf8', label: 'Estrategia' },
  matematicas: { bg: 'rgba(251,146,60,0.1)', text: '#fb923c', label: 'Matemáticas' },
  psicologia: { bg: 'rgba(244,114,182,0.1)', text: '#f472b6', label: 'Psicología' },
  gto: { bg: 'rgba(168,85,247,0.1)', text: '#a855f7', label: 'GTO' },
  leaks: { bg: 'rgba(239,68,68,0.1)', text: '#ef4444', label: 'Leaks' },
}

export const INITIAL_STUDY_PLAN: Record<string, StudyItem[]> = {
  preflop: [
    { id: 'pf1', topic: 'Ranges de opening por posición', description: 'Estudiar qué manos abrir en cada posición (UTG, MP, CO, BTN, SB, BB). Entender el concepto de posición y cómo afecta el rango.', street: 'preflop', category: 'estrategia', completed: false, priority: 'high' },
    { id: 'pf2', topic: '3-betting', description: 'Cuándo y qué manos 3-betear. Diferenciar entre 3-bet de valor y 3-bet de farol.', street: 'preflop', category: 'estrategia', completed: false, priority: 'high' },
    { id: 'pf3', topic: 'Defensa de ciegas', description: 'Cómo defender las ciegas contra steals. Ranges de call y 3-bet vs steals.', street: 'preflop', category: 'estrategia', completed: false, priority: 'medium' },
    { id: 'pf4', topic: 'Out of position play', description: 'Cómo jugar fuera de posición post-flop. Estrategias de check-raise y control de tamaño de apuesta.', street: 'preflop', category: 'estrategia', completed: false, priority: 'medium' },
    { id: 'pf5', topic: 'Cálculo de odds y equity', description: 'Aprender a calcular rápidamente las odds de bote y la equity necesaria para hacer calls rentables.', street: 'preflop', category: 'matematicas', completed: false, priority: 'high' },
  ],
  flop: [
    { id: 'fl1', topic: 'C-betting', description: 'Cuándo hacer continuation bet. Frecuencias, tamaños y tipos de flops (dry, wet, paired).', street: 'flop', category: 'estrategia', completed: false, priority: 'high' },
    { id: 'fl2', topic: 'Check-raising', description: 'Estrategia de check-raise como farol y como valor. Identificación de spots óptimos.', street: 'flop', category: 'estrategia', completed: false, priority: 'medium' },
    { id: 'fl3', topic: 'Draws y semi-faroles', description: 'Cómo jugar draws (flush draw, straight draw, combo draws). Tamaños de apuesta óptimos.', street: 'flop', category: 'estrategia', completed: false, priority: 'high' },
    { id: 'fl4', topic: 'Float y bluff-catching', description: 'Cómo defender contra C-bets con manos marginales. Identificación de oportunidades de float.', street: 'flop', category: 'estrategia', completed: false, priority: 'medium' },
    { id: 'fl5', topic: 'Pot odds en el flop', description: 'Cálculo de pot odds y implied odds cuando se persiguen draws en el flop.', street: 'flop', category: 'matematicas', completed: false, priority: 'medium' },
  ],
  turn: [
    { id: 'tu1', topic: 'Double barrel', description: 'Cuándo hacer segundo barril. Evaluación de texture shifts y ranges del oponente.', street: 'turn', category: 'estrategia', completed: false, priority: 'high' },
    { id: 'tu2', topic: 'Slowplaying', description: 'Cuándo ralentizar con manos muy fuertes. Riesgos y beneficios del slowplay.', street: 'turn', category: 'estrategia', completed: false, priority: 'low' },
    { id: 'tu3', topic: 'Overbetting', description: 'Uso de overbets en el turn. Polarización de rango y presión máxima.', street: 'turn', category: 'estrategia', completed: false, priority: 'medium' },
    { id: 'tu4', topic: 'Relative hand strength', description: 'Evaluación de la fuerza relativa de la mano según la texture del turn.', street: 'turn', category: 'estrategia', completed: false, priority: 'medium' },
  ],
  river: [
    { id: 'rv1', topic: 'Value betting thin', description: 'Cómo extraer valor con manos medias en el river. Identificación de manos que pagarán.', street: 'river', category: 'estrategia', completed: false, priority: 'high' },
    { id: 'rv2', topic: 'Bluffing en river', description: 'Selección de spots de farol en el river. Uso de blockers y reads de oponentes.', street: 'river', category: 'estrategia', completed: false, priority: 'high' },
    { id: 'rv3', topic: 'Call o fold decisions', description: 'Proceso de toma de decisiones en el river. Cálculo de equity mínima necesaria.', street: 'river', category: 'matematicas', completed: false, priority: 'medium' },
    { id: 'rv4', topic: 'Overbet como farol', description: 'Uso de overbets máximos como farol puro. Cuándo funciona y cuándo no.', street: 'river', category: 'estrategia', completed: false, priority: 'low' },
  ],
  general: [
    { id: 'gn1', topic: 'Gestión de bankroll', description: 'Reglas básicas de bankroll management. Cuántas buy-ins necesitas para cada nivel.', street: 'general', category: 'fundamentos', completed: false, priority: 'high' },
    { id: 'gn2', topic: 'Tilt y control emocional', description: 'Reconocimiento de tilt y estrategias de control emocional. Importancia de la psicología.', street: 'general', category: 'psicologia', completed: false, priority: 'high' },
    { id: 'gn3', topic: 'Tipos de jugadores (TAG, LAG, Fish)', description: 'Cómo identificar y explotar diferentes perfiles de oponentes.', street: 'general', category: 'psicologia', completed: false, priority: 'medium' },
    { id: 'gn4', topic: 'ICM y torneos', description: 'Conceptos básicos de Independent Chip Model y cómo afecta las decisiones en torneos.', street: 'general', category: 'matematicas', completed: false, priority: 'medium' },
    { id: 'gn5', topic: 'GTO vs Exploitative', description: 'Diferencias entre juego GTO y juego explotativo. Cuándo usar cada enfoque.', street: 'general', category: 'gto', completed: false, priority: 'medium' },
  ],
}

export function getOverallProgress(plan: Record<string, StudyItem[]>): { completed: number; total: number; percentage: number } {
  let completed = 0
  let total = 0
  
  for (const street of [...STREET_ORDER, 'general']) {
    if (plan[street]) {
      completed += plan[street].filter(i => i.completed).length
      total += plan[street].length
    }
  }
  
  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  }
}

export function getProgressByStreet(plan: Record<string, StudyItem[]>): Record<string, { percentage: number; completed: number; total: number }> {
  const result: Record<string, { percentage: number; completed: number; total: number }> = {}
  
  for (const street of [...STREET_ORDER, 'general']) {
    if (plan[street]) {
      const completed = plan[street].filter(i => i.completed).length
      const total = plan[street].length
      result[street] = {
        completed,
        total,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      }
    }
  }
  
  return result
}

export function getCategoryProgress(plan: Record<string, StudyItem[]>): Record<string, { percentage: number }> {
  const catCount: Record<string, { completed: number; total: number }> = {}
  
  for (const street of [...STREET_ORDER, 'general']) {
    if (plan[street]) {
      for (const item of plan[street]) {
        if (!catCount[item.category]) {
          catCount[item.category] = { completed: 0, total: 0 }
        }
        catCount[item.category].total++
        if (item.completed) catCount[item.category].completed++
      }
    }
  }
  
  const result: Record<string, { percentage: number }> = {}
  for (const cat of Object.keys(catCount)) {
    const { completed, total } = catCount[cat]
    result[cat] = {
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    }
  }
  
  return result
}
