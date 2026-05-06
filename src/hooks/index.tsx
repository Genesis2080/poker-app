import { useMemo, useCallback, DependencyList } from 'react'

export function useOptimizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: DependencyList
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(callback, deps) as T
}

export function useCalculation<T>(
  calculate: () => T,
  deps: DependencyList
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(calculate, deps)
}
