import {
  Stack, Button, Collapse, FormControlLabel, Checkbox, Chip
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { useState } from "react";
import type { PipeCoefficients } from "../types";
import { COEFFICIENT_VALUES, COEFFICIENT_DESCRIPTIONS } from "../utils";

interface PipeCoefficientsPickerProps {
  value: PipeCoefficients;
  onChange: (coefficients: PipeCoefficients) => void;
}

export default function PipeCoefficientsPicker({ value, onChange }: PipeCoefficientsPickerProps) {
  const [expanded, setExpanded] = useState(false);

  const handleCoefficientChange = (key: keyof PipeCoefficients) => {
    onChange({
      ...value,
      [key]: !value[key]
    });
  };

  return (
    <Stack spacing={1}>
      <Button
        variant="outlined"
        onClick={() => setExpanded(!expanded)}
        endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
        sx={{ 
          width: 'fit-content',
          justifyContent: 'space-between'
        }}
      >
        Коэффициенты
        {Object.values(value).some(Boolean) && (
          <Chip 
            size="small" 
            label={`×${Object.entries(value).reduce((acc, [key, isActive]) => 
              isActive ? acc * COEFFICIENT_VALUES[key as keyof PipeCoefficients] : acc, 1
            ).toFixed(2)}`}
            color="primary"
            sx={{ ml: 1 }}
          />
        )}
      </Button>
      
      <Collapse in={expanded}>
        <Stack 
          direction="row" 
          spacing={2} 
          sx={{ 
            pl: 2, 
            flexWrap: 'wrap',
            gap: 1
          }}
        >
          {Object.entries(COEFFICIENT_DESCRIPTIONS).map(([key, description]) => (
            <FormControlLabel
              key={key}
              control={
                <Checkbox
                  checked={value[key as keyof PipeCoefficients]}
                  onChange={() => handleCoefficientChange(key as keyof PipeCoefficients)}
                />
              }
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <span>{description}</span>
                  <Chip 
                    size="small" 
                    label={`×${COEFFICIENT_VALUES[key as keyof PipeCoefficients]}`}
                    color="primary"
                    variant="outlined"
                  />
                </Stack>
              }
            />
          ))}
        </Stack>
      </Collapse>
    </Stack>
  );
}
