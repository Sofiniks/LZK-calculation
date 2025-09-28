import { useMemo, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select, Stack, TextField, Checkbox, FormControlLabel, Button, Collapse, Typography, Chip } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import pricelist from "../../../calc/pricelist";
import { getPriceItem } from "../../../calc/engine";

// Маппинг коэффициентов и их значений
const COEFFICIENT_VALUES: Record<string, number> = {
  framework: 1.25,
  confined: 3.5,
  hold: 1.15,
  icePaint: 1.7,
  dft800: 1.5,
  dft1500: 2.0,
  metalStructures: 1.45,
  lifting: 1.2,
  hatchCovers: 1.2,
  deckSaturation: 1.2
};

type Opt = { path: string; label: string };

function listCleaningItems(): Opt[] {
  const out: Opt[] = [];
  const push = (path: string, obj: any) => {
    Object.entries(obj).forEach(([k, v]) => {
      const p = `${path}.${k}`;
      if (v && typeof v === "object" && "price" in v && "unit" in v) {
        out.push({ path: p.slice(1), label: (v as any).ru || (v as any).en });
      } else if (v && typeof v === "object" && !("type" in v)) {
        push(p, v);
      }
    });
  };
  push("", { cleaning: pricelist.cleaning });
  return out;
}

function listPaintingItems(): Opt[] {
  const out: Opt[] = [];
  const push = (path: string, obj: any) => {
    Object.entries(obj).forEach(([k, v]) => {
      const p = `${path}.${k}`;
      if (v && typeof v === "object" && "price" in v && "unit" in v) {
        out.push({ path: p.slice(1), label: (v as any).ru || (v as any).en });
      } else if (v && typeof v === "object" && !("type" in v)) {
        push(p, v);
      }
    });
  };
  push("", { painting: pricelist.painting });
  return out;
}

export type PaintWorkPickerValue = {
  path: string;          
  percent?: number;       
  qty?: number;
  paintingCoeffs?: {
    doubleComponent: boolean;
    dft150: boolean;
    dft200: boolean;
    customDft?: number; // произвольное количество микрон
  };
  additionalCoeffs?: {
    framework: boolean;
    confined: boolean;
    hold: boolean;
    icePaint: boolean;
    dft800: boolean;
    dft1500: boolean;
    metalStructures: boolean;
    lifting: boolean;
    hatchCovers: boolean;
    deckSaturation: boolean;
  };
};

export default function PaintWorkPicker(props: {
  value: PaintWorkPickerValue;
  onChange: (v: PaintWorkPickerValue) => void;
}) {
  const cleaningOptions = useMemo(listCleaningItems, []);
  const paintingOptions = useMemo(listPaintingItems, []);
  const v = props.value;
  const [showCoeffs, setShowCoeffs] = useState(false);

  const unit = v.path ? getPriceItem(v.path).unit : undefined;
  const isAreaUnit = unit === "sq.m";
  const isPaintingWork = v.path?.startsWith("painting.");
  const isAntifouling = v.path === "painting.full_antifouling";

  return (
    <>
    <Stack direction="row" spacing={2} alignItems="center">
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Очистка</InputLabel>
        <Select
          label="Очистка"
          value={v.path?.startsWith("cleaning.") ? v.path : ""}
          onChange={(e) => props.onChange({ ...v, path: e.target.value })}
        >
          <MenuItem value="">Выберите очистку</MenuItem>
          {cleaningOptions.map((o) => (
            <MenuItem key={o.path} value={o.path}>{o.label}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Покраска</InputLabel>
        <Select
          label="Покраска"
          value={v.path?.startsWith("painting.") ? v.path : ""}
          onChange={(e) => props.onChange({ ...v, path: e.target.value })}
        >
          <MenuItem value="">Выберите покраску</MenuItem>
          {paintingOptions.map((o) => (
            <MenuItem key={o.path} value={o.path}>{o.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>

    <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
      {isAreaUnit ? (
        <TextField
          label="% покрытия"
          type="number"
          value={v.percent ?? ''}
          onChange={(e) => {
            const value = e.target.value;
            if (value === '') {
              props.onChange({ ...v, percent: undefined });
            } else {
              const numValue = Number(value);
              if (!isNaN(numValue) && numValue >= 1 && numValue <= 100) {
                props.onChange({ ...v, percent: numValue });
              }
            }
          }}
          slotProps={{ htmlInput: { min: 1, max: 100, step: 1 } }}
          sx={{ width: 140 }}
        />
      ) : (
        <TextField
          label="Количество"
          type="number"
          value={v.qty ?? 1}
          onChange={(e) => props.onChange({ ...v, qty: Number(e.target.value) })}
          sx={{ width: 140 }}
        />
      )}

      {isPaintingWork && (
        <Stack direction="row" spacing={1}>
          <FormControlLabel
            control={
              <Checkbox
                checked={v.paintingCoeffs?.doubleComponent ?? false}
                disabled={isAntifouling}
                onChange={(e) => props.onChange({
                  ...v,
                  paintingCoeffs: { 
                    doubleComponent: e.target.checked,
                    dft150: v.paintingCoeffs?.dft150 ?? false, 
                    dft200: v.paintingCoeffs?.dft200 ?? false,
                    customDft: v.paintingCoeffs?.customDft
                  }
                })}
              />
            }
            label="Эпоксидная"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={v.paintingCoeffs?.dft150 ?? false}
                onChange={(e) => props.onChange({
                  ...v,
                  paintingCoeffs: { 
                    doubleComponent: v.paintingCoeffs?.doubleComponent ?? false,
                    dft150: e.target.checked, 
                    dft200: v.paintingCoeffs?.dft200 ?? false,
                    customDft: v.paintingCoeffs?.customDft
                  }
                })}
              />
            }
            label="DFT 150"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={v.paintingCoeffs?.dft200 ?? false}
                onChange={(e) => props.onChange({
                  ...v,
                  paintingCoeffs: { 
                    doubleComponent: v.paintingCoeffs?.doubleComponent ?? false,
                    dft150: v.paintingCoeffs?.dft150 ?? false, 
                    dft200: e.target.checked,
                    customDft: v.paintingCoeffs?.customDft
                  }
                })}
              />
            }
            label="DFT 200"
          />
        </Stack>
      )}

      {isPaintingWork && (
        <TextField
          label="мкм"
          type="number"
          value={v.paintingCoeffs?.customDft ?? ''}
          onChange={(e) => {
            const value = e.target.value;
            if (value === '') {
              props.onChange({
                ...v,
                paintingCoeffs: {
                  doubleComponent: v.paintingCoeffs?.doubleComponent ?? false,
                  dft150: v.paintingCoeffs?.dft150 ?? false,
                  dft200: v.paintingCoeffs?.dft200 ?? false,
                  customDft: undefined
                }
              });
            } else {
              const numValue = Number(value);
              if (!isNaN(numValue) && numValue > 0) {
                props.onChange({
                  ...v,
                  paintingCoeffs: {
                    doubleComponent: v.paintingCoeffs?.doubleComponent ?? false,
                    dft150: v.paintingCoeffs?.dft150 ?? false,
                    dft200: v.paintingCoeffs?.dft200 ?? false,
                    customDft: numValue
                  }
                });
              }
            }
          }}
          slotProps={{ htmlInput: { min: 1, step: 1 } }}
          sx={{ width: 80, mt: 1 }}
        />
      )}

      <Button
        variant="outlined"
        onClick={() => setShowCoeffs(!showCoeffs)}
        endIcon={showCoeffs ? <ExpandLess /> : <ExpandMore />}
        sx={{ minWidth: 140 }}
      >
        Коэффициенты
      </Button>

    </Stack>

    <Collapse in={showCoeffs}>
      <Stack spacing={1} sx={{ mt: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Дополнительные коэффициенты:</Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <FormControlLabel
            control={
              <Checkbox
                checked={v.additionalCoeffs?.framework ?? false}
                onChange={(e) => props.onChange({
                  ...v,
                  additionalCoeffs: { 
                    framework: e.target.checked,
                    confined: v.additionalCoeffs?.confined ?? false,
                    hold: v.additionalCoeffs?.hold ?? false,
                    icePaint: v.additionalCoeffs?.icePaint ?? false,
                    dft800: v.additionalCoeffs?.dft800 ?? false,
                    dft1500: v.additionalCoeffs?.dft1500 ?? false,
                    metalStructures: v.additionalCoeffs?.metalStructures ?? false,
                    lifting: v.additionalCoeffs?.lifting ?? false,
                    hatchCovers: v.additionalCoeffs?.hatchCovers ?? false,
                    deckSaturation: v.additionalCoeffs?.deckSaturation ?? false
                  }
                })}
              />
            }
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <span>Открытые поверхности с набором</span>
                <Chip 
                  label={`×${COEFFICIENT_VALUES.framework}`} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  sx={{ fontSize: '0.75rem', height: '20px' }}
                />
              </Stack>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={v.additionalCoeffs?.confined ?? false}
                onChange={(e) => props.onChange({
                  ...v,
                  additionalCoeffs: { 
                    framework: v.additionalCoeffs?.framework ?? false,
                    confined: e.target.checked,
                    hold: v.additionalCoeffs?.hold ?? false,
                    icePaint: v.additionalCoeffs?.icePaint ?? false,
                    dft800: v.additionalCoeffs?.dft800 ?? false,
                    dft1500: v.additionalCoeffs?.dft1500 ?? false,
                    metalStructures: v.additionalCoeffs?.metalStructures ?? false,
                    lifting: v.additionalCoeffs?.lifting ?? false,
                    hatchCovers: v.additionalCoeffs?.hatchCovers ?? false,
                    deckSaturation: v.additionalCoeffs?.deckSaturation ?? false
                  }
                })}
              />
            }
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <span>Закрытые помещения (танки)</span>
                <Chip 
                  label={`×${COEFFICIENT_VALUES.confined}`} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  sx={{ fontSize: '0.75rem', height: '20px' }}
                />
              </Stack>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={v.additionalCoeffs?.hold ?? false}
                onChange={(e) => props.onChange({
                  ...v,
                  additionalCoeffs: { 
                    framework: v.additionalCoeffs?.framework ?? false,
                    confined: v.additionalCoeffs?.confined ?? false,
                    hold: e.target.checked,
                    icePaint: v.additionalCoeffs?.icePaint ?? false,
                    dft800: v.additionalCoeffs?.dft800 ?? false,
                    dft1500: v.additionalCoeffs?.dft1500 ?? false,
                    metalStructures: v.additionalCoeffs?.metalStructures ?? false,
                    lifting: v.additionalCoeffs?.lifting ?? false,
                    hatchCovers: v.additionalCoeffs?.hatchCovers ?? false,
                    deckSaturation: v.additionalCoeffs?.deckSaturation ?? false
                  }
                })}
              />
            }
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <span>Обработка трюмов</span>
                <Chip 
                  label={`×${COEFFICIENT_VALUES.hold}`} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  sx={{ fontSize: '0.75rem', height: '20px' }}
                />
              </Stack>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={v.additionalCoeffs?.icePaint ?? false}
                onChange={(e) => props.onChange({
                  ...v,
                  additionalCoeffs: { 
                    framework: v.additionalCoeffs?.framework ?? false,
                    confined: v.additionalCoeffs?.confined ?? false,
                    hold: v.additionalCoeffs?.hold ?? false,
                    icePaint: e.target.checked,
                    dft800: v.additionalCoeffs?.dft800 ?? false,
                    dft1500: v.additionalCoeffs?.dft1500 ?? false,
                    metalStructures: v.additionalCoeffs?.metalStructures ?? false,
                    lifting: v.additionalCoeffs?.lifting ?? false,
                    hatchCovers: v.additionalCoeffs?.hatchCovers ?? false,
                    deckSaturation: v.additionalCoeffs?.deckSaturation ?? false
                  }
                })}
              />
            }
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <span>Удаление ледовой краски</span>
                <Chip 
                  label={`×${COEFFICIENT_VALUES.icePaint}`} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  sx={{ fontSize: '0.75rem', height: '20px' }}
                />
              </Stack>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={v.additionalCoeffs?.dft800 ?? false}
                onChange={(e) => props.onChange({
                  ...v,
                  additionalCoeffs: { 
                    framework: v.additionalCoeffs?.framework ?? false,
                    confined: v.additionalCoeffs?.confined ?? false,
                    hold: v.additionalCoeffs?.hold ?? false,
                    icePaint: v.additionalCoeffs?.icePaint ?? false,
                    dft800: e.target.checked,
                    dft1500: v.additionalCoeffs?.dft1500 ?? false,
                    metalStructures: v.additionalCoeffs?.metalStructures ?? false,
                    lifting: v.additionalCoeffs?.lifting ?? false,
                    hatchCovers: v.additionalCoeffs?.hatchCovers ?? false,
                    deckSaturation: v.additionalCoeffs?.deckSaturation ?? false
                  }
                })}
              />
            }
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <span>Старое покрытие &gt;800 мкм</span>
                <Chip 
                  label={`×${COEFFICIENT_VALUES.dft800}`} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  sx={{ fontSize: '0.75rem', height: '20px' }}
                />
              </Stack>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={v.additionalCoeffs?.dft1500 ?? false}
                onChange={(e) => props.onChange({
                  ...v,
                  additionalCoeffs: { 
                    framework: v.additionalCoeffs?.framework ?? false,
                    confined: v.additionalCoeffs?.confined ?? false,
                    hold: v.additionalCoeffs?.hold ?? false,
                    icePaint: v.additionalCoeffs?.icePaint ?? false,
                    dft800: v.additionalCoeffs?.dft800 ?? false,
                    dft1500: e.target.checked,
                    metalStructures: v.additionalCoeffs?.metalStructures ?? false,
                    lifting: v.additionalCoeffs?.lifting ?? false,
                    hatchCovers: v.additionalCoeffs?.hatchCovers ?? false,
                    deckSaturation: v.additionalCoeffs?.deckSaturation ?? false
                  }
                })}
              />
            }
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <span>Старое покрытие &gt;1500 мкм</span>
                <Chip 
                  label={`×${COEFFICIENT_VALUES.dft1500}`} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  sx={{ fontSize: '0.75rem', height: '20px' }}
                />
              </Stack>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={v.additionalCoeffs?.metalStructures ?? false}
                onChange={(e) => props.onChange({
                  ...v,
                  additionalCoeffs: { 
                    framework: v.additionalCoeffs?.framework ?? false,
                    confined: v.additionalCoeffs?.confined ?? false,
                    hold: v.additionalCoeffs?.hold ?? false,
                    icePaint: v.additionalCoeffs?.icePaint ?? false,
                    dft800: v.additionalCoeffs?.dft800 ?? false,
                    dft1500: v.additionalCoeffs?.dft1500 ?? false,
                    metalStructures: e.target.checked,
                    lifting: v.additionalCoeffs?.lifting ?? false,
                    hatchCovers: v.additionalCoeffs?.hatchCovers ?? false,
                    deckSaturation: v.additionalCoeffs?.deckSaturation ?? false
                  }
                })}
              />
            }
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <span>Металлоконструкции</span>
                <Chip 
                  label={`×${COEFFICIENT_VALUES.metalStructures}`} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  sx={{ fontSize: '0.75rem', height: '20px' }}
                />
              </Stack>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={v.additionalCoeffs?.lifting ?? false}
                onChange={(e) => props.onChange({
                  ...v,
                  additionalCoeffs: { 
                    framework: v.additionalCoeffs?.framework ?? false,
                    confined: v.additionalCoeffs?.confined ?? false,
                    hold: v.additionalCoeffs?.hold ?? false,
                    icePaint: v.additionalCoeffs?.icePaint ?? false,
                    dft800: v.additionalCoeffs?.dft800 ?? false,
                    dft1500: v.additionalCoeffs?.dft1500 ?? false,
                    metalStructures: v.additionalCoeffs?.metalStructures ?? false,
                    lifting: e.target.checked,
                    hatchCovers: v.additionalCoeffs?.hatchCovers ?? false,
                    deckSaturation: v.additionalCoeffs?.deckSaturation ?? false
                  }
                })}
              />
            }
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <span>С использованием подъемных средств</span>
                <Chip 
                  label={`×${COEFFICIENT_VALUES.lifting}`} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  sx={{ fontSize: '0.75rem', height: '20px' }}
                />
              </Stack>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={v.additionalCoeffs?.hatchCovers ?? false}
                onChange={(e) => props.onChange({
                  ...v,
                  additionalCoeffs: { 
                    framework: v.additionalCoeffs?.framework ?? false,
                    confined: v.additionalCoeffs?.confined ?? false,
                    hold: v.additionalCoeffs?.hold ?? false,
                    icePaint: v.additionalCoeffs?.icePaint ?? false,
                    dft800: v.additionalCoeffs?.dft800 ?? false,
                    dft1500: v.additionalCoeffs?.dft1500 ?? false,
                    metalStructures: v.additionalCoeffs?.metalStructures ?? false,
                    lifting: v.additionalCoeffs?.lifting ?? false,
                    hatchCovers: e.target.checked,
                    deckSaturation: v.additionalCoeffs?.deckSaturation ?? false
                  }
                })}
              />
            }
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <span>Люковые закрытия</span>
                <Chip 
                  label={`×${COEFFICIENT_VALUES.hatchCovers}`} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  sx={{ fontSize: '0.75rem', height: '20px' }}
                />
              </Stack>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={v.additionalCoeffs?.deckSaturation ?? false}
                onChange={(e) => props.onChange({
                  ...v,
                  additionalCoeffs: { 
                    framework: v.additionalCoeffs?.framework ?? false,
                    confined: v.additionalCoeffs?.confined ?? false,
                    hold: v.additionalCoeffs?.hold ?? false,
                    icePaint: v.additionalCoeffs?.icePaint ?? false,
                    dft800: v.additionalCoeffs?.dft800 ?? false,
                    dft1500: v.additionalCoeffs?.dft1500 ?? false,
                    metalStructures: v.additionalCoeffs?.metalStructures ?? false,
                    lifting: v.additionalCoeffs?.lifting ?? false,
                    hatchCovers: v.additionalCoeffs?.hatchCovers ?? false,
                    deckSaturation: e.target.checked
                  }
                })}
              />
            }
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <span>Палуба с насыщением</span>
                <Chip 
                  label={`×${COEFFICIENT_VALUES.deckSaturation}`} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  sx={{ fontSize: '0.75rem', height: '20px' }}
                />
              </Stack>
            }
          />
        </Stack>
      </Stack>
    </Collapse>
    </>
  );
}
