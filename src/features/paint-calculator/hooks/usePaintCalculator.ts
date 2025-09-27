import { useState } from "react";
import { AREA_OPTIONS, type AreaKind } from "../types/areas";
import type { PaintWorkPickerValue } from "../components/PaintWorkPicker";
import type { PaintTableRow, PaintSectionRow } from "../types";
import { 
  createWorkRow, 
  resetWorkCoeffs, 
  restoreWorkFromRow 
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
        const areaOption = AREA_OPTIONS.find(a => a.value === areaKind);
        const sectionRow: PaintSectionRow = {
          type: 'section',
          areaKind,
          areaTotal,
          labelEn: `${areaOption?.labelEn} - ${areaTotal}m2`,
          labelRu: `${areaOption?.labelRu} - ${areaTotal} м2`
        };
        setTableRows(prev => [...prev, sectionRow]);
      }
      setCurrentSection(areaKind);
    }

    const workRow = createWorkRow(work, areaKind, areaTotal);

    // Если это существующий раздел, добавляем работу после его заголовка
    if (currentSection !== areaKind) {
      const existingSectionIndex = tableRows.findIndex(row => 
        row.type === 'section' && row.areaKind === areaKind
      );
      
      if (existingSectionIndex !== -1) {
        // Находим конец этого раздела (до следующего раздела или конца таблицы)
        let insertIndex = existingSectionIndex + 1;
        while (insertIndex < tableRows.length && tableRows[insertIndex].type === 'work') {
          insertIndex++;
        }
        
        setTableRows(prev => {
          const newRows = [...prev];
          newRows.splice(insertIndex, 0, workRow);
          return newRows;
        });
      } else {
        setTableRows(prev => [...prev, workRow]);
      }
    } else {
      setTableRows(prev => [...prev, workRow]);
    }
  };

  const clear = () => {
    setTableRows([]);
    setCurrentSection(null);
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
    
    // Actions
    setAreaKind,
    setAreaTotal,
    setWork,
    addWork,
    clear,
    removeWork,
    startEditWork,
    cancelEdit,
    saveEdit
  };
};
