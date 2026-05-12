import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Login() {
  const { login, register } = useApp()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Completa todos los campos')
      return
    }

    if (mode === 'register' && !username.trim()) {
      setError('Completa todos los campos')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setSubmitting(true)

    if (mode === 'login') {
      const err = await login(email.trim(), password)
      if (err) setError(err)
      else navigate('/')
    } else {
      const err = await register(email.trim(), password, username.trim())
      if (err) setError(err)
      else navigate('/')
    }

    setSubmitting(false)
  }

  return (
    <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 180px)' }}>
      <div className="w-full max-w-sm">
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-2xl">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">♠️</div>
            <h2 className="text-xl font-bold text-gray-200">
              {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h2>
          </div>

          <div className="flex bg-gray-900 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setMode('login'); setError('') }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === 'login' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => { setMode('register'); setError('') }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === 'register' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Usuario</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Cómo te llamas en la mesa"
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-900/20 rounded-lg px-4 py-2.5 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {submitting ? 'Cargando...' : mode === 'login' ? 'Entrar' : 'Crear Cuenta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
