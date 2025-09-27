// Общие типы для работы с таблицами калькуляторов

export type BaseRow = {
  en: string;
  ru: string;
  unit: string;
  qty: number;
  unitPrice: number;
  total: number;
};

export type SectionRow<T = any> = {
  type: 'section';
  areaKind: T;
  areaTotal: number;
  labelEn: string;
  labelRu: string;
};

export type WorkRow<T = any> = {
  type: 'work';
  data: T;
};

export type TableRow<T = any, U = any> = SectionRow<T> | WorkRow<U>;

export type TableActions = {
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  editingIndex: number | null;
};

export type TableColumn = {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  width?: number;
  sortable?: boolean;
};
