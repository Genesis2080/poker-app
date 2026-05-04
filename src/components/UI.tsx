import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle: string
  action?: ReactNode
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-700 px-6 py-4">
      <div>
        <h1 className="text-2xl font-display font-semibold text-white">{title}</h1>
        <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

interface BadgeProps {
  children: ReactNode
  color?: string
}

export function Badge({ children, color = 'blue' }: BadgeProps) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-900/30 text-blue-400',
    green: 'bg-green-900/30 text-green-400',
    red: 'bg-red-900/30 text-red-400',
    yellow: 'bg-yellow-900/30 text-yellow-400',
    purple: 'bg-purple-900/30 text-purple-400',
  }
  
  return (
    <span className={`text-xs px-2 py-1 rounded ${colors[color] || colors.blue}`}>
      {children}
    </span>
  )
}
