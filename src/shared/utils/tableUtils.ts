import type { TableRow, SectionRow, WorkRow } from '../types/table';

// Утилиты для работы с таблицами калькуляторов

export const addWorkToTable = <T, U>(
  tableRows: TableRow<T, U>[],
  workRow: WorkRow<U>,
  currentSection: T | null,
  newSection: T,
  sectionRow: SectionRow<T>
): TableRow<T, U>[] => {
  // Если это новый раздел, добавляем заголовок раздела
  if (currentSection !== newSection) {
    // Проверяем, есть ли уже такой раздел в таблице
    const existingSection = tableRows.find(row => 
      row.type === 'section' && row.areaKind === newSection
    );
    
    if (!existingSection) {
      // Создаем новый раздел только если его еще нет
      return [...tableRows, sectionRow, workRow];
    } else {
      // Если раздел существует, добавляем работу после его заголовка
      const existingSectionIndex = tableRows.findIndex(row => 
        row.type === 'section' && row.areaKind === newSection
      );
      
      if (existingSectionIndex !== -1) {
        // Находим конец этого раздела (до следующего раздела или конца таблицы)
        let insertIndex = existingSectionIndex + 1;
        while (insertIndex < tableRows.length && tableRows[insertIndex].type === 'work') {
          insertIndex++;
        }
        
        const newRows = [...tableRows];
        newRows.splice(insertIndex, 0, workRow);
        return newRows;
      }
    }
  }
  
  // Если это тот же раздел, просто добавляем в конец
  return [...tableRows, workRow];
};

export const removeWorkFromTable = <T, U>(
  tableRows: TableRow<T, U>[],
  index: number
): TableRow<T, U>[] => {
  return tableRows.filter((_, i) => i !== index);
};

export const updateWorkInTable = <T, U>(
  tableRows: TableRow<T, U>[],
  index: number,
  workRow: WorkRow<U>
): TableRow<T, U>[] => {
  return tableRows.map((item, i) => i === index ? workRow : item);
};

export const calculateTableSum = <T, U>(
  tableRows: TableRow<T, U>[]
): number => {
  return tableRows
    .filter(row => row.type === 'work')
    .reduce((sum, row) => {
      if (row.type === 'work') {
        return sum + (row.data as any).total;
      }
      return sum;
    }, 0);
};

export const findSectionIndex = <T, U>(
  tableRows: TableRow<T, U>[],
  areaKind: T
): number => {
  return tableRows.findIndex(row => 
    row.type === 'section' && row.areaKind === areaKind
  );
};

export const getSectionWorks = <T, U>(
  tableRows: TableRow<T, U>[],
  areaKind: T
): WorkRow<U>[] => {
  const sectionIndex = findSectionIndex(tableRows, areaKind);
  if (sectionIndex === -1) return [];
  
  const works: WorkRow<U>[] = [];
  let currentIndex = sectionIndex + 1;
  
  while (currentIndex < tableRows.length && tableRows[currentIndex].type === 'work') {
    works.push(tableRows[currentIndex] as WorkRow<U>);
    currentIndex++;
  }
  
  return works;
};
