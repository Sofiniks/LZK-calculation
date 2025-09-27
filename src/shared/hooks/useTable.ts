import { useState } from 'react';
import type { TableRow, SectionRow, WorkRow } from '../types/table';
import { 
  addWorkToTable, 
  removeWorkFromTable, 
  updateWorkInTable, 
  calculateTableSum 
} from '../utils/tableUtils';

export const useTable = <T, U>() => {
  const [tableRows, setTableRows] = useState<TableRow<T, U>[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addWork = (
    workRow: WorkRow<U>,
    currentSection: T | null,
    newSection: T,
    sectionRow: SectionRow<T>
  ) => {
    setTableRows(prev => addWorkToTable(prev, workRow, currentSection, newSection, sectionRow));
  };

  const removeWork = (index: number) => {
    setTableRows(prev => removeWorkFromTable(prev, index));
  };

  const updateWork = (index: number, workRow: WorkRow<U>) => {
    setTableRows(prev => updateWorkInTable(prev, index, workRow));
  };

  const clear = () => {
    setTableRows([]);
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
  };

  const saveEdit = (index: number, workRow: WorkRow<U>) => {
    updateWork(index, workRow);
    setEditingIndex(null);
  };

  const sum = calculateTableSum(tableRows);

  return {
    tableRows,
    editingIndex,
    sum,
    addWork,
    removeWork,
    updateWork,
    clear,
    startEdit,
    cancelEdit,
    saveEdit,
    setTableRows
  };
};
