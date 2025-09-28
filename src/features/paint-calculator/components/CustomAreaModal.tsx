import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack
} from '@mui/material';

interface CustomAreaModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (customArea: { labelRu: string; labelEn: string }) => void;
}

export default function CustomAreaModal({ open, onClose, onSave }: CustomAreaModalProps) {
  const [labelRu, setLabelRu] = useState('');
  const [labelEn, setLabelEn] = useState('');

  // Сброс полей при открытии модального окна
  useEffect(() => {
    if (open) {
      setLabelRu('');
      setLabelEn('');
    }
  }, [open]);

  const handleSave = () => {
    if (labelRu.trim() && labelEn.trim()) {
      onSave({ labelRu: labelRu.trim(), labelEn: labelEn.trim() });
      onClose();
    }
  };

  const handleCancel = () => {
    setLabelRu('');
    setLabelEn('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Введите название раздела</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Название на русском"
            value={labelRu}
            onChange={(e) => setLabelRu(e.target.value)}
            fullWidth
            required
            placeholder="Например: Камбуз"
          />
          <TextField
            label="Название на английском"
            value={labelEn}
            onChange={(e) => setLabelEn(e.target.value)}
            fullWidth
            required
            placeholder="For example: Galley"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Отмена</Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={!labelRu.trim() || !labelEn.trim()}
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
}
