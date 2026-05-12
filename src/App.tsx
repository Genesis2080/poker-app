import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Home from './pages/Home'
import Study from './pages/Study'
import Hands from './pages/Hands'
import Login from './pages/Login'

function AppContent() {
  const { isAuthenticated, user, logout, loading } = useApp()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400 text-lg">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-purple-400 hover:text-purple-300 transition-colors">
            Poker App
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors text-sm">
              Home
            </Link>
            <Link to="/hands" className="text-gray-300 hover:text-white transition-colors text-sm">
              Hands
            </Link>
            <Link to="/study" className="text-gray-300 hover:text-white transition-colors text-sm">
              Study
            </Link>
            <div className="pl-4 border-l border-gray-700">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">{user?.username || user?.email}</span>
                  <button
                    onClick={logout}
                    className="text-xs px-3 py-1.5 bg-gray-700 hover:bg-red-900/30 text-gray-300 hover:text-red-400 rounded-lg transition-colors"
                  >
                    Salir
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-xs px-4 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all shadow"
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hands" element={<Hands />} />
          <Route path="/study" element={<Study />} />
          <Route path="/login" element={<Login />} />
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
