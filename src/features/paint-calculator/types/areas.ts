// Участки судна для покрасочных работ
export type AreaKind = "topside" | "boottop" | "vertical" | "flat_bottom" | "hold" | "cranes" | "rudder_blade" | "vertical_bottom" | "other" | string;

export const AREA_OPTIONS: { value: AreaKind; labelRu: string; labelEn: string; autoRatios?: string[] }[] = [
  { value: "topside",     labelRu: "Надводный борт", labelEn: "Topside" },
  { value: "boottop",     labelRu: "ППВЛ (boot-top)", labelEn: "Boot-top" },
  { value: "vertical",    labelRu: "Вертикальные борта", labelEn: "Vertical sides" },
  { value: "flat_bottom", labelRu: "Плоское днище", labelEn: "Flat bottom" },
  { value: "hold",        labelRu: "Трюм", labelEn: "Cargo hold" },
  { value: "cranes",      labelRu: "Краны/металлоконструкции", labelEn: "Cranes" },
  { value: "rudder_blade", labelRu: "Перо руля", labelEn: "Rudder blade" },
  { value: "vertical_bottom", labelRu: "Вертикальное дно", labelEn: "Vertical bottom" },
  { value: "other",       labelRu: "Другое", labelEn: "Other" },
];
