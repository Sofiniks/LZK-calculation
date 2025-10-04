import type { PipeCalculatorState } from '../types';

const STORAGE_KEY = 'pipes-calculator-state';

// Функция для сохранения состояния в localStorage
export const saveStateToLocalStorage = (state: PipeCalculatorState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
    console.log('localStorage: Pipes state saved successfully, tableRows count:', state.tableRows.length);
  } catch (error) {
    console.warn('Failed to save pipes state to localStorage:', error);
  }
};

// Функция для загрузки состояния из localStorage
export const loadStateFromLocalStorage = (): PipeCalculatorState | null => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    console.log('localStorage: Raw data from localStorage:', serializedState);
    if (serializedState === null) {
      console.log('localStorage: No saved pipes state found');
      return null;
    }
    const state = JSON.parse(serializedState);
    console.log('localStorage: Pipes state loaded successfully, tableRows count:', state.tableRows?.length || 0);
    console.log('localStorage: Full loaded state:', state);
    return state;
  } catch (error) {
    console.warn('Failed to load pipes state from localStorage:', error);
    return null;
  }
};

// Функция для очистки состояния из localStorage
export const clearStateFromLocalStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear pipes state from localStorage:', error);
  }
};
