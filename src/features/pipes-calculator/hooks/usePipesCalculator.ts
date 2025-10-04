import { useState, useEffect } from 'react';
import type { PipeCalculatorState, PipeType, PipeTableRow, PipeCoefficients } from '../types';
import { createPipeWorkRow, getAvailableDiameters } from '../utils';
import { saveStateToLocalStorage, loadStateFromLocalStorage, clearStateFromLocalStorage } from '../utils';

const initialCoefficients: PipeCoefficients = {
  engineRoom: false,
  threadedConnection: false,
  sch80: false,
  hydraulics: false,
  interferingPipeline: false,
  plastic: false,
  copper: false,
  stainlessSteel: false,
  metalPlastic: false,
  customerMaterial: false,
  airBlow: false,
  painted: false,
  inTank: false,
  inTunnel: false,
  handover: false,
  newPipeline: false,
  sch160: false,
  repairOnSite: false,
};

const initialWork = {
  pipeType: 'black' as PipeType,
  diameter: 20,
  length: 1000, // 1 метр в мм
  quantity: 1,
  flanges: 0,
  elbows: 0,
  coefficients: initialCoefficients
};

export const usePipesCalculator = () => {
  const [pipeType, setPipeType] = useState<PipeType>(initialWork.pipeType);
  const [diameter, setDiameter] = useState<number>(initialWork.diameter);
  const [length, setLength] = useState<number>(initialWork.length);
  const [quantity, setQuantity] = useState<number>(initialWork.quantity);
  const [flanges, setFlanges] = useState<number>(initialWork.flanges);
  const [elbows, setElbows] = useState<number>(initialWork.elbows);
  const [coefficients, setCoefficients] = useState<PipeCoefficients>(initialWork.coefficients);
  const [tableRows, setTableRows] = useState<PipeTableRow[]>([]);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Загрузка состояния из localStorage при инициализации
  useEffect(() => {
    console.log('usePipesCalculator: Initializing hook');
    const savedState = loadStateFromLocalStorage();
    console.log('usePipesCalculator: Loading state from localStorage:', savedState);
    if (savedState) {
      setPipeType(savedState.pipeType);
      setDiameter(savedState.diameter);
      setLength(savedState.length);
      setQuantity(savedState.quantity || 1);
      setFlanges(savedState.flanges || 0);
      setElbows(savedState.elbows || 0);
      setCoefficients(savedState.coefficients || initialCoefficients);
      setTableRows(savedState.tableRows || []);
      setEditingRowIndex(savedState.editingRowIndex || null);
      console.log('usePipesCalculator: State restored successfully, tableRows count:', savedState.tableRows?.length || 0);
    } else {
      console.log('usePipesCalculator: No saved state found');
    }
    setIsInitialized(true);
  }, []);

  // Сохранение состояния в localStorage при изменениях
  useEffect(() => {
    if (!isInitialized) return; // Не сохраняем до инициализации
    
    const state: PipeCalculatorState = {
      pipeType,
      diameter,
      length,
      quantity,
      flanges,
      elbows,
      coefficients,
      tableRows,
      editingRowIndex
    };
    console.log('usePipesCalculator: Saving state to localStorage, tableRows count:', tableRows.length);
    saveStateToLocalStorage(state);
  }, [pipeType, diameter, length, quantity, flanges, elbows, coefficients, tableRows, editingRowIndex, isInitialized]);

  const addWork = () => {
    const workRow = createPipeWorkRow(diameter, pipeType, length, quantity, flanges, elbows, coefficients);
    setTableRows(prev => [...prev, workRow]);
  };

  const clear = () => {
    setTableRows([]);
    setEditingRowIndex(null);
    clearStateFromLocalStorage();
  };

  const removeWork = (index: number) => {
    setTableRows(prev => prev.filter((_, i) => i !== index));
    if (editingRowIndex === index) {
      setEditingRowIndex(null);
    } else if (editingRowIndex !== null && editingRowIndex > index) {
      setEditingRowIndex(editingRowIndex - 1);
    }
  };

  const startEditWork = (index: number) => {
    const row = tableRows[index];
    if (row && row.type === 'work') {
      // Извлекаем данные из строки для редактирования
      const pathParts = row.path.split('.');
      const type = pathParts[1] as PipeType;
      const diameter = parseInt(pathParts[2]);
      const length = parseInt(pathParts[3]);
      const flanges = parseInt(pathParts[4]) || 0;
      const elbows = parseInt(pathParts[5]) || 0;
      const coefficientsStr = pathParts[6] || '{}';
      const coefficients = JSON.parse(coefficientsStr) || initialCoefficients;
      
      setPipeType(type);
      setDiameter(diameter);
      setLength(length);
      setQuantity(row.data.qty); // Количество штук
      setFlanges(flanges);
      setElbows(elbows);
      setCoefficients(coefficients);
      setEditingRowIndex(index);
    }
  };

  const cancelEdit = () => {
    setEditingRowIndex(null);
  };

  const saveEdit = () => {
    if (editingRowIndex !== null) {
      const workRow = createPipeWorkRow(diameter, pipeType, length, quantity, flanges, elbows, coefficients);
      setTableRows(prev => prev.map((row, i) => i === editingRowIndex ? workRow : row));
      setEditingRowIndex(null);
    }
  };

  const sum = tableRows
    .filter(row => row.type === 'work')
    .reduce((a, r) => a + r.data.total, 0);

  return {
    // State
    pipeType,
    diameter,
    length,
    quantity,
    flanges,
    elbows,
    coefficients,
    tableRows,
    editingRowIndex,
    sum,
    availableDiameters: getAvailableDiameters(),
    
    // Actions
    setPipeType,
    setDiameter,
    setLength,
    setQuantity,
    setFlanges,
    setElbows,
    setCoefficients,
    addWork,
    clear,
    removeWork,
    startEditWork,
    cancelEdit,
    saveEdit,
    setTableRows
  };
};
