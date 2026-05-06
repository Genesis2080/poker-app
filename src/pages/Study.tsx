import { useState, useMemo } from 'react'
import type { StudyPlanItem } from '../types'
import { useApp } from '../context/AppContext'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import {
  STREET_ORDER,
  STREET_COLORS,
  STREET_LABELS,
  CATEGORY_COLORS,
  INITIAL_STUDY_PLAN,
} from '../data/studyPlan'

export default function Study() {
  const { data, setData } = useApp()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const studyArray: StudyPlanItem[] = Array.isArray(data.studyPlan) ? data.studyPlan : []

  const toggleItem = (itemId: string) => {
    setData(prev => ({
      ...prev,
      studyPlan: prev.studyPlan.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      ),
    }))
  }

  const resetAll = () => {
    const allItems = Object.values(INITIAL_STUDY_PLAN).flat()
    setData(prev => ({ ...prev, studyPlan: JSON.parse(JSON.stringify(allItems)) }))
  }

  const overall = useMemo(() => {
    const completed = studyArray.filter(i => i.completed).length
    const total = studyArray.length
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    }
  }, [studyArray])

  const byStreet = useMemo(() => {
    const result: Record<string, { percentage: number; completed: number; total: number }> = {}
    for (const street of STREET_ORDER) {
      const items = studyArray.filter(i => i.street === street)
      const completed = items.filter(i => i.completed).length
      result[street] = {
        completed,
        total: items.length,
        percentage: items.length > 0 ? Math.round((completed / items.length) * 100) : 0,
      }
    }
    const generalItems = studyArray.filter(i => i.street === 'general')
    const generalCompleted = generalItems.filter(i => i.completed).length
    result['general'] = {
      completed: generalCompleted,
      total: generalItems.length,
      percentage: generalItems.length > 0 ? Math.round((generalCompleted / generalItems.length) * 100) : 0,
    }
    return result
  }, [studyArray])

  const categories = useMemo(() => {
    const cats = new Set<string>()
    studyArray.forEach(i => cats.add(i.category))
    return Array.from(cats)
  }, [studyArray])

  const filteredStudyArray = useMemo(() => {
    let filtered = studyArray
    if (filter !== 'all') {
      filtered = filtered.filter(i => i.category === filter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      filtered = filtered.filter(i =>
        i.topic.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
      )
    }
    return filtered
  }, [studyArray, filter, search])

  const streetData = useMemo(() => {
    return STREET_ORDER.map(street => {
      const items = filteredStudyArray.filter(i => i.street === street)
      const completed = items.filter(i => i.completed).length
      return {
        street,
        label: STREET_LABELS[street],
        colors: STREET_COLORS[street],
        items,
        completed,
        total: items.length,
        percentage: items.length > 0 ? Math.round((completed / items.length) * 100) : 0,
      }
    })
  }, [filteredStudyArray])

  const generalItems = useMemo(() => {
    const items = filteredStudyArray.filter(i => i.street === 'general')
    const completed = items.filter(i => i.completed).length
    return { items, completed, total: items.length, percentage: items.length > 0 ? Math.round((completed / items.length) * 100) : 0 }
  }, [filteredStudyArray])

  return (
    <div className="space-y-6">
      {/* Header elegante */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-2xl p-8 border border-indigo-800/30">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Plan de Estudios
          </h1>
          <p className="text-gray-400 mt-2">Domina el póker calle por calle</p>
        </div>
        <div className="mt-6 flex items-center gap-4">
          <div className="bg-gray-800/80 backdrop-blur rounded-xl px-6 py-3 border border-gray-700">
            <div className="text-3xl font-bold text-indigo-400">{overall.percentage}%</div>
            <div className="text-gray-500 text-xs">Progreso total</div>
          </div>
          <div className="bg-gray-800/80 backdrop-blur rounded-xl px-6 py-3 border border-gray-700">
            <div className="text-3xl font-bold text-green-400">{overall.completed}<span className="text-gray-500 text-lg">/{overall.total}</span></div>
            <div className="text-gray-500 text-xs">Temas completados</div>
          </div>
          <Button variant="ghost" onClick={resetAll} className="ml-auto">
            Resetear todo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search */}
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <Input
              label="Buscar tema"
              type="text"
              value={search}
              onChange={setSearch}
              placeholder="Ej: c-bet, flush..."
              noMargin
            />
          </div>

          {/* Filtros por categoría */}
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Categorías</h4>
            <div className="space-y-1">
              <button
                onClick={() => setFilter('all')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  filter === 'all' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700/50'
                }`}
              >
                Todas
              </button>
              {categories.map(cat => {
                const colors = CATEGORY_COLORS[cat]
                return (
                  <button
                    key={cat}
                    onClick={() => setFilter(filter === cat ? 'all' : cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                      filter === cat ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700/50'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors?.text || '#666' }}></span>
                    {colors?.label || cat}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Progreso por calle */}
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Por Calle</h4>
            <div className="space-y-3">
              {STREET_ORDER.map(street => {
                const p = byStreet[street] || { percentage: 0, completed: 0, total: 0 }
                const colors = STREET_COLORS[street]
                return (
                  <div key={street}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: colors.text }}>{STREET_LABELS[street]}</span>
                      <span className="text-gray-500">{p.completed}/{p.total}</span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${p.percentage}%`, backgroundColor: colors.text }}
                      ></div>
                    </div>
                  </div>
                )
              })}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-indigo-400">General</span>
                  <span className="text-gray-500">{byStreet.general?.completed || 0}/{byStreet.general?.total || 0}</span>
                </div>
                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all duration-300"
                    style={{ width: `${byStreet.general?.percentage || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {streetData.map(({ street, label, colors, items, completed, total, percentage }) => (
            <div key={street} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="px-6 py-4 flex items-center justify-between" style={{ backgroundColor: `${colors.bg}` }}>
                <div className="flex items-center gap-3">
                  <span className="font-semibold" style={{ color: colors.text }}>{label}</span>
                  <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${colors.text}20`, color: colors.text }}>
                    {completed}/{total}
                  </span>
                </div>
                <span className="text-sm font-mono" style={{ color: colors.text }}>{percentage}%</span>
              </div>
              <div className="divide-y divide-gray-700/50">
                {items.map(item => (
                  <StudyItem key={item.id} item={item} onToggle={() => toggleItem(item.id)} />
                ))}
                {items.length === 0 && (
                  <div className="px-6 py-8 text-center text-gray-500 text-sm">
                    No hay temas en esta categoría
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* General Section */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between" style={{ backgroundColor: 'rgba(99,102,241,0.08)' }}>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-indigo-400">General</span>
                <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-400">
                  {generalItems.completed}/{generalItems.total}
                </span>
              </div>
              <span className="text-sm font-mono text-indigo-400">{generalItems.percentage}%</span>
            </div>
            <div className="divide-y divide-gray-700/50">
              {generalItems.items.map(item => (
                <StudyItem key={item.id} item={item} onToggle={() => toggleItem(item.id)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StudyItem({ item, onToggle }: { item: StudyPlanItem; onToggle: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const catColors = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.fundamentos

  return (
    <div className={`px-6 py-4 transition-colors ${expanded ? 'bg-gray-700/30' : 'hover:bg-gray-700/20'}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={onToggle}
          className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
            item.completed
              ? 'bg-green-500 border-green-500'
              : 'border-gray-600 hover:border-gray-500'
          }`}
        >
          {item.completed && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
        <div className="flex-1 min-w-0">
          <div
            className={`text-sm cursor-pointer ${item.completed ? 'text-gray-500 line-through' : 'text-gray-200'}`}
            onClick={() => setExpanded(!expanded)}
          >
            {item.topic}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="text-xs px-2 py-0.5 rounded"
              style={{ backgroundColor: `${catColors.bg}`, color: catColors.text }}
            >
              {catColors.label}
            </span>
            <span className="text-xs text-gray-500">{expanded ? '▲' : '▼'}</span>
          </div>
        </div>
      </div>
      {expanded && (
        <div className="mt-3 ml-8 p-4 bg-gray-900/50 rounded-lg text-sm text-gray-400 leading-relaxed">
          {item.description}
        </div>
      )}
    </div>
  )
}
