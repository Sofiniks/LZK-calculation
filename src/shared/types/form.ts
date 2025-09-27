// Общие типы для форм калькуляторов

export type FormField = {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox';
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  validation?: (value: any) => string | null;
};

export type FormSection = {
  title: string;
  fields: FormField[];
};

export type FormState<T = any> = {
  values: T;
  errors: Record<string, string | null>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
};

export type FormActions<T = any> = {
  setValue: (name: string, value: any) => void;
  setError: (name: string, error: string) => void;
  setTouched: (name: string, touched: boolean) => void;
  reset: () => void;
  submit: (onSubmit: (values: T) => Promise<void> | void) => Promise<void>;
};
