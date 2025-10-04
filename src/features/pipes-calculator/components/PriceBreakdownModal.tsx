import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Divider
} from "@mui/material";

export interface PriceBreakdown {
  basePrice: number;
  effectiveLength: number;
  flangeCoefficient: number;
  finalPrice: number;
  formula: string;
  elbowPrice?: number;
  elbows?: number;
  multipliers: Array<{
    name: string;
    value: number;
    description: string;
  }>;
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Детализация расчета цены
      </DialogTitle>
      <DialogContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {workTitle}
        </Typography>
        
        <Stack spacing={2}>
          <Typography variant="subtitle1" fontWeight="bold">
            Формула расчета:
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              fontFamily: 'monospace', 
              backgroundColor: '#f5f5f5', 
              padding: 2, 
              borderRadius: 1,
              border: '1px solid #ddd'
            }}
          >
            {breakdown.formula}
          </Typography>
          
          <Divider />
          
          <Typography variant="subtitle1" fontWeight="bold">
            Пошаговый расчет:
          </Typography>
          
          <Stack spacing={1}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography>Базовая цена за 1000мм:</Typography>
                          <Typography fontWeight="bold">{breakdown.basePrice.toFixed(2)} EUR</Typography>
                        </Stack>
            
            {breakdown.elbowPrice && breakdown.elbows && breakdown.elbows > 0 && (
              <Stack direction="row" justifyContent="space-between">
                <Typography>Колена:</Typography>
                <Typography fontWeight="bold">{breakdown.elbowPrice.toFixed(2)} × {breakdown.elbows}</Typography>
              </Stack>
            )}
            
            {breakdown.multipliers.map((multiplier, index) => (
              <Stack key={index} direction="row" justifyContent="space-between">
                <Typography>{multiplier.description}:</Typography>
                <Typography fontWeight="bold">×{multiplier.value.toFixed(2)}</Typography>
              </Stack>
            ))}
          </Stack>
          
          <Divider />
          
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h6">Итоговая цена за штуку:</Typography>
            <Typography variant="h6" fontWeight="bold" color="primary">
              {breakdown.finalPrice.toFixed(2)} EUR
            </Typography>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
}
