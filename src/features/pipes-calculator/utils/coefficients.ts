import type { PipeCoefficients } from '../types';
import pipesData from '../../../data/pipes-pricelist.json';

// Загружаем коэффициенты из JSON
const coefficientsData = (pipesData as any).coefficients;

// Значения коэффициентов
export const COEFFICIENT_VALUES: Record<keyof PipeCoefficients, number> = {
  engineRoom: coefficientsData.engineRoom.value,
  threadedConnection: coefficientsData.threadedConnection.value,
  sch80: coefficientsData.sch80.value,
  hydraulics: coefficientsData.hydraulics.value,
  interferingPipeline: coefficientsData.interferingPipeline.value,
  plastic: coefficientsData.plastic.value,
  copper: coefficientsData.copper.value,
  stainlessSteel: coefficientsData.stainlessSteel.value,
  metalPlastic: coefficientsData.metalPlastic.value,
  customerMaterial: coefficientsData.customerMaterial.value,
  airBlow: coefficientsData.airBlow.value,
  painted: coefficientsData.painted.value,
  inTank: coefficientsData.inTank.value,
  inTunnel: coefficientsData.inTunnel.value,
  handover: coefficientsData.handover.value,
  newPipeline: coefficientsData.newPipeline.value,
  sch160: coefficientsData.sch160.value,
  repairOnSite: coefficientsData.repairOnSite.value,
};

// Описания коэффициентов
export const COEFFICIENT_DESCRIPTIONS: Record<keyof PipeCoefficients, string> = {
  engineRoom: coefficientsData.engineRoom.description,
  threadedConnection: coefficientsData.threadedConnection.description,
  sch80: coefficientsData.sch80.description,
  hydraulics: coefficientsData.hydraulics.description,
  interferingPipeline: coefficientsData.interferingPipeline.description,
  plastic: coefficientsData.plastic.description,
  copper: coefficientsData.copper.description,
  stainlessSteel: coefficientsData.stainlessSteel.description,
  metalPlastic: coefficientsData.metalPlastic.description,
  customerMaterial: coefficientsData.customerMaterial.description,
  airBlow: coefficientsData.airBlow.description,
  painted: coefficientsData.painted.description,
  inTank: coefficientsData.inTank.description,
  inTunnel: coefficientsData.inTunnel.description,
  handover: coefficientsData.handover.description,
  newPipeline: coefficientsData.newPipeline.description,
  sch160: coefficientsData.sch160.description,
  repairOnSite: coefficientsData.repairOnSite.description,
};

// Функция для расчета итогового коэффициента
export const calculateTotalCoefficient = (coefficients: PipeCoefficients): number => {
  let totalCoefficient = 1;
  
  Object.entries(coefficients).forEach(([key, isActive]) => {
    if (isActive) {
      totalCoefficient *= COEFFICIENT_VALUES[key as keyof PipeCoefficients];
    }
  });
  
  return totalCoefficient;
};

// Функция для получения активных коэффициентов
export const getActiveCoefficients = (coefficients: PipeCoefficients): Array<{
  name: string;
  value: number;
  description: string;
}> => {
  const active: Array<{ name: string; value: number; description: string }> = [];
  
  Object.entries(coefficients).forEach(([key, isActive]) => {
    if (isActive) {
      active.push({
        name: key,
        value: COEFFICIENT_VALUES[key as keyof PipeCoefficients],
        description: COEFFICIENT_DESCRIPTIONS[key as keyof PipeCoefficients]
      });
    }
  });
  
  return active;
};
