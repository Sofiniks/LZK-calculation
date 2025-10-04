import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  TextField,
  Stack,
  Typography
} from "@mui/material";
import { useState } from "react";

export interface MarkItem {
  id: string;
  en: string;
  ru: string;
  unit: string;
  price: number;
  defaultQty: number;
  isWaterline?: boolean;
}

interface MarksModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (selectedMarks: MarkItem[], waterlineMeters: number) => void;
}

const MARKS_DATA: MarkItem[] = [
  { id: "vessel_name", en: "- Vessel's names", ru: "- Название судна", unit: "set", price: 560, defaultQty: 1 },
  { id: "port_registry", en: "- Port of Registry.", ru: "- Порт приписки", unit: "set", price: 120, defaultQty: 1 },
  { id: "draft_marks", en: "- 'Draft marks,", ru: "- Марки осадки,", unit: "set", price: 690, defaultQty: 1 },
  { id: "plimsoll_disc", en: "- Plimsoll disc.", ru: "- Отметка Плимсоля", unit: "set", price: 200, defaultQty: 1 },
  { id: "bow_thruster", en: "- Bow Thruster marks.", ru: "- Марки подруливающего устройства", unit: "set", price: 90, defaultQty: 1 },
  { id: "bulbous_mark", en: "- Boulbous mark", ru: "- Марки бульбовой части", unit: "set", price: 90, defaultQty: 1 },
  { id: "imo_number", en: "- IMO number.", ru: "- ИМО номер", unit: "set", price: 120, defaultQty: 1 },
  { id: "waterline", en: "- Waterline, per meter.", ru: "- Ватерлиния, за метр.", unit: "run.m", price: 3.10, defaultQty: 280, isWaterline: true }
];

export default function MarksModal({ open, onClose, onSave }: MarksModalProps) {
  // По умолчанию все марки выбраны
  const [selectedMarks, setSelectedMarks] = useState<Set<string>>(new Set(MARKS_DATA.map(mark => mark.id)));
  const [waterlineMeters, setWaterlineMeters] = useState(280);

  const handleMarkToggle = (markId: string) => {
    const newSelected = new Set(selectedMarks);
    if (newSelected.has(markId)) {
      newSelected.delete(markId);
    } else {
      newSelected.add(markId);
    }
    setSelectedMarks(newSelected);
  };

  const handleSave = () => {
    const marksToAdd = MARKS_DATA.filter(mark => selectedMarks.has(mark.id));
    onSave(marksToAdd, waterlineMeters);
    onClose();
  };

  const handleClose = () => {
    setSelectedMarks(new Set(MARKS_DATA.map(mark => mark.id)));
    setWaterlineMeters(280);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Перекраска марок по существующей разметке за 1 слой
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          Re-painting of Marks on existing markings for 1 layer
        </Typography>
        
        <Stack spacing={2}>
          {MARKS_DATA.map((mark) => (
            <Stack key={mark.id} direction="row" alignItems="center" spacing={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedMarks.has(mark.id)}
                    onChange={() => handleMarkToggle(mark.id)}
                  />
                }
                label=""
                sx={{ minWidth: 40 }}
              />
              <Typography sx={{ flexGrow: 1, minWidth: 200 }}>
                {mark.en}
              </Typography>
              <Typography sx={{ flexGrow: 1, minWidth: 200 }}>
                {mark.ru}
              </Typography>
              <Typography sx={{ minWidth: 60, textAlign: 'center' }}>
                {mark.unit}
              </Typography>
              <Typography sx={{ minWidth: 60, textAlign: 'center' }}>
                {mark.defaultQty}
              </Typography>
              <Typography sx={{ minWidth: 80, textAlign: 'right' }}>
                {mark.price.toFixed(2)}
              </Typography>
              <Typography sx={{ minWidth: 80, textAlign: 'right' }}>
                {(mark.price * mark.defaultQty).toFixed(2)}
              </Typography>
            </Stack>
          ))}
        </Stack>

        <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography sx={{ minWidth: 200 }}>
            Количество ватерлинии (метры):
          </Typography>
          <TextField
            type="number"
            value={waterlineMeters}
            onChange={(e) => setWaterlineMeters(Number(e.target.value))}
            size="small"
            sx={{ width: 120 }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Отмена</Button>
        <Button 
          variant="contained" 
          onClick={handleSave}
          disabled={selectedMarks.size === 0}
        >
          Добавить выбранные марки
        </Button>
      </DialogActions>
    </Dialog>
  );
}
