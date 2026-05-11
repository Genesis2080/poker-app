import { useState } from 'react'
import { useApp } from '../context/AppContext'
import type { Session, GameModality } from '../types'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Modal } from '../components/Modal'
import { useForm } from '../hooks/useForm'
import { useCalculation } from '../hooks'

export default function Home() {
  const { data, addSession, deleteSession, updateFlashcard } = useApp()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modality, setModality] = useState<GameModality>('cash')
  const [filterModality, setFilterModality] = useState<GameModality | 'all'>('all')
  const [currentCard, setCurrentCard] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const stats = useCalculation(() => {
    const sessions = data.sessions || []
    const filteredSessions = filterModality === 'all' 
      ? sessions 
      : sessions.filter(s => s.modality === filterModality)
    
    const totalInvested = filteredSessions.reduce((sum, s) => sum + s.buyIn, 0)
    const totalWon = filteredSessions.reduce((sum, s) => sum + s.cashOut, 0)
    const totalSessions = filteredSessions.length
    const totalTimeHours = filteredSessions.reduce((sum, s) => sum + s.timePlayedMinutes / 60, 0)
    const roi = totalInvested > 0
      ? Math.round(((totalWon - totalInvested) / totalInvested) * 10000) / 100
      : 0

    const profits = filteredSessions.map(s => s.cashOut - s.buyIn)
    const biggestWin = profits.length > 0 ? Math.max(...profits) : 0
    const biggestLoss = profits.length > 0 ? Math.min(...profits) : 0
    const avgProfit = totalSessions > 0 ? (totalWon - totalInvested) / totalSessions : 0

    const chartData = [...filteredSessions]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-15)
      .map(s => ({
        date: new Date(s.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
        profit: s.cashOut - s.buyIn,
        isPositive: s.cashOut >= s.buyIn,
        modality: s.modality,
      }))

    const cumulativeProfit = chartData.reduce((acc, d, i) => {
      acc.push(i === 0 ? d.profit : acc[i - 1] + d.profit)
      return acc
    }, [] as number[])

    const modalityCounts = {
      cash: sessions.filter(s => s.modality === 'cash').length,
      tournament: sessions.filter(s => s.modality === 'tournament').length,
      spins: sessions.filter(s => s.modality === 'spins').length,
    }

    return { 
      totalInvested, totalWon, totalSessions, totalTimeHours, roi, 
      chartData, cumulativeProfit, biggestWin, biggestLoss, avgProfit,
      modalityCounts
    }
  }, [data.sessions, filterModality])

  const { values, errors, handleChange, handleBlur, submitForm } = useForm(
    {
      date: new Date().toISOString().split('T')[0],
      tournamentName: '',
      buyIn: '',
      cashOut: '',
      timePlayedMinutes: '',
    },
    [
      { field: 'buyIn', rule: (v) => !v ? 'El dinero invertido es requerido' : null },
      { field: 'cashOut', rule: (v) => !v ? 'El dinero ganado es requerido' : null },
      { field: 'timePlayedMinutes', rule: (v) => !v ? 'El tiempo jugado es requerido' : null },
    ],
    (vals) => {
      const newSession: Session = {
        id: Date.now().toString(),
        date: vals.date,
        modality,
        tournamentName: modality === 'tournament' ? vals.tournamentName || undefined : undefined,
        buyIn: parseFloat(vals.buyIn),
        cashOut: parseFloat(vals.cashOut),
        timePlayedMinutes: parseInt(vals.timePlayedMinutes),
      }
      addSession(newSession)
      setIsModalOpen(false)
    }
  )

  const maxProfit = Math.max(100, ...stats.chartData.map(d => Math.abs(d.profit)))
  const maxCumulative = Math.max(100, ...stats.cumulativeProfit.map(Math.abs))

  const getPointPosition = (index: number, value: number, maxVal: number) => {
    const x = stats.chartData.length === 1 ? 50 : (index / (stats.chartData.length - 1)) * 100
    const y = 50 - (value / maxVal) * 50
    return { x, y }
  }

  return (
    <div className="space-y-6">
      {/* Header elegante */}
      <div className="relative overflow-hidden bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Poker Analytics
          </h1>
          <p className="text-gray-400 mt-2">Gestiona y analiza tu rendimiento en el póker</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Sesión
        </button>
      </div>

      {/* Stats Cards con diseño mejorado */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Sesiones', value: stats.totalSessions, color: 'blue', icon: '🎯' },
          { label: 'Ganancia Total', value: `$${(stats.totalWon - stats.totalInvested).toFixed(2)}`, color: stats.totalWon - stats.totalInvested >= 0 ? 'green' : 'red', icon: '💰' },
          { label: 'ROI', value: `${stats.roi}%`, color: stats.roi >= 0 ? 'green' : 'red', icon: '📈' },
          { label: 'Tiempo Total', value: `${stats.totalTimeHours.toFixed(1)}h`, color: 'purple', icon: '⏱️' },
        ].map((stat, i) => (
          <div key={i} className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className={`text-2xl font-bold ${
              stat.color === 'green' ? 'text-green-400' : 
              stat.color === 'red' ? 'text-red-400' : 
              stat.color === 'blue' ? 'text-blue-400' : 
              'text-purple-400'
            }`}>
              {stat.value}
            </div>
            <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filtros de modalidad */}
      <div className="flex gap-2">
        {(['all', 'cash', 'tournament', 'spins'] as const).map(filt => (
          <button
            key={filt}
            onClick={() => setFilterModality(filt)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filterModality === filt
                ? (filt === 'all' ? 'bg-gray-600 text-white' 
                   : filt === 'cash' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' 
                   : filt === 'tournament' ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-600/20' 
                   : 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20')
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {filt === 'all' ? 'Todas' : filt === 'cash' ? 'Cash' : filt === 'tournament' ? 'Torneos' : 'Spins'}
            {filt !== 'all' && (
              <span className="ml-2 px-2 py-0.5 bg-black/20 rounded-full text-xs">
                {stats.modalityCounts[filt]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Gráfica estilo PT4 */}
      {stats.chartData.length > 0 ? (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Gráfico de Resultados</h3>
            <div className="text-right">
              <div className={`text-xl font-bold ${stats.cumulativeProfit[stats.cumulativeProfit.length - 1] >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${stats.cumulativeProfit[stats.cumulativeProfit.length - 1]?.toFixed(2) || '0.00'}
              </div>
              <div className="text-xs text-gray-500">Balance actual</div>
            </div>
          </div>
          
          <div className="flex gap-4 h-64">
            {/* Eje Y */}
            <div className="flex flex-col justify-between text-xs text-gray-500 w-14 text-right pr-2">
              <span>${maxCumulative}</span>
              <span>$0</span>
              <span>-${maxCumulative}</span>
            </div>

            {/* Área del gráfico */}
            <div className="flex-1 relative">
              {/* Línea de cero */}
              <div className="absolute w-full border-t border-gray-600" style={{ top: '50%' }}></div>
              
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Línea de balance acumulado */}
                {stats.cumulativeProfit.length > 1 && (
                  <polyline
                    points={stats.cumulativeProfit.map((val, i) => {
                      const x = stats.chartData.length === 1 ? 50 : (i / (stats.chartData.length - 1)) * 100
                      const y = 50 - (val / maxCumulative) * 50
                      return `${x},${y}`
                    }).join(' ')}
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2"
                  />
                )}
              </svg>

              {/* Línea de cero */}
              <div className="absolute w-full border-t border-gray-600" style={{ top: '50%' }}></div>

              {/* Eje X - fechas */}
              <div className="flex mt-2">
                {stats.chartData.map((d, i) => (
                  <div key={i} className="flex-1 text-center text-xs text-gray-500" style={{ minWidth: 0 }}>
                    <span className="inline-block truncate" style={{ maxWidth: '45px' }}>
                      {d.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Leyenda PT4 */}
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <div className="w-4 h-1 bg-green-500"></div>
              <span>Balance acumulado</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
              <span>Cash</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
              <span>Torneo</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-cyan-500 rounded-sm"></div>
              <span>Spins</span>
            </div>
          </div>

          {/* Stats PT4 style */}
          <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t border-gray-700">
            <div className="text-center">
              <div className="text-green-400 font-bold">+${stats.biggestWin.toFixed(2)}</div>
              <div className="text-gray-500 text-xs">Mayor Ganancia</div>
            </div>
            <div className="text-center">
              <div className="text-red-400 font-bold">${stats.biggestLoss.toFixed(2)}</div>
              <div className="text-gray-500 text-xs">Mayor Pérdida</div>
            </div>
            <div className="text-center">
              <div className={`font-bold ${stats.avgProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${stats.avgProfit.toFixed(2)}
              </div>
              <div className="text-gray-500 text-xs">$/Sesión</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-bold">{stats.totalSessions}</div>
              <div className="text-gray-500 text-xs">Sesiones</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-2xl p-12 border border-gray-700 text-center">
          <div className="text-6xl mb-4">🎲</div>
          <p className="text-gray-400 text-lg mb-2">No hay sesiones registradas</p>
          <p className="text-gray-500 text-sm">¡Añade tu primera sesión para ver las estadísticas!</p>
        </div>
      )}

      {/* Lista de sesiones recientes con delete */}
      {data.sessions && data.sessions.length > 0 && (
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Sesiones Recientes</h3>
          <div className="space-y-3">
            {[...data.sessions]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 10)
              .map(session => {
                const profit = session.cashOut - session.buyIn
                const modalityConfig = {
                  cash: { label: 'Cash', color: 'bg-purple-500', textColor: 'text-purple-400' },
                  tournament: { label: 'Torneo', color: 'bg-yellow-500', textColor: 'text-yellow-400' },
                  spins: { label: 'Spins', color: 'bg-cyan-500', textColor: 'text-cyan-400' },
                }
                const config = modalityConfig[session.modality]
                
                return (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl hover:bg-gray-900 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${config.color}`}></div>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded ${config.textColor} bg-gray-800`}>
                            {config.label}
                          </span>
                          {session.tournamentName || 'Sesión'}
                        </div>
                        <div className="text-sm text-gray-400">
                          {new Date(session.date).toLocaleDateString('es-ES')} • {(session.timePlayedMinutes / 60).toFixed(1)}h
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {profit >= 0 ? '+' : ''}${profit.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          ${session.buyIn} → ${session.cashOut}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteSession(session.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-400"
                        title="Eliminar sesión"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* Flashcards */}
      {data.flashcards && data.flashcards.length > 0 && (
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Flashcards</h3>
            <span className="text-sm text-gray-500">{currentCard + 1} / {data.flashcards.length}</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Botón anterior */}
            <button
              onClick={() => { setCurrentCard(Math.max(0, currentCard - 1)); setIsFlipped(false) }}
              disabled={currentCard === 0}
              className="text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Card con flip */}
            <div className="flex-1 cursor-pointer" style={{ perspective: '600px' }} onClick={() => setIsFlipped(!isFlipped)}>
              <div
                className="bg-gray-900 rounded-xl border border-gray-700 min-h-[220px] p-6 transition-all duration-500"
                style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)', transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
              >
                {!isFlipped ? (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        (() => {
                          const card = data.flashcards[currentCard]
                          return card.difficulty <= 2 ? 'bg-green-900/30 text-green-400' : card.difficulty <= 4 ? 'bg-yellow-900/30 text-yellow-400' : 'bg-red-900/30 text-red-400'
                        })()
                      }`}>
                        {data.flashcards[currentCard].difficulty <= 2 ? 'Fácil' : data.flashcards[currentCard].difficulty <= 4 ? 'Media' : 'Difícil'}
                      </span>
                      <span className="text-xs text-gray-500">{data.flashcards[currentCard].category}</span>
                    </div>
                    <p className="text-gray-200 text-base leading-relaxed">{data.flashcards[currentCard].question}</p>
                    <p className="text-xs text-gray-600 mt-4">Toca para ver respuesta</p>
                  </div>
                ) : (
                  <div style={{ transform: 'rotateY(180deg)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-green-400">Respuesta</span>
                    </div>
                    <p className="text-gray-200 text-sm leading-relaxed">{data.flashcards[currentCard].answer}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        const card = data.flashcards[currentCard]
                        updateFlashcard(card.id, {
                          reviews: card.reviews + 1,
                        })
                      }}
                      className="mt-4 text-xs px-3 py-1.5 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-colors"
                    >
                      ✓ Marcar como estudiada
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Botón siguiente */}
            <button
              onClick={() => { setCurrentCard(Math.min(data.flashcards.length - 1, currentCard + 1)); setIsFlipped(false) }}
              disabled={currentCard === data.flashcards.length - 1}
              className="text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Indicador de progreso */}
          <div className="flex gap-1 mt-4 justify-center">
            {data.flashcards.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrentCard(i); setIsFlipped(false) }}
                className={`w-2 h-2 rounded-full transition-colors ${i === currentCard ? 'bg-blue-500' : 'bg-gray-600 hover:bg-gray-500'}`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Modal para nueva sesión */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nueva Sesión"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={submitForm}>Guardar</Button>
          </>
        }
      >
        <form onSubmit={(e) => { e.preventDefault(); submitForm() }} className="space-y-4">
          <div className="flex gap-2 p-1 bg-gray-900 rounded-xl">
            {(['cash', 'tournament', 'spins'] as GameModality[]).map(mod => (
              <button
                key={mod}
                type="button"
                onClick={() => setModality(mod)}
                className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                  modality === mod
                    ? (mod === 'cash' ? 'bg-purple-600 text-white shadow-lg' 
                       : mod === 'tournament' ? 'bg-yellow-600 text-white shadow-lg' 
                       : 'bg-cyan-600 text-white shadow-lg')
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {mod === 'cash' ? 'Cash' : mod === 'tournament' ? 'Torneo' : 'Spins'}
              </button>
            ))}
          </div>
          <Input label="Fecha" type="date" value={values.date} onChange={(v) => handleChange('date', v)} onBlur={() => handleBlur('date')} required />
          {modality === 'tournament' && (
            <Input label="Nombre del Torneo" type="text" value={values.tournamentName} onChange={(v) => handleChange('tournamentName', v)} placeholder="Ej: Sunday Million" />
          )}
          <div className="grid grid-cols-2 gap-4">
            <Input label="Buy-in ($)" type="number" value={values.buyIn} onChange={(v) => handleChange('buyIn', v)} onBlur={() => handleBlur('buyIn')} error={errors.buyIn} required />
            <Input label="Cash-out ($)" type="number" value={values.cashOut} onChange={(v) => handleChange('cashOut', v)} onBlur={() => handleBlur('cashOut')} error={errors.cashOut} required />
          </div>
          <Input label="Tiempo (min)" type="number" value={values.timePlayedMinutes} onChange={(v) => handleChange('timePlayedMinutes', v)} onBlur={() => handleBlur('timePlayedMinutes')} error={errors.timePlayedMinutes} required />
        </form>
      </Modal>
    </div>
  )
}
