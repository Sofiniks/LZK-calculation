import type { PipeTableRow } from '../types';

// Функция для форматирования данных таблицы в Excel формат
export const formatTableForExcel = (tableRows: PipeTableRow[]): string => {
  const lines: string[] = [];
  
  // Добавляем пробел перед тире, чтобы Excel не воспринимал это как формулу
  const formatForExcel = (text: string) => text.startsWith('-') ? ` -${text.substring(1)}` : text;
  
  for (const row of tableRows) {
    if (row.type === 'work') {
      // Строка работы - добавляем все данные кроме итоговой суммы
      const data = row.data;
      lines.push(
        `${formatForExcel(data.en)}\t${formatForExcel(data.ru)}\t${data.unit}\t${data.qty}\t${data.unitPrice.toFixed(2).replace('.', ',')}\t`
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
