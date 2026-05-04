import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Home from './pages/Home'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-900 text-gray-100">
          <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <h1 className="text-xl font-bold text-purple-400">Poker App</h1>
              <div className="flex gap-6">
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
                <Link to="/hands" className="text-gray-300 hover:text-white transition-colors">
                  Hands
                </Link>
                <Link to="/study" className="text-gray-300 hover:text-white transition-colors">
                  Study
                </Link>
              </div>
            </div>
          </nav>
          <main className="max-w-4xl mx-auto p-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/hands" element={<div className="text-center py-20">Hands Page - Coming Soon</div>} />
              <Route path="/study" element={<div className="text-center py-20">Study Plan - Coming Soon</div>} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}