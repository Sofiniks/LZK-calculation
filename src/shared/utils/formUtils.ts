// Общие утилиты для работы с формами

export const validateRequired = (value: any, fieldName: string): string | null => {
  if (value === undefined || value === null || value === '') {
    return `${fieldName} обязательно для заполнения`;
  }
  return null;
};

export const validateNumber = (value: any, fieldName: string, min?: number, max?: number): string | null => {
  const num = Number(value);
  if (isNaN(num)) {
    return `${fieldName} должно быть числом`;
  }
  if (min !== undefined && num < min) {
    return `${fieldName} должно быть не менее ${min}`;
  }
  if (max !== undefined && num > max) {
    return `${fieldName} должно быть не более ${max}`;
  }
  return null;
};

export const validatePercent = (value: any, fieldName: string = 'Процент'): string | null => {
  return validateNumber(value, fieldName, 1, 100);
};

export const validatePositiveNumber = (value: any, fieldName: string): string | null => {
  return validateNumber(value, fieldName, 0.01);
};

export const sanitizeInput = (value: string): string => {
  return value.trim().replace(/\s+/g, ' ');
};

export const formatNumber = (value: number, decimals: number = 2): string => {
  return value.toFixed(decimals);
};

export const parseNumber = (value: string): number | null => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
};
