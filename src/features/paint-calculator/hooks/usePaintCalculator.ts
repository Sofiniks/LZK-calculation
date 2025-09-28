import { useState, useEffect } from "react";
import { AREA_OPTIONS, type AreaKind } from "../types/areas";
import type { PaintWorkPickerValue } from "../components/PaintWorkPicker";
import type { PaintTableRow, PaintSectionRow, PaintCalculatorState } from "../types";
import { 
  createWorkRow, 
  resetWorkCoeffs, 
  restoreWorkFromRow,
  saveStateToLocalStorage,
  loadStateFromLocalStorage,
  clearStateFromLocalStorage
} from "../utils";

const initialWork: PaintWorkPickerValue = {
  path: "cleaning.sand_blasting.sa2",
  percent: 100,
  paintingCoeffs: {
    doubleComponent: false,
    dft150: false,
    dft200: false,
    customDft: undefined
  },
  additionalCoeffs: {
    framework: false,
    confined: false,
    hold: false,
    icePaint: false,
    dft800: false,
    dft1500: false,
    metalStructures: false,
    lifting: false,
    hatchCovers: false,
    deckSaturation: false
  }
};

export const usePaintCalculator = () => {
  const [areaKind, setAreaKind] = useState<AreaKind>("topside");
  const [areaTotal, setAreaTotal] = useState<number>(750);
  const [work, setWork] = useState<PaintWorkPickerValue>(initialWork);
  const [tableRows, setTableRows] = useState<PaintTableRow[]>([]);
  const [currentSection, setCurrentSection] = useState<AreaKind | null>(null);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [customAreaNames, setCustomAreaNames] = useState<Record<string, { labelRu: string; labelEn: string }>>({});

  // Загрузка состояния из localStorage при инициализации
  useEffect(() => {
    const savedState = loadStateFromLocalStorage();
    console.log('Loading state from localStorage:', savedState);
    if (savedState) {
      setAreaKind(savedState.areaKind);
      setAreaTotal(savedState.areaTotal);
      setTableRows(savedState.tableRows);
      setCurrentSection(savedState.currentSection);
      setEditingRowIndex(savedState.editingRowIndex);
      console.log('State restored successfully');
    } else {
      console.log('No saved state found');
    }
  }, []);

  // Сохранение состояния в localStorage при изменениях
  useEffect(() => {
    const state: PaintCalculatorState = {
      areaKind,
      areaTotal,
      tableRows,
      currentSection,
      editingRowIndex
    };
    console.log('Saving state to localStorage:', state);
    saveStateToLocalStorage(state);
  }, [areaKind, areaTotal, tableRows, currentSection, editingRowIndex]);

  const addWork = () => {
    if (!work.path) return;

    // Сбрасываем коэффициенты после добавления работы
    setWork(prev => resetWorkCoeffs(prev));

    // Проверяем, нужно ли добавить новый раздел
    if (currentSection !== areaKind) {
      // Проверяем, есть ли уже такой раздел в таблице
      const existingSection = tableRows.find(row => 
        row.type === 'section' && row.areaKind === areaKind
      );
      
      if (!existingSection) {
        // Создаем новый раздел только если его еще нет
        const displayName = getAreaDisplayName(areaKind);
        const sectionRow: PaintSectionRow = {
          type: 'section',
          areaKind,
          areaTotal,
          labelEn: `${displayName.labelEn} - ${areaTotal}m2`,
          labelRu: `${displayName.labelRu} - ${areaTotal} м2`,
          isCustom: !!customAreaNames[areaKind]
        };
        setTableRows(prev => [...prev, sectionRow]);
      }
      setCurrentSection(areaKind);
    }

    const workRow = createWorkRow(work, areaKind, areaTotal);

    // Добавляем работу в конец таблицы
    setTableRows(prev => [...prev, workRow]);
  };

  const clear = () => {
    setTableRows([]);
    setCurrentSection(null);
    clearStateFromLocalStorage();
  };

  const removeWork = (index: number) => {
    setTableRows(prev => prev.filter((_, i) => i !== index));
  };

  const startEditWork = (index: number) => {
    const row = tableRows[index];
    if (row.type === 'work') {
      setEditingRowIndex(index);
      setWork(restoreWorkFromRow(row));
    }
  };

  const cancelEdit = () => {
    setEditingRowIndex(null);
  };

  const saveEdit = () => {
    if (editingRowIndex !== null && work.path) {
      const workRow = createWorkRow(work, areaKind, areaTotal);

      // Обновляем строку на месте
      setTableRows(prev => prev.map((item, i) => i === editingRowIndex ? workRow : item));
      
      // Сбрасываем коэффициенты после сохранения
      setWork(prev => resetWorkCoeffs(prev));
      
      setEditingRowIndex(null);
    }
  };

  const setCustomAreaName = (areaKind: AreaKind, customName: { labelRu: string; labelEn: string }) => {
    setCustomAreaNames(prev => ({
      ...prev,
      [areaKind]: customName
    }));
  };

  const getAreaDisplayName = (areaKind: AreaKind) => {
    const customName = customAreaNames[areaKind];
    if (customName) {
      return customName;
    }
    const areaOption = AREA_OPTIONS.find(a => a.value === areaKind);
    return {
      labelRu: areaOption?.labelRu || areaKind,
      labelEn: areaOption?.labelEn || areaKind
    };
  };

  const sum = tableRows
    .filter(row => row.type === 'work')
    .reduce((a, r) => a + r.data.total, 0);

  return {
    // State
    areaKind,
    areaTotal,
    work,
    tableRows,
    editingRowIndex,
    sum,
    customAreaNames,
    
    // Actions
    setAreaKind,
    setAreaTotal,
    setWork,
    addWork,
    clear,
    removeWork,
    startEditWork,
    cancelEdit,
    saveEdit,
    setCustomAreaName,
    getAreaDisplayName
  };
};
