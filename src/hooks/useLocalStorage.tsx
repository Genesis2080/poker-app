import { useState, useEffect } from 'react'

interface LocalStorageStateResult<T> {
  value: T
  setValue: (newValue: T | ((prev: T) => T)) => void
  remove: () => void
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): LocalStorageStateResult<T> {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
    } catch (error) {
      console.warn(`Error setting value for key "${key}":`, error)
    }
  }

  const remove = () => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }

  return { value: storedValue, setValue, remove }
}
