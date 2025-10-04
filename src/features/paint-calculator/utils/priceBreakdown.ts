import { getPriceItem, getRatioItem } from '../../../calc/engine';
import type { PriceBreakdown } from '../components/PriceBreakdownModal';
import type { PaintWorkRow } from '../types';

export function calculatePriceBreakdown(workRow: PaintWorkRow): PriceBreakdown {
  const baseItem = getPriceItem(workRow.path);
  const basePrice = baseItem.price;
  
  const multipliers: PriceBreakdown['multipliers'] = [];
  let currentPrice = basePrice;

  // Добавляем коэффициенты из workRow.multipliers
  if (workRow.multipliers) {
    for (const multiplierKey of workRow.multipliers) {
      try {
        const ratioItem = getRatioItem(multiplierKey);
        multipliers.push({
          name: ratioItem.en,
          value: ratioItem.value,
          description: getMultiplierDescription(multiplierKey, ratioItem.value)
        });
        currentPrice *= ratioItem.value;
      } catch (error) {
        console.warn(`Could not find ratio item: ${multiplierKey}`);
      }
    }
  }

  const finalPrice = Math.round(currentPrice * 100) / 100; // Округляем до 2 знаков
  const total = Math.round(finalPrice * workRow.data.qty * 100) / 100;

  return {
    basePrice,
    multipliers,
    finalPrice,
    quantity: workRow.data.qty,
    total
  };
}

function getMultiplierDescription(key: string, value: number): string {
  const descriptions: Record<string, string> = {
    'area_lt_30': 'Покрытие ≤ 30%',
    'area_lt_70': 'Покрытие ≤ 70%',
    'framework': 'Открытые поверхности с набором',
    'confined': 'Ограниченное пространство',
    'hold': 'Трюм',
    'ice_paint': 'Ледовая краска',
    'dft800': 'Толщина покрытия 800 мкм',
    'dft1500': 'Толщина покрытия 1500 мкм',
    'metal_structures': 'Металлоконструкции',
    'lifting': 'Подъемные работы',
    'hatch_covers': 'Люковые крышки',
    'deck_saturation': 'Насыщение палубы',
    'painting.full_double_ratio': 'Эпоксидная краска',
    'painting.dft150_ratio': 'Толщина покрытия 150 мкм',
    'painting.dft200_ratio': 'Толщина покрытия 200 мкм',
    'painting.custom_dft_ratio': 'Кастомная толщина покрытия'
  };

  return descriptions[key] || `Коэффициент ${value}`;
}
