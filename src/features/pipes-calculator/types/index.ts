// Типы для калькулятора труб
export type PipeType = "black" | "galvanized";

export type PipeItem = {
  dn_mm: number;
  pipe_black: number;
  pipe_galvanized: number;
  fitting_elbow_transition_weld: number;
};

export type PipeWorkRow = {
  type: 'work';
  data: {
    en: string;
    ru: string;
    unit: string;
    qty: number;
    unitPrice: number;
    total: number;
  };
  path: string;
  multipliers: string[];
};

export type PipeTableRow = PipeWorkRow;

export type PipeCoefficients = {
  engineRoom: boolean; // В М.О. или насосном отделении — K = 1,15
  threadedConnection: boolean; // Трубы со штуцерным соединением — K = 1,26
  sch80: boolean; // Трубы SCH80 — K = 1,2
  hydraulics: boolean; // Трубы гидравлики — K = 1,7
  interferingPipeline: boolean; // Мешающий трубопровод (ДМС) — K = 0,35
  plastic: boolean; // Пластиковые трубы — K = 0,6
  copper: boolean; // Медные трубы — K = 3,4
  stainlessSteel: boolean; // Трубы из нержавеющей стали — K = 3,6
  metalPlastic: boolean; // Металлопластик — K = 0,65
  customerMaterial: boolean; // Материал заказчика — K = 0,8
  airBlow: boolean; // Тр-да продувка воздухом (прочистка) — K = 0,65
  painted: boolean; // Тр-да покрашенный — K = 1,05
  inTank: boolean; // Тр-да в танке, колодцах — K = 1,25
  inTunnel: boolean; // В труб. туннелях, танках 2-го дна — K = 1,35
  handover: boolean; // Изготовить и передать л/с — K = 0,65
  newPipeline: boolean; // Изготовление и прокладка нового тр-да с макетированием и подгонкой по месту — K = 1,3
  sch160: boolean; // Трубы SCH160 — K = 1,5
  repairOnSite: boolean; // Ремонт на месте — K = 0,4
};

export type PipeCalculatorState = {
  pipeType: PipeType;
  diameter: number;
  length: number;
  quantity: number;
  flanges: number;
  elbows: number;
  coefficients: PipeCoefficients;
  tableRows: PipeTableRow[];
  editingRowIndex: number | null;
};

export type PipeCalculatorActions = {
  setPipeType: (pipeType: PipeType) => void;
  setDiameter: (diameter: number) => void;
  setLength: (length: number) => void;
  setQuantity: (quantity: number) => void;
  setFlanges: (flanges: number) => void;
  setElbows: (elbows: number) => void;
  setCoefficients: (coefficients: PipeCoefficients) => void;
  addWork: () => void;
  clear: () => void;
  removeWork: (index: number) => void;
  startEditWork: (index: number) => void;
  cancelEdit: () => void;
  saveEdit: () => void;
};
