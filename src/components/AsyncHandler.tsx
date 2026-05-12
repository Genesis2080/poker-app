import type { ReactNode } from 'react'

interface AsyncHandlerProps {
  loading: boolean
  error: string | null
  onRetry?: () => void
  children: ReactNode
}

export function AsyncHandler({ loading, error, onRetry, children }: AsyncHandlerProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 mt-4">Cargando datos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-5xl mb-4">⚠️</div>
        <p className="text-red-400 text-lg font-medium text-center max-w-md">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-6 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200"
          >
            Reintentar
          </button>
        )}
      </div>
    )
  }

  return <>{children}</>
}
