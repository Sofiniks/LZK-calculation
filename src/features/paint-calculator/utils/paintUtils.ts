import { makeRow, getPriceItem } from "../../../calc/engine";
import { AREA_OPTIONS, type AreaKind } from "../types/areas";
import type { PaintWorkPickerValue } from "../components/PaintWorkPicker";
import type { PaintWorkRow } from "../types";

// Утилита для расчета количества из процента
export const qtyFromPercent = (area: number, percent: number): number => 
  Math.round((area * (percent / 100)) * 10) / 10;

// Функция для поиска пути работы по названию
export const findWorkPath = (enName: string, ruName: string): string => {
  // Очищаем названия от дополнительной информации (микроны, проценты)
  const cleanEnName = enName.replace(/\s+\d+mic\s*/, '').replace(/\s*–\s*\d+%/, '').trim();
  const cleanRuName = ruName.replace(/\s+\d+\s*мкм\s*/, '').replace(/\s*–\s*\d+%/, '').trim();
  
  // Поиск по английскому названию
  if (cleanEnName.includes("Sand blasting SA-1")) return "cleaning.sand_blasting.sa1";
  if (cleanEnName.includes("Sand blasting SA-2.5")) return "cleaning.sand_blasting.sa25";
  if (cleanEnName.includes("Sand blasting SA-2")) return "cleaning.sand_blasting.sa2";
  if (cleanEnName.includes("High pressure fresh water washing up to 500 bar")) return "cleaning.high_pressure_fresh_water.up_to_500_bar";
  if (cleanEnName.includes("High pressure fresh water washing up to 400 bar")) return "cleaning.high_pressure_fresh_water.up_to_400_bar";
  if (cleanEnName.includes("High pressure fresh water washing up to 300 bar")) return "cleaning.high_pressure_fresh_water.up_to_300_bar";
  if (cleanEnName.includes("Fresh water rinse")) return "cleaning.fresh_water_rinse";
  if (cleanEnName.includes("single-component") || cleanEnName.includes("epoxy")) return "painting.full_single";
  if (cleanEnName.includes("antifouling")) return "painting.full_antifouling";
  
  // Поиск по русскому названию
  if (cleanRuName.includes("Пескоструйная очистка SA-1")) return "cleaning.sand_blasting.sa1";
  if (cleanRuName.includes("Пескоструйная очистка SA-2.5")) return "cleaning.sand_blasting.sa25";
  if (cleanRuName.includes("Пескоструйная очистка SA-2")) return "cleaning.sand_blasting.sa2";
  if (cleanRuName.includes("Обмыв пресной водой высокого давления до 500 бар")) return "cleaning.high_pressure_fresh_water.up_to_500_bar";
  if (cleanRuName.includes("Обмыв пресной водой высокого давления до 400 бар")) return "cleaning.high_pressure_fresh_water.up_to_500_bar";
  if (cleanRuName.includes("Обмыв пресной водой высокого давления до 300 бар")) return "cleaning.high_pressure_fresh_water.up_to_300_bar";
  if (cleanRuName.includes("Обмыв пресной водой до 200 бар")) return "cleaning.fresh_water_rinse";
  if (cleanRuName.includes("однокомпонентная") || cleanRuName.includes("эпоксидная")) return "painting.full_single";
  if (cleanRuName.includes("противообрастающая")) return "painting.full_antifouling";
  
  // По умолчанию
  return "cleaning.sand_blasting.sa2";
};

// Функция для извлечения процента из названия
export const extractPercent = (enName: string): number => {
  const match = enName.match(/(\d+)%/);
  return match ? parseInt(match[1]) : 100;
};

// Функция для извлечения микрон из названия
export const extractMicrons = (enName: string, ruName: string): number | undefined => {
  // Ищем в английском названии
  const enMatch = enName.match(/(\d+)mic/);
  if (enMatch) return parseInt(enMatch[1]);
  
  // Ищем в русском названии
  const ruMatch = ruName.match(/(\d+)\s*мкм/);
  if (ruMatch) return parseInt(ruMatch[1]);
  
  return undefined;
};

// Функция для создания мультипликаторов
export const createMultipliers = (work: PaintWorkPickerValue, areaKind: AreaKind): string[] => {
  const multipliers: string[] = [];

  // 1) авто-коэффициенты участка
  const autoForArea = AREA_OPTIONS.find(a => a.value === areaKind)?.autoRatios ?? [];
  multipliers.push(...autoForArea);

  // 1.5) коэффициенты на площадь покрытия (только для работ с единицей sq.m)
  const base = getPriceItem(work.path);
  if (base.unit === "sq.m") {
    const percent = work.percent ?? 100;
    if (percent < 30) {
      multipliers.push("area_lt_30");
    } else if (percent < 70) {
      multipliers.push("area_lt_70");
    }
  }

  // 2) покрасочные коэффициенты
  if (work.paintingCoeffs) {
    if (work.paintingCoeffs.doubleComponent) multipliers.push("painting.full_double_ratio");
    
    // Логика применения коэффициентов по микронам
    if (work.paintingCoeffs.customDft) {
      // Если введено произвольное значение, применяем коэффициент по логике
      if (work.paintingCoeffs.customDft >= 200) {
        multipliers.push("painting.dft200_ratio");
      } else if (work.paintingCoeffs.customDft >= 150) {
        multipliers.push("painting.dft150_ratio");
      }
      // Если меньше 150, коэффициент не применяется
    } else {
      // Если не введено произвольное значение, используем чекбоксы
      if (work.paintingCoeffs.dft150) multipliers.push("painting.dft150_ratio");
      if (work.paintingCoeffs.dft200) multipliers.push("painting.dft200_ratio");
    }
  }

  // 3) дополнительные коэффициенты
  if (work.additionalCoeffs) {
    if (work.additionalCoeffs.framework) multipliers.push("framework");
    if (work.additionalCoeffs.confined) multipliers.push("confined");
    if (work.additionalCoeffs.hold) multipliers.push("hold");
    if (work.additionalCoeffs.icePaint) multipliers.push("ice_paint");
    if (work.additionalCoeffs.dft800) multipliers.push("dft800");
    if (work.additionalCoeffs.dft1500) multipliers.push("dft1500");
    if (work.additionalCoeffs.metalStructures) multipliers.push("metal_structures");
    if (work.additionalCoeffs.lifting) multipliers.push("lifting");
    if (work.additionalCoeffs.hatchCovers) multipliers.push("hatch_covers");
    if (work.additionalCoeffs.deckSaturation) multipliers.push("deck_saturation");
  }

  return multipliers;
};

// Функция для создания заголовка с % и толщиной слоя
export const createTitleOverride = (work: PaintWorkPickerValue) => {
  const base = getPriceItem(work.path);
  
  if (base.unit !== "sq.m") return undefined;

  const percent = work.percent ?? 100;
  let dftText = "";
  
  // Микроны добавляем только к покрасочным работам
  if (work.path.startsWith("painting.")) {
    if (work.paintingCoeffs?.customDft) {
      // Если введено произвольное значение, используем его
      dftText = ` ${work.paintingCoeffs.customDft}mic`;
    } else if (work.paintingCoeffs?.dft150) {
      dftText = " 150mic";
    } else if (work.paintingCoeffs?.dft200) {
      dftText = " 200mic";
    }
  }

  // Заменяем "single-component" на "epoxy" если выбран эпоксидный коэффициент
  let enText = base.en;
  let ruText = base.ru;
  
  if (work.paintingCoeffs?.doubleComponent) {
    enText = enText.replace("single-component", "epoxy");
    ruText = ruText.replace("однокомпонентная", "эпоксидная");
  }

  // Если не полное покрытие (не 100%), заменяем "Full coat" на "TU"
  if (percent < 100) {
    enText = enText.replace("Full coat", "TU");
    ruText = ruText.replace("Полный слой", "TU");
  }
  
  return {
    en: `${enText}${dftText} – ${percent}%`,
    ru: `${ruText}${dftText.replace("mic", " мкм")} – ${percent}%`,
  };
};

// Функция для создания строки работы
export const createWorkRow = (work: PaintWorkPickerValue, areaKind: AreaKind, areaTotal: number): PaintWorkRow => {
  const base = getPriceItem(work.path);
  const multipliers = createMultipliers(work, areaKind);
  
  // 4) qty
  const qty = base.unit === "sq.m" 
    ? qtyFromPercent(areaTotal, work.percent ?? 100)
    : (work.qty ?? 1);

  // 5) заголовок с % и толщиной слоя
  const titleOverride = createTitleOverride(work);

  const row = makeRow({
    path: work.path,
    qty,
    multipliers,
    titleOverride,
    group: base.unit === "sq.m" ? "cleaning" : "painting",
  });

  return {
    type: 'work',
    data: row
  };
};

// Функция для сброса коэффициентов работы
export const resetWorkCoeffs = (work: PaintWorkPickerValue): PaintWorkPickerValue => ({
  ...work,
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
});

// Функция для восстановления работы из строки таблицы
export const restoreWorkFromRow = (row: any): PaintWorkPickerValue => {
  const workPath = findWorkPath(row.data.en, row.data.ru);
  const percent = extractPercent(row.data.en);
  const customMicrons = extractMicrons(row.data.en, row.data.ru);
  
  // Определяем коэффициенты по названию
  const isDoubleComponent = row.data.en.includes("epoxy") || row.data.ru.includes("эпоксидная");
  const isDft150 = row.data.en.includes("150mic") || row.data.ru.includes("150 мкм");
  const isDft200 = row.data.en.includes("200mic") || row.data.ru.includes("200 мкм");
  
  return {
    path: workPath,
    percent: percent,
    paintingCoeffs: {
      doubleComponent: isDoubleComponent,
      dft150: isDft150 && !customMicrons,
      dft200: isDft200 && !customMicrons,
      customDft: customMicrons
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
};
