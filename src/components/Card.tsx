import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  title?: string
  subtitle?: string
  action?: ReactNode
  className?: string
  hoverable?: boolean
  onClick?: () => void
}

export function Card({
  children,
  title,
  subtitle,
  action,
  className = '',
  hoverable = false,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-gray-800 border border-gray-700 rounded-xl
        ${hoverable ? 'hover:bg-gray-750 hover:border-gray-600 cursor-pointer' : ''}
        transition-colors duration-200
        ${className}
      `}
    >
      {(title || action) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <div>
            {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}
