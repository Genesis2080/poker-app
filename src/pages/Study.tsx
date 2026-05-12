import { useState, useMemo } from 'react'
import type { StudyPlanItem } from '../types'
import { useApp } from '../context/AppContext'
import { AsyncHandler } from '../components/AsyncHandler'
import {
  STREET_ORDER,
  STREET_COLORS,
  STREET_LABELS,
  CATEGORY_COLORS,
} from '../data/studyPlan'

export default function Study() {
  const { data, toggleStudyItem, dataLoading, dataError, retryLoadData } = useApp()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const studyArray: StudyPlanItem[] = Array.isArray(data.studyPlan) ? data.studyPlan : []

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

  const filtered = useMemo(() => {
    let items = studyArray
    if (filter !== 'all') {
      items = items.filter(i => i.street === filter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      items = items.filter(i =>
        i.topic.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q)
      )
    }
    return items
  }, [studyArray, filter, search])

  return (
    <AsyncHandler loading={dataLoading} error={dataError} onRetry={retryLoadData}>
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 rounded-2xl p-4 md:p-8 border border-purple-800/30">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Plan de Estudio
        </h1>
        <p className="text-gray-400 mt-2">Sigue tu progreso en cada área del póker</p>
      </div>

      {/* Progreso general */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-200">Progreso General</h2>
          <span className="text-2xl font-bold text-purple-400">{overall.percentage}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${overall.percentage}%` }}
          />
        </div>
        <p className="text-gray-500 text-sm mt-2">{overall.completed} de {overall.total} completados</p>
      </div>

      {/* Progreso por calle */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {[...STREET_ORDER, 'general' as const].map(street => {
          const stat = byStreet[street]
          const colors = STREET_COLORS[street as keyof typeof STREET_COLORS] || { bg: 'rgba(107,114,128,0.08)', border: 'rgba(107,114,128,0.2)', text: '#9ca3af' }
          return (
            <button
              key={street}
              onClick={() => setFilter(filter === street ? 'all' : street)}
              className={`rounded-xl p-4 border text-left transition-all ${
                filter === street ? 'ring-2 ring-purple-500' : ''
              }`}
              style={{ backgroundColor: colors.bg, borderColor: colors.border }}
            >
              <div className="text-sm font-medium" style={{ color: colors.text }}>
                {STREET_LABELS[street] || street.charAt(0).toUpperCase() + street.slice(1)}
              </div>
              <div className="text-2xl font-bold text-gray-200 mt-1">{stat.percentage}%</div>
              <div className="text-xs text-gray-500 mt-1">{stat.completed}/{stat.total}</div>
            </button>
          )
        })}
      </div>

      {/* Buscador */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar temas..."
        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />

      {/* Lista de temas */}
      <div className="space-y-2">
        {filtered.map((item) => {
          const colors = STREET_COLORS[item.street as keyof typeof STREET_COLORS] || { bg: 'rgba(107,114,128,0.08)', border: 'rgba(107,114,128,0.2)', text: '#9ca3af' }
          const catColor = CATEGORY_COLORS[item.category]
          return (
            <div
              key={item.id}
              onClick={() => toggleStudyItem(item.id)}
              className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-gray-600 cursor-pointer transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  item.completed ? 'bg-green-500 border-green-500' : 'border-gray-500'
                }`}>
                  {item.completed && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium ${item.completed ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                    {item.topic}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1 leading-relaxed">{item.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs px-2.5 py-1 rounded-md font-medium" style={{ backgroundColor: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}>
                      {STREET_LABELS[item.street] || item.street}
                    </span>
                    {catColor && (
                      <span className="text-xs px-2.5 py-1 rounded-md" style={{ backgroundColor: catColor.bg, color: catColor.text }}>
                        {catColor.label}
                      </span>
                    )}
                    <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                      item.priority === 'high' ? 'bg-red-900/20 text-red-400' :
                      item.priority === 'medium' ? 'bg-yellow-900/20 text-yellow-400' :
                      'bg-gray-900/20 text-gray-400'
                    }`}>
                      {item.priority === 'high' ? 'Alta' : item.priority === 'medium' ? 'Media' : 'Baja'}
                    </span>
                  </div>
                </div>
                <svg className={`w-5 h-5 text-gray-500 flex-shrink-0 mt-1 transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No hay temas que coincidan con los filtros
          </div>
        )}
      </div>
    </div>
    </AsyncHandler>
  )
}
