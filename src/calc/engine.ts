import pricelist from "./pricelist";
import type { Pricelist, PricelistNode, PriceItem, RatioItem, Unit } from "./types";

export function getPricelistItem(path: string): PricelistNode | undefined {
  return path.split(".").reduce((acc: any, k) => (acc ? acc[k] : undefined), pricelist as Pricelist);
}


export function getPriceItem(path: string): PriceItem {
  const node = getPricelistItem(path);
  if (!node || !("price" in node) || !("unit" in node)) {
    throw new Error(`Not a PriceItem at "${path}"`);
  }
  return node;
}

export function getRatioItem(keyOrPath: string): RatioItem {
  const direct = (pricelist as any).ratios?.[keyOrPath];
  const node: PricelistNode | undefined = direct ?? getPricelistItem(keyOrPath);
  if (!node || !("type" in node) || node.type !== "ratio") {
    throw new Error(`Not a RatioItem at "${keyOrPath}"`);
  }
  return node;
}

export function applyRatios(base: number, keys: string[], notes?: string[]) {
  let price = base;
  for (const k of keys) {
    const r = getRatioItem(k);
    price *= r.value;
    if (notes) notes.push(`${r.en} ×${r.value}`);
  }
  return price;
}

export const roundMoney = (v: number, digits = pricelist.rules.rounding.money) =>
  Number(v.toFixed(digits));
export const roundArea = (v: number, step = pricelist.rules.rounding.area) =>
  Math.round(v / step) * step;

// Конструктор строки сметы
export type Row = {
  en: string; ru: string; unit: Unit;
  qty: number; unitPrice: number; total: number;
  notes?: string[]; group?: "cleaning" | "painting" | "marks" | "other";
};

export function makeRow(args: {
  path: string;
  qty: number;
  multipliers?: string[];               // напр.: ["area_lt_30","framework","painting.dft200_ratio"]
  titleOverride?: { en: string; ru: string };
  group?: Row["group"];
}): Row {
  const base = getPriceItem(args.path);
  const notes: string[] = [];
  const priceRaw = applyRatios(base.price, args.multipliers ?? [], notes);
  const unitPrice = roundMoney(priceRaw);
  const total = roundMoney(unitPrice * args.qty);

  return {
    en: args.titleOverride?.en ?? base.en,
    ru: args.titleOverride?.ru ?? base.ru,
    unit: base.unit,
    qty: args.qty,
    unitPrice,
    total,
    notes,
    group: args.group,
  };
}
