// Типы специфичные для калькулятора покраски
import type { AreaKind } from './areas';
import type { Row } from '../../../calc/engine';

export type PaintSectionRow = {
  type: 'section';
  areaKind: AreaKind;
  areaTotal: number;
  labelEn: string;
  labelRu: string;
};

export type PaintWorkRow = {
  type: 'work';
  data: Row;
  path: string;
  multipliers: string[];
};

export type PaintTableRow = PaintSectionRow | PaintWorkRow;

export type PaintCalculatorState = {
  areaKind: AreaKind;
  areaTotal: number;
  tableRows: PaintTableRow[];
  currentSection: AreaKind | null;
  editingRowIndex: number | null;
};

export type PaintCalculatorActions = {
  setAreaKind: (areaKind: AreaKind) => void;
  setAreaTotal: (areaTotal: number) => void;
  addWork: (work: any) => void;
  clear: () => void;
  removeWork: (index: number) => void;
  startEditWork: (index: number) => void;
  cancelEdit: () => void;
  saveEdit: (work: any) => void;
};

// Экспортируем areas
export * from './areas';
