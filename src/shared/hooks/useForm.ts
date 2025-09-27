import { useState, useCallback } from 'react';
import type { FormState, FormActions } from '../types/form';

export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  validationSchema?: Record<string, (value: any) => string | null>
) => {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false
  });

  const setValue = useCallback((name: string, value: any) => {
    setState(prev => ({
      ...prev,
      values: {
        ...prev.values,
        [name]: value
      },
      errors: {
        ...prev.errors,
        [name]: validationSchema?.[name]?.(value) || null
      }
    }));
  }, [validationSchema]);

  const setError = useCallback((name: string, error: string) => {
    setState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [name]: error
      }
    }));
  }, []);

  const setTouched = useCallback((name: string, touched: boolean) => {
    setState(prev => ({
      ...prev,
      touched: {
        ...prev.touched,
        [name]: touched
      }
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      values: initialValues,
      errors: {},
      touched: {},
      isSubmitting: false
    });
  }, [initialValues]);

  const submit = useCallback(async (onSubmit: (values: T) => Promise<void> | void) => {
    setState(prev => ({ ...prev, isSubmitting: true }));
    
    try {
      await onSubmit(state.values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [state.values]);

  const validate = useCallback(() => {
    if (!validationSchema) return true;
    
    const errors: Record<string, string> = {};
    let isValid = true;

    Object.keys(validationSchema).forEach(key => {
      const error = validationSchema[key](state.values[key]);
      if (error) {
        errors[key] = error;
        isValid = false;
      }
    });

    setState(prev => ({ ...prev, errors }));
    return isValid;
  }, [state.values, validationSchema]);

  const actions: FormActions<T> = {
    setValue,
    setError,
    setTouched,
    reset,
    submit
  };

  return {
    ...state,
    ...actions,
    validate
  };
};
