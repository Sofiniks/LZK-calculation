import type { PaintTableRow } from '../types';

// Функция для форматирования данных таблицы в Excel формат
export const formatTableForExcel = (tableRows: PaintTableRow[]): string => {
  const lines: string[] = [];
  
  for (const row of tableRows) {
    if (row.type === 'section') {
      // Строка раздела - добавляем название участка
      lines.push(`${row.labelEn}\t${row.labelRu}\t\t\t\t`);
    } else if (row.type === 'work') {
      // Строка работы - добавляем все данные кроме итоговой суммы
      const data = row.data;
      lines.push(
        `${data.en}\t${data.ru}\t${data.unit}\t${data.qty}\t${data.unitPrice.toFixed(2).replace('.', ',')}\t`
      );
    }
  }
  
  return lines.join('\n');
};

// Функция для копирования данных в буфер обмена
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      // Современный API
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback для старых браузеров
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};
