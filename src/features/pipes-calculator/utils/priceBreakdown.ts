import type { PriceBreakdown } from '../components/PriceBreakdownModal';
import type { PipeWorkRow, PipeCoefficients } from '../types';
import { getPipePrice, getElbowPrice, calculateEffectiveLength, calculateFlangeCoefficient } from './pipeUtils';
import { calculateTotalCoefficient, getActiveCoefficients } from './coefficients';

// Функция для расчета детализации цены
export const calculatePriceBreakdown = (workRow: PipeWorkRow): PriceBreakdown => {
  const pathParts = workRow.path.split('.');
  const pipeType = pathParts[1] as 'black' | 'galvanized';
  const diameter = parseInt(pathParts[2]);
  const length = parseInt(pathParts[3]);
  const flanges = parseInt(pathParts[4]) || 0;
  const elbows = parseInt(pathParts[5]) || 0;
  const coefficientsStr = pathParts[6] || '{}';
  const coefficients: PipeCoefficients = JSON.parse(coefficientsStr) || {};

  const basePrice = getPipePrice(diameter, pipeType);
  const elbowPrice = getElbowPrice(diameter);
  const effectiveLength = calculateEffectiveLength(length);
  const flangeCoefficient = calculateFlangeCoefficient(flanges);
  const additionalCoefficient = calculateTotalCoefficient(coefficients);
  
  // Новая формула: (базовая_цена_трубы * эффективная_длина + цена_колена * количество_колен) * коэффициент_фланцев * дополнительные_коэффициенты
  const pipeCost = (basePrice * effectiveLength) / 1000;
  const elbowCost = elbowPrice * elbows;
  const finalPrice = (pipeCost + elbowCost) * flangeCoefficient * additionalCoefficient;

  // Генерируем формулу
  const formula = generateFormula(basePrice, elbowPrice, length, effectiveLength, flanges, flangeCoefficient, elbows, additionalCoefficient);

  const multipliers = [];
  
  // Добавляем коэффициент фланцев, если применим
  if (flanges > 1) {
    multipliers.push({
      name: 'flanges',
      value: flangeCoefficient,
      description: getFlangeDescription(flanges)
    });
  }
  
  // Добавляем дополнительные коэффициенты
  const activeCoefficients = getActiveCoefficients(coefficients);
  activeCoefficients.forEach(coeff => {
    multipliers.push({
      name: coeff.name,
      value: coeff.value,
      description: coeff.description
    });
  });

  return {
    basePrice,
    effectiveLength,
    flangeCoefficient,
    finalPrice,
    formula,
    elbowPrice: elbows > 0 ? elbowPrice : undefined,
    elbows: elbows > 0 ? elbows : undefined,
    multipliers
  };
};

// Функция для генерации формулы расчета
const generateFormula = (
  basePrice: number,
  elbowPrice: number,
  inputLength: number,
  effectiveLength: number,
  flanges: number,
  _flangeCoefficient: number,
  elbows: number,
  additionalCoefficient: number
): string => {
  let formula = '(';
  
  // Добавляем базовую цену трубы
  formula += `${basePrice} * `;
  
  // Добавляем расчет эффективной длины в метрах
  if (inputLength < 2000) {
    const inputLengthM = inputLength / 1000;
    formula += `(${inputLengthM} + 2)/2`;
  } else {
    const effectiveLengthM = effectiveLength / 1000;
    formula += `${effectiveLengthM}`;
  }
  
  // Добавляем колена, если есть
  if (elbows > 0) {
    formula += ` + ${elbowPrice} * ${elbows}`;
  }
  
  formula += ')';
  
  // Добавляем коэффициенты фланцев
  if (flanges > 1) {
    if (flanges === 2) {
      formula += ` * 1.3`;
    } else {
      formula += ` * 1.3`;
      for (let i = 3; i <= flanges; i++) {
        formula += ` * 1.1`;
      }
    }
  }
  
  // Добавляем дополнительные коэффициенты
  if (additionalCoefficient !== 1) {
    formula += ` * ${additionalCoefficient}`;
  }
  
  return formula;
};

// Функция для получения описания коэффициента фланцев
const getFlangeDescription = (flanges: number): string => {
  if (flanges === 2) {
    return '2 фланца';
  } else if (flanges > 2) {
    return `${flanges} фланцев (1.3 за первые 2 + 1.1 за каждый следующий)`;
  }
  return '';
};
