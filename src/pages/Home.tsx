import { useApp } from '../context/AppContext'

export default function Home() {
  const { data } = useApp()

  return (
    <div className="space-y-8">
      <section className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Welcome to Practice App</h2>
        <p className="text-gray-400">
          A poker study application built with Vite, React, and TypeScript.
        </p>
      </section>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="text-3xl font-bold text-purple-400">{data.hands.length}</div>
          <div className="text-gray-400 text-sm">Hands Tracked</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="text-3xl font-bold text-green-400">{data.studyPlan.length}</div>
          <div className="text-gray-400 text-sm">Study Items</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="text-3xl font-bold text-blue-400">{data.flashcards.length}</div>
          <div className="text-gray-400 text-sm">Flashcards</div>
        </div>
      </div>

      <section className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold">{data.stats.winRate.toFixed(1)}%</div>
            <div className="text-gray-500 text-sm">Win Rate</div>
          </div>
          <div>
            <div className="text-xl font-bold">{data.stats.vpip}%</div>
            <div className="text-gray-500 text-sm">VPIP</div>
          </div>
          <div>
            <div className="text-xl font-bold">{data.stats.pfr}%</div>
            <div className="text-gray-500 text-sm">PFR</div>
          </div>
        </div>
      </section>
    </div>
  )
}