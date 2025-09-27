export type Row = {
  en: string;
  ru: string;
  unit: Unit;
  qty: number;
  unitPrice: number;
  total: number;
  notes?: string[];    
  group?: "cleaning" | "painting" | "marks" | "other";
};

export type Unit = "sq.m" | "m" | "run.m" | "set" | "pcs" | "hold";

export type Localized = {
  en: string;
  ru: string;
};

export type PriceItem = Localized & {
  unit: Unit;
  price: number;
};

export type RatioItem = Localized & {
  type: "ratio";
  value: number;
};

export type NoteItem = Localized & {
  note: true;
};

export type PricelistNode = PriceItem | RatioItem | NoteItem;


export type CleaningSection = {
  high_pressure_fresh_water: {
    up_to_300_bar: PriceItem;
    up_to_400_bar: PriceItem;
    up_to_500_bar: PriceItem;
    algae_fouling_ratio: RatioItem;   
    shell_rock_scrapping: PriceItem;
  };
  high_pressure_air: PriceItem;
  fresh_water_rinse: PriceItem;
  chemical_cleaning: PriceItem;
  scraping: {
    st1: PriceItem;
    st2: PriceItem;
  };
  sand_sweeping: PriceItem;
  sand_blasting: {
    sa1: PriceItem;
    sa2: PriceItem;
    sa25: PriceItem;
  };
};

export type PaintingSection = {
  full_single: PriceItem;
  full_antifouling: PriceItem;
  full_double_ratio: RatioItem;  
  dft150_ratio: RatioItem;       
  dft200_ratio: RatioItem;      
  stripe: PriceItem;
  manual: PriceItem;
};

export type MarksSection = {
  vessel_name: PriceItem;
  port_registry: PriceItem;
  draft_marks: PriceItem;
  plimsoll: PriceItem;
  bow_thruster: PriceItem;
  bulbous: PriceItem;
  imo: PriceItem;
  waterline: PriceItem;
};

export type OtherSection = {
  hold_cleaning: PriceItem;
  porthole_protection: PriceItem;
  drum_disposal: PriceItem;
};

export type RatiosSection = {
  min_area: NoteItem;            
  area_lt_30: RatioItem;
  area_lt_70: RatioItem;
  framework: RatioItem;
  confined: RatioItem;
  hold: RatioItem;
  ice_paint: RatioItem;
  dft800: RatioItem;
  dft1500: RatioItem;
  metal_structures: RatioItem;
  lifting: RatioItem;
  hatch_covers: RatioItem;
  deck_saturation: RatioItem;
};

export type RulesSection = {
  rounding: { money: number; area: number };
  calculation: "base_price * all_selected_ratios * quantity";
};

export type Pricelist = {
  cleaning: CleaningSection;
  painting: PaintingSection;
  marks: MarksSection;
  other: OtherSection;
  ratios: RatiosSection;
  rules: RulesSection;
};

export const isPriceItem = (n: PricelistNode): n is PriceItem =>
  (n as any).price !== undefined && (n as any).unit !== undefined;

export const isRatioItem = (n: PricelistNode): n is RatioItem =>
  (n as any).type === "ratio" && typeof (n as any).value === "number";

export const isNoteItem = (n: PricelistNode): n is NoteItem =>
  (n as any).note === true;



