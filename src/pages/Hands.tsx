import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import type { GameModality } from '../types'
import type { Hand } from '../types'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Modal } from '../components/Modal'
import { AsyncHandler } from '../components/AsyncHandler'
import { useForm } from '../hooks/useForm'
import { useCalculation } from '../hooks'

const POSITIONS = ['UTG', 'UTG+1', 'UTG+2', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB']
const STREETS = ['preflop', 'flop', 'turn', 'river']
const RESULTS = [
  { value: 'win', label: 'Ganada', color: 'text-green-400 bg-green-900/20' },
  { value: 'loss', label: 'Perdida', color: 'text-red-400 bg-red-900/20' },
  { value: 'even', label: 'Empate', color: 'text-gray-400 bg-gray-900/20' },
]

export default function Hands() {
  const { data, addHand, updateHand, deleteHand, dataLoading, dataError, retryLoadData } = useApp()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filterResult, setFilterResult] = useState<string>('all')
  const [filterPosition, setFilterPosition] = useState<string>('all')
  const [expandedHand, setExpandedHand] = useState<string | null>(null)
  const [confirmText, setConfirmText] = useState('')

  const hands: Hand[] = Array.isArray(data.hands) ? data.hands : []

  const stats = useCalculation(() => {
    const totalHands = hands.length
    const wins = hands.filter(h => h.result === 'win').length
    const losses = hands.filter(h => h.result === 'loss').length
    const winrate = totalHands > 0 ? Math.round((wins / totalHands) * 100) : 0
    
    const totalWon = hands.reduce((sum, h) => sum + (h.result === 'win' ? h.potWon || 0 : 0), 0)
    const totalLost = hands
      .filter(h => h.result === 'loss')
      .reduce((sum, h) => {
        const amount = h.potSize || 0
        return sum + amount
      }, 0)
    
    const netResult = totalWon - totalLost

    // Winrate por posición
    const positionStats: Record<string, { total: number; wins: number }> = {}
    POSITIONS.forEach(pos => {
      const posHands = hands.filter(h => h.position === pos)
      positionStats[pos] = {
        total: posHands.length,
        wins: posHands.filter(h => h.result === 'win').length,
      }
    })

    return { totalHands, wins, losses, winrate, totalWon, totalLost, netResult, positionStats }
  }, [hands])

  const filteredHands = useMemo(() => {
    let filtered = hands

    if (filterResult !== 'all') {
      filtered = filtered.filter(h => h.result === filterResult)
    }
    if (filterPosition !== 'all') {
      filtered = filtered.filter(h => h.position === filterPosition)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      filtered = filtered.filter(h =>
        h.heroHand?.toLowerCase().includes(q) ||
        h.notes?.toLowerCase().includes(q) ||
        h.preflopAction?.toLowerCase().includes(q) ||
        h.tags?.some(t => t.toLowerCase().includes(q))
      )
    }

    return [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [hands, filterResult, filterPosition, search])

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setConfirmText('')
  }

  const { values, errors, handleChange, handleBlur, submitForm, submitError } = useForm(
    {
      date: new Date().toISOString().split('T')[0],
      position: 'BTN',
      result: 'win',
      heroHand: '',
      preflopAction: '',
      street: 'preflop',
      board: '',
      notes: '',
      tags: '',
      potSize: '',
      potWon: '',
      stakes: '',
      tableName: '',
    },
    [
      { field: 'heroHand', rule: (v) => !v ? 'Las cartas son requeridas' : null },
    ],
    async (vals) => {
      const tags = vals.tags ? vals.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      await addHand({
        date: vals.date,
        position: vals.position,
        result: vals.result as 'win' | 'loss' | 'even',
        heroHand: vals.heroHand,
        villainRange: '',
        preflopAction: vals.preflopAction,
        street: vals.street,
        board: vals.board,
        notes: vals.notes,
        tags,
        heroName: 'Hero',
        heroStack: 0,
        potSize: parseFloat(vals.potSize) || 0,
        potWon: parseFloat(vals.potWon) || 0,
        stakes: vals.stakes,
        tableName: vals.tableName,
        tableFormat: '6-max',
        gameType: 'cash',
      })
      setConfirmText('Mano registrada correctamente')
      setIsModalOpen(false)
      setTimeout(() => setConfirmText(''), 2500)
    }
  )

  return (
    <AsyncHandler loading={dataLoading} error={dataError} onRetry={retryLoadData}>
    <div className="space-y-6">
        {confirmText && (
        <div className="fixed top-4 right-4 z-50 bg-green-900/90 text-green-300 px-5 py-3 rounded-xl shadow-2xl border border-green-700/50 backdrop-blur-sm flex items-center gap-2">
          <span>✅</span>
          <span className="font-medium">{confirmText}</span>
        </div>
        )}

      {/* Header elegante */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-2xl p-4 md:p-8 border border-green-800/30">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Hand History
          </h1>
          <p className="text-gray-400 mt-2">Registra y analiza tus manos jugadas</p>
        </div>
        <div className="mt-6 flex items-center gap-4 flex-wrap">
          <div className="bg-gray-800/80 backdrop-blur rounded-xl px-6 py-3 border border-gray-700">
            <div className="text-3xl font-bold text-green-400">{stats.totalHands}</div>
            <div className="text-gray-500 text-xs">Total Manos</div>
          </div>
          <div className="bg-gray-800/80 backdrop-blur rounded-xl px-6 py-3 border border-gray-700">
            <div className={`text-3xl font-bold ${stats.winrate >= 50 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.winrate}%
            </div>
            <div className="text-gray-500 text-xs">Winrate</div>
          </div>
          <div className="bg-gray-800/80 backdrop-blur rounded-xl px-6 py-3 border border-gray-700">
            <div className={`text-3xl font-bold ${stats.netResult >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${stats.netResult.toFixed(2)}
            </div>
            <div className="text-gray-500 text-xs">Resultado Neto</div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="ml-auto px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Mano
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Buscar"
            type="text"
            value={search}
            onChange={setSearch}
            placeholder="Buscar por cartas, notas, acción..."
            noMargin
          />
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Resultado</label>
            <select
              value={filterResult}
              onChange={(e) => setFilterResult(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-green-500"
            >
              <option value="all">Todos</option>
              <option value="win">Ganadas</option>
              <option value="loss">Perdidas</option>
              <option value="even">Empates</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Posición</label>
            <select
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-green-500"
            >
              <option value="all">Todas</option>
              {POSITIONS.map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Gráfica de winrate por posición */}
      {stats.totalHands > 0 && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Winrate por Posición</h3>
          <div className="space-y-3">
            {POSITIONS.map(pos => {
              const stat = stats.positionStats[pos]
              if (!stat || stat.total === 0) return null
              const wr = Math.round((stat.wins / stat.total) * 100)
              return (
                <div key={pos}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-300">{pos}</span>
                    <span className="text-gray-500">{stat.wins}/{stat.total} ({wr}%)</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${wr >= 50 ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${wr}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Lista de manos */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
          <h3 className="font-semibold">Manos Recientes</h3>
          <span className="text-sm text-gray-500">{filteredHands.length} manos</span>
        </div>
        <div className="divide-y divide-gray-700/50">
          {filteredHands.length > 0 ? (
            filteredHands.map(hand => (
              <div key={hand.id} className="px-6 py-4 hover:bg-gray-700/20 transition-colors">
                <div
                  className="flex items-center justify-between cursor-pointer group"
                  onClick={() => setExpandedHand(expandedHand === hand.id ? null : hand.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      hand.result === 'win' ? 'bg-green-900/30 text-green-400' :
                      hand.result === 'loss' ? 'bg-red-900/30 text-red-400' :
                      'bg-gray-900/30 text-gray-400'
                    }`}>
                      {hand.result === 'win' ? 'W' : hand.result === 'loss' ? 'L' : 'E'}
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        {hand.heroHand}
                        <span className="ml-2 text-xs text-gray-500">{hand.position}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(hand.date).toLocaleDateString('es-ES')} • {hand.street}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {hand.tags && hand.tags.length > 0 && (
                      <div className="flex gap-1">
                        {hand.tags.slice(0, 2).map((tag, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 bg-gray-700 rounded">{tag}</span>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={async (e) => {
                        e.stopPropagation()
                        try { await deleteHand(hand.id) } catch {}
                      }}
                      className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {expandedHand === hand.id && (
                  <div className="mt-4 ml-10 p-4 bg-gray-900/50 rounded-lg text-sm text-gray-400 space-y-2">
                    {hand.preflopAction && (
                      <div><span className="text-gray-500">Acción:</span> {hand.preflopAction}</div>
                    )}
                    {hand.board && (
                      <div><span className="text-gray-500">Board:</span> {hand.board}</div>
                    )}
                    {hand.notes && (
                      <div><span className="text-gray-500">Notas:</span> {hand.notes}</div>
                    )}
                    <div className="flex gap-4 pt-2">
                    <button
                      onClick={async () => {
                        const hasStudied = hand.tags?.includes('estudiada')
                        try {
                          await updateHand(hand.id, {
                            tags: hasStudied
                              ? hand.tags.filter(t => t !== 'estudiada')
                              : [...(hand.tags || []), 'estudiada']
                          })
                        } catch {}
                      }}
                        className={`text-xs px-3 py-1 rounded ${
                          hand.tags?.includes('estudiada')
                            ? 'bg-green-900/30 text-green-400'
                            : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                        }`}
                      >
                        {hand.tags?.includes('estudiada') ? '✓ Estudiada' : 'Marcar como estudiada'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center text-gray-500">
              <div className="text-4xl mb-2">🃏</div>
              <p>No hay manos que coincidan con los filtros</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal para nueva mano */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Nueva Mano"
        footer={
          <>
            <Button variant="ghost" onClick={handleCloseModal}>Cancelar</Button>
            <Button onClick={submitForm}>Guardar</Button>
          </>
        }
      >
        <form onSubmit={(e) => { e.preventDefault(); submitForm() }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Fecha" type="date" value={values.date} onChange={(v) => handleChange('date', v)} onBlur={() => handleBlur('date')} required />
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Posición</label>
              <select
                value={values.position}
                onChange={(e) => handleChange('position', e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-green-500"
              >
                {POSITIONS.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Cartas (ej: As Ks)" type="text" value={values.heroHand} onChange={(v) => handleChange('heroHand', v)} onBlur={() => handleBlur('heroHand')} error={errors.heroHand} placeholder="Ah Ks" required />
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Resultado</label>
              <select
                value={values.result}
                onChange={(e) => handleChange('result', e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-green-500"
              >
                {RESULTS.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>

          <Input label="Acción Preflop" type="text" value={values.preflopAction} onChange={(v) => handleChange('preflopAction', v)} placeholder="ej: raise, call, fold" />
          <Input label="Board (ej: Ah Ks Qd)" type="text" value={values.board} onChange={(v) => handleChange('board', v)} placeholder="Opcional" />
          <Input label="Notas" type="text" value={values.notes} onChange={(v) => handleChange('notes', v)} placeholder="Observaciones sobre la mano" />
          <Input label="Tags (separados por coma)" type="text" value={values.tags} onChange={(v) => handleChange('tags', v)} placeholder="ej: 3bet, bluff, value" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Pot Size ($)" type="number" value={values.potSize} onChange={(v) => handleChange('potSize', v)} placeholder="Opcional" />
            <Input label="Ganado ($)" type="number" value={values.potWon} onChange={(v) => handleChange('potWon', v)} placeholder="Si ganaste" />
          </div>
          {submitError && (
            <div className="text-sm text-red-400 bg-red-900/20 rounded-lg px-4 py-2.5 text-center">{submitError}</div>
          )}
        </form>
      </Modal>
    </div>
    </AsyncHandler>
  )
}
