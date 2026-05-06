import { useState, useCallback } from 'react'

interface ToggleResult {
  isOn: boolean
  toggle: () => void
  turnOn: () => void
  turnOff: () => void
  setValue: (value: boolean) => void
}

export function useToggle(initialValue: boolean = false): ToggleResult {
  const [isOn, setIsOn] = useState<boolean>(initialValue)

  const toggle = useCallback(() => {
    setIsOn(prev => !prev)
  }, [])

  const turnOn = useCallback(() => {
    setIsOn(true)
  }, [])

  const turnOff = useCallback(() => {
    setIsOn(false)
  }, [])

  const setValue = useCallback((value: boolean) => {
    setIsOn(value)
  }, [])

  return { isOn, toggle, turnOn, turnOff, setValue }
}
