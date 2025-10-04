import {
  Container, Paper, Stack, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, TableFooter,
  Typography, FormControl, InputLabel, Select, MenuItem, IconButton, Alert, Snackbar
} from "@mui/material";
import { Delete, Edit, ContentCopy, FileCopy } from "@mui/icons-material";
import { useState } from "react";
import { usePipesCalculator } from "../hooks";
import { formatTableForExcel, copyToClipboard, calculatePriceBreakdown } from "../utils";
import PriceBreakdownModal, { type PriceBreakdown } from "./PriceBreakdownModal";
import PipeCoefficientsPicker from "./PipeCoefficientsPicker";

export default function PipesCalculator() {
  const {
    pipeType,
    diameter,
    length,
    quantity,
    flanges,
    elbows,
    coefficients,
    tableRows,
    editingRowIndex,
    sum,
    availableDiameters,
    setPipeType,
    setDiameter,
    setLength,
    setQuantity,
    setFlanges,
    setElbows,
    setCoefficients,
    addWork,
    clear,
    removeWork,
    startEditWork,
    cancelEdit,
    saveEdit
  } = usePipesCalculator();

  // Состояние для уведомления о копировании
  const [copyNotification, setCopyNotification] = useState(false);
  
  // Состояние для модального окна детализации цены
  const [breakdownModalOpen, setBreakdownModalOpen] = useState(false);
  const [selectedBreakdown, setSelectedBreakdown] = useState<PriceBreakdown | null>(null);
  const [selectedWorkTitle, setSelectedWorkTitle] = useState('');

  // Обработчик клика на строку для показа детализации цены
  const handleRowClick = (row: any) => {
    if (row.type === 'work' && row.data) {
      try {
        const breakdown = calculatePriceBreakdown(row);
        setSelectedBreakdown(breakdown);
        setSelectedWorkTitle(`${row.data.en} / ${row.data.ru}`);
        setBreakdownModalOpen(true);
      } catch (error) {
        console.error('Error calculating breakdown:', error);
      }
    }
  };

  // Обработчик копирования в Excel
  const handleCopyToExcel = async () => {
    if (tableRows.length === 0) return;
    
    const excelData = formatTableForExcel(tableRows);
    const success = await copyToClipboard(excelData);
    
    if (success) {
      setCopyNotification(true);
      setTimeout(() => setCopyNotification(false), 2000);
    }
  };

  // Обработчик копирования отдельной строки
  const handleCopyRow = async (row: any) => {
    if (row.type === 'work' && row.data) {
      // Добавляем пробел перед тире, чтобы Excel не воспринимал это как формулу
      const formatForExcel = (text: string) => text.startsWith('-') ? ` -${text.substring(1)}` : text;
      
      const rowData = `${formatForExcel(row.data.en)}\t${formatForExcel(row.data.ru)}\t${row.data.unit}\t${row.data.qty}\t${row.data.unitPrice.toFixed(2).replace('.', ',')}\t`;
      const success = await copyToClipboard(rowData);
      
      if (success) {
        setCopyNotification(true);
        setTimeout(() => setCopyNotification(false), 2000);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Калькулятор трубопроводных работ</Typography>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Тип трубы</InputLabel>
              <Select
                label="Тип трубы"
                value={pipeType}
                onChange={(e) => setPipeType(e.target.value as any)}
              >
                <MenuItem value="black">Черная труба</MenuItem>
                <MenuItem value="galvanized">Оцинкованная труба</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Диаметр (DN)</InputLabel>
              <Select
                label="Диаметр (DN)"
                value={diameter}
                onChange={(e) => setDiameter(Number(e.target.value))}
              >
                {availableDiameters.map(dn => (
                  <MenuItem key={dn} value={dn}>
                    DN{dn}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Длина, м"
              type="number"
              value={length / 1000}
              onChange={(e) => setLength(Number(e.target.value) * 1000)}
              sx={{ width: 120 }}
              inputProps={{ min: 0, step: 0.1 }}
            />

            <TextField
              label="Количество, шт"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              sx={{ width: 120 }}
              inputProps={{ min: 1 }}
            />

            <TextField
              label="Фланцы, шт"
              type="number"
              value={flanges}
              onChange={(e) => setFlanges(Number(e.target.value))}
              sx={{ width: 120 }}
              inputProps={{ min: 0 }}
            />

            <TextField
              label="Колена, шт"
              type="number"
              value={elbows}
              onChange={(e) => setElbows(Number(e.target.value))}
              sx={{ width: 120 }}
              inputProps={{ min: 0 }}
            />
          </Stack>
          
          <PipeCoefficientsPicker
            value={coefficients}
            onChange={setCoefficients}
          />

          <Stack direction="row" spacing={1}>
            {editingRowIndex !== null ? (
              <>
                <Button variant="contained" onClick={saveEdit}>
                  Сохранить изменения
                </Button>
                <Button onClick={cancelEdit}>Отмена</Button>
              </>
            ) : (
              <>
                <Button variant="contained" onClick={addWork}>
                  Добавить трубу
                </Button>
                <Button color="error" onClick={clear}>Очистить</Button>
              </>
            )}
          </Stack>
        </Stack>
      </Paper>

      {tableRows.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Table size="small" sx={{ 
            fontFamily: 'Arial, sans-serif !important',
            fontSize: '15px !important',
            '& *': {
              fontFamily: 'Arial, sans-serif !important',
              fontSize: '15px !important'
            }
          }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>Jobs' description</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>Описание работ</TableCell>
              <TableCell align="right" sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>Unit</TableCell>
              <TableCell align="right" sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>Q-ty</TableCell>
              <TableCell align="right" sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>Price / unit</TableCell>
              <TableCell align="right" sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>Total, EUR</TableCell>
              <TableCell width={120}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRows.map((row, i) => (
              <TableRow 
                key={i}
                onClick={() => handleRowClick(row)}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#f0f0f0' }
                }}
              >
                <TableCell>{row.data.en}</TableCell>
                <TableCell>{row.data.ru}</TableCell>
                <TableCell align="right">{row.data.unit}</TableCell>
                <TableCell align="right">{Math.round(row.data.qty)}</TableCell>
                <TableCell align="right">{row.data.unitPrice.toFixed(2)}</TableCell>
                <TableCell align="right">{row.data.total.toFixed(2)}</TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={0.5} justifyContent="center">
                    <IconButton 
                      size="small" 
                      color="primary" 
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditWork(i);
                      }}
                      title="Редактировать работу"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeWork(i);
                      }}
                      title="Удалить работу"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      sx={{ color: '#2e7d32' }} 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyRow(row);
                      }}
                      title="Копировать строку в Excel"
                    >
                      <FileCopy fontSize="small" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5} />
              <TableCell align="right"><strong>Итого</strong></TableCell>
              <TableCell align="right"><strong>{sum.toFixed(2)}</strong></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        
        {/* Кнопка копирования в Excel */}
        {tableRows.length > 0 && (
          <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ContentCopy />}
              onClick={handleCopyToExcel}
              disabled={tableRows.length === 0}
            >
              Копировать в Excel
            </Button>
          </Stack>
        )}
        </Paper>
      )}

      {/* Уведомление о копировании */}
      <Snackbar
        open={copyNotification}
        autoHideDuration={2000}
        onClose={() => setCopyNotification(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setCopyNotification(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Данные скопированы в буфер обмена! 
        </Alert>
      </Snackbar>

      {/* Модальное окно детализации цены */}
      <PriceBreakdownModal
        open={breakdownModalOpen}
        onClose={() => setBreakdownModalOpen(false)}
        breakdown={selectedBreakdown}
        workTitle={selectedWorkTitle}
      />
    </Container>
  );
}
