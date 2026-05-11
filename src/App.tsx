import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Home from './pages/Home'
import Study from './pages/Study'
import Hands from './pages/Hands'
import Login from './pages/Login'

function AppContent() {
  const { isAuthenticated, user, logout } = useApp()

  if (!isAuthenticated) return <Login />

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-purple-400">Poker App</h1>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/hands" className="text-gray-300 hover:text-white transition-colors">
              Hands
            </Link>
            <Link to="/study" className="text-gray-300 hover:text-white transition-colors">
              Study
            </Link>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
              <span className="text-sm text-gray-400">{user?.username}</span>
              <button
                onClick={logout}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hands" element={<Hands />} />
          <Route path="/study" element={<Study />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  )
}
