import { useState, useCallback } from 'react'

interface FormStateResult<T> {
  values: T
  errors: Partial<Record<keyof T, string>>
  isDirty: boolean
  isValid: boolean
  handleChange: (field: keyof T, value: any) => void
  handleBlur: (field: keyof T) => void
  setFieldValue: (field: keyof T, value: any) => void
  setFieldError: (field: keyof T, error: string) => void
  resetForm: () => void
  submitForm: () => Promise<void>
  submitError: string | null
}

interface ValidationRule<T> {
  field: keyof T
  rule: (value: any, values: T) => string | null
}

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRule<T>[] = [],
  onSubmit: (values: T) => void | Promise<void>
): FormStateResult<T> {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [isDirty, setIsDirty] = useState<boolean>(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const validate = useCallback((vals: T): Partial<Record<keyof T, string>> => {
    const newErrors: Partial<Record<keyof T, string>> = {}
    validationRules.forEach(({ field, rule }) => {
      const error = rule(vals[field], vals)
      if (error) {
        newErrors[field] = error
      }
    })
    return newErrors
  }, [validationRules])

  const handleChange = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }))
    setIsDirty(true)
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }, [])

  const handleBlur = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const fieldErrors = validate(values)
    if (fieldErrors[field]) {
      setErrors(prev => ({ ...prev, ...fieldErrors }))
    }
  }, [values, validate])

  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }))
  }, [])

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }))
  }, [])

  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsDirty(false)
    setSubmitError(null)
  }, [initialValues])

  const submitForm = useCallback(async () => {
    setSubmitError(null)
    const formErrors = validate(values)
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }
    try {
      await Promise.resolve(onSubmit(values))
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error al enviar el formulario'
      setSubmitError(msg)
    }
  }, [values, validate, onSubmit])

  const isValid = Object.keys(errors).length === 0

  return {
    values,
    errors,
    isDirty,
    isValid,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldError,
    resetForm,
    submitForm,
    submitError,
  }
}
