import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-10 md:py-20">
      <div className="text-8xl mb-4">🃏</div>
      <h1 className="text-4xl font-bold text-gray-200 mb-2">404</h1>
      <p className="text-gray-400 mb-8">Esta página no existe en la baraja</p>
      <Link
        to="/"
        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg"
      >
        Volver al Home
      </Link>
    </div>
  )
}
