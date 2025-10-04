import type { PipeItem, PipeType, PipeWorkRow, PipeCoefficients } from '../types';
import { calculateTotalCoefficient } from './coefficients';

// Импорт данных труб
import pipesData from '../../../data/pipes-pricelist.json';

// Извлекаем только данные о трубах (без коэффициентов)
const pipesList = (pipesData as any).pipes;

// Функция для получения цены трубы по диаметру и типу
export const getPipePrice = (diameter: number, pipeType: PipeType): number => {
  const pipe = pipesList.find((p: PipeItem) => p.dn_mm === diameter);
  if (!pipe) {
    throw new Error(`Pipe with diameter ${diameter}mm not found`);
  }
  
  return pipeType === 'black' ? pipe.pipe_black : pipe.pipe_galvanized;
};

// Функция для получения цены колена по диаметру
export const getElbowPrice = (diameter: number): number => {
  const pipe = pipesList.find((p: PipeItem) => p.dn_mm === diameter);
  if (!pipe) {
    throw new Error(`Pipe with diameter ${diameter}mm not found`);
  }
  
  return pipe.fitting_elbow_transition_weld;
};

// Функция для расчета длины с учетом минимальной длины
export const calculateEffectiveLength = (inputLength: number): number => {
  if (inputLength < 2000) {
    return (2000 + inputLength) / 2;
  }
  return inputLength;
};

// Функция для расчета коэффициента фланцев
export const calculateFlangeCoefficient = (flanges: number): number => {
  if (flanges <= 1) {
    return 1.0; // Без фланцев или 1 фланец - без коэффициента
  } else if (flanges === 2) {
    return 1.3; // 2 фланца - коэффициент 1.3
  } else {
    // 3+ фланцев: 1.3 за первые 2 + 1.1 за каждый следующий
    let coefficient = 1.3; // За первые 2 фланца
    for (let i = 3; i <= flanges; i++) {
      coefficient *= 1.1; // За каждый следующий фланец
    }
    return coefficient;
  }
};

// Функция для создания строки работы
export const createPipeWorkRow = (
  diameter: number,
  pipeType: PipeType,
  length: number,
  quantity: number = 1,
  flanges: number = 0,
  elbows: number = 0,
  coefficients: PipeCoefficients = {} as PipeCoefficients
): PipeWorkRow => {
  const effectiveLength = calculateEffectiveLength(length);
  const basePrice = getPipePrice(diameter, pipeType);
  const elbowPrice = getElbowPrice(diameter);
  const flangeCoefficient = calculateFlangeCoefficient(flanges);
  const additionalCoefficient = calculateTotalCoefficient(coefficients);
  
  // Новая формула: (базовая_цена_трубы * эффективная_длина + цена_колена * количество_колен) * коэффициент_фланцев * дополнительные_коэффициенты
  const pipeCost = (basePrice * effectiveLength) / 1000;
  const elbowCost = elbowPrice * elbows;
  const pricePerPiece = (pipeCost + elbowCost) * flangeCoefficient * additionalCoefficient;
  const total = pricePerPiece * quantity;
  
  const inputLengthInMeters = length / 1000; // Введенная длина в метрах
  const pipeTypeText = pipeType === 'black' ? 'Black pipe' : 'Galvanized pipe';
  const pipeTypeTextRu = pipeType === 'black' ? 'Черная труба' : 'Оцинкованная труба';
  
  // Добавляем информацию о фланцах и коленах в название
  let additionalInfo = '';
  let additionalInfoRu = '';
  
  if (flanges > 0 && elbows > 0) {
    additionalInfo = ` (${flanges} flanges, ${elbows} elbows)`;
    additionalInfoRu = ` (${flanges} фланцев, ${elbows} колен)`;
  } else if (flanges > 0) {
    additionalInfo = ` (${flanges} flanges)`;
    additionalInfoRu = ` (${flanges} фланцев)`;
  } else if (elbows > 0) {
    additionalInfo = ` (${elbows} elbows)`;
    additionalInfoRu = ` (${elbows} колен)`;
  }
  
  return {
    type: 'work',
    data: {
      en: `${pipeTypeText} DN${diameter} - ${inputLengthInMeters}m${additionalInfo}`,
      ru: `${pipeTypeTextRu} DN${diameter} - ${inputLengthInMeters}м${additionalInfoRu}`,
      unit: 'pcs',
      qty: quantity, // Количество штук
      unitPrice: pricePerPiece, // Цена за штуку
      total: total
    },
    path: `pipes.${pipeType}.${diameter}.${length}.${flanges}.${elbows}.${JSON.stringify(coefficients)}`,
    multipliers: flanges > 1 ? [`flanges_${flanges}`] : []
  };
};

// Функция для получения доступных диаметров
export const getAvailableDiameters = (): number[] => {
  return pipesList.map((p: PipeItem) => p.dn_mm).sort((a: number, b: number) => a - b);
};
