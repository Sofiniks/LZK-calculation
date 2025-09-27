import type { PaintCalculatorState } from '../types';

const STORAGE_KEY = 'paint-calculator-state';

// Функция для сохранения состояния в localStorage
export const saveStateToLocalStorage = (state: PaintCalculatorState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (error) {
    console.warn('Failed to save state to localStorage:', error);
  }
};

// Функция для загрузки состояния из localStorage
export const loadStateFromLocalStorage = (): PaintCalculatorState | null => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return null;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.warn('Failed to load state from localStorage:', error);
    return null;
  }
};

// Функция для очистки состояния из localStorage
export const clearStateFromLocalStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear state from localStorage:', error);
  }
};
