import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Chip
} from '@mui/material';
import { Close } from '@mui/icons-material';

export interface PriceBreakdown {
  basePrice: number;
  multipliers: Array<{
    name: string;
    value: number;
    description: string;
  }>;
  finalPrice: number;
  quantity: number;
  total: number;
}

interface PriceBreakdownModalProps {
  open: boolean;
  onClose: () => void;
  breakdown: PriceBreakdown | null;
  workTitle: string;
}

export default function PriceBreakdownModal({ 
  open, 
  onClose, 
  breakdown, 
  workTitle 
}: PriceBreakdownModalProps) {
  if (!breakdown) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Детализация цены
          </Typography>
          <Button
            onClick={onClose}
            sx={{ minWidth: 'auto', p: 1 }}
          >
            <Close />
          </Button>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
          {workTitle}
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Базовая цена:
          </Typography>
          <Typography variant="h6" color="primary">
            {breakdown.basePrice.toFixed(2)} €
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Применяемые коэффициенты:
        </Typography>
        
        {breakdown.multipliers.map((multiplier, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Chip 
                label={`×${multiplier.value}`}
                color="primary"
                size="small"
              />
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {multiplier.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {multiplier.description}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Итоговая цена за единицу:
          </Typography>
          <Typography variant="h6" color="primary">
            {breakdown.finalPrice.toFixed(2)} €
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Количество:
          </Typography>
          <Typography variant="h6">
            {breakdown.quantity} м²
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Общая стоимость:
          </Typography>
          <Typography variant="h5" color="primary" fontWeight="bold">
            {breakdown.total.toFixed(2)} €
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
}
