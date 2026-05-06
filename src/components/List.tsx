import type { ReactNode } from 'react'

interface ListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  keyExtractor?: (item: T) => string
  emptyMessage?: string
  className?: string
  itemClassName?: string
}

export function List<T>({
  items,
  renderItem,
  keyExtractor,
  emptyMessage = 'No hay elementos',
  className = '',
  itemClassName = '',
}: ListProps<T>) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item, index) => (
        <div
          key={keyExtractor ? keyExtractor(item) : index}
          className={itemClassName}
        >
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  )
}
