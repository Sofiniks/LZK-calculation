import {
  Container, Paper, Stack, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, TableFooter,
  Typography, FormControl, InputLabel, Select, MenuItem, Chip, IconButton, Alert, Snackbar
} from "@mui/material";
import { Delete, Edit, ContentCopy, FileCopy } from "@mui/icons-material";
import { useState } from "react";
import PaintWorkPicker from "./PaintWorkPicker";
import PriceBreakdownModal, { type PriceBreakdown } from "./PriceBreakdownModal";
import CustomAreaModal from "./CustomAreaModal";
import MarksModal, { type MarkItem } from "./MarksModal";
import { AREA_OPTIONS, type AreaKind } from "../types/areas";
import { usePaintCalculator } from "../hooks";
import { calculatePriceBreakdown, formatTableForExcel, copyToClipboard } from "../utils";

export default function PaintCalculator() {
  const {
    areaKind,
    areaTotal,
    work,
    tableRows,
    editingRowIndex,
    sum,
    setAreaKind,
    setAreaTotal,
    setWork,
    addWork,
    clear,
    removeWork,
    startEditWork,
    cancelEdit,
    saveEdit,
    setCustomAreaName,
    getAreaDisplayName,
    customAreaNames,
    setTableRows
  } = usePaintCalculator();

  // Состояние для модального окна детализации цены
  const [breakdownModalOpen, setBreakdownModalOpen] = useState(false);
  const [selectedBreakdown, setSelectedBreakdown] = useState<PriceBreakdown | null>(null);
  const [selectedWorkTitle, setSelectedWorkTitle] = useState('');
  
  // Состояние для уведомления о копировании
  const [copyNotification, setCopyNotification] = useState(false);
  
  // Состояние для модального окна пользовательского раздела
  const [customAreaModalOpen, setCustomAreaModalOpen] = useState(false);
  const [pendingAreaKind, setPendingAreaKind] = useState<AreaKind | null>(null);
  
  // Состояние для модального окна марок
  const [marksModalOpen, setMarksModalOpen] = useState(false);

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

  // Обработчик изменения участка
  const handleAreaChange = (newAreaKind: AreaKind) => {
    if (newAreaKind === "other") {
      setPendingAreaKind(newAreaKind);
      setCustomAreaModalOpen(true);
    } else {
      setAreaKind(newAreaKind);
    }
  };

  // Обработчик сохранения пользовательского раздела
  const handleCustomAreaSave = (customArea: { labelRu: string; labelEn: string }) => {
    if (pendingAreaKind) {
      // Создаем уникальный ключ для кастомной области
      const customKey = `custom_${Date.now()}`;
      setCustomAreaName(customKey, customArea);
      setAreaKind(customKey as any);
    }
    setPendingAreaKind(null);
  };

  // Обработчик добавления марок
  const handleMarksSave = (selectedMarks: MarkItem[], waterlineMeters: number) => {
    // Создаем раздел "Перекраска марок"
    const sectionRow = {
      type: 'section' as const,
      areaKind: 'marks' as any,
      areaTotal: 0,
      labelEn: 'Re-painting of Marks on existing markings for 1 layer',
      labelRu: 'Перекраска марок по существующей разметке за 1 слой',
      isCustom: false
    };

    // Добавляем выбранные марки
    const markRows = selectedMarks.map(mark => {
      const qty = mark.isWaterline ? waterlineMeters : mark.defaultQty;
      const total = mark.price * qty;
      
      return {
        type: 'work' as const,
        data: {
          en: mark.en,
          ru: mark.ru,
          unit: mark.unit as any,
          qty: qty,
          unitPrice: mark.price,
          total: total
        },
        path: `marks.${mark.id}`,
        multipliers: []
      };
    });

    // Добавляем раздел и марки в таблицу
    setTableRows(prev => [...prev, sectionRow, ...markRows]);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Калькулятор: очистка и покраска</Typography>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <FormControl sx={{ minWidth: 280 }}>
              <InputLabel>Участок</InputLabel>
              <Select
                label="Участок"
                value={areaKind}
                onChange={(e) => handleAreaChange(e.target.value as AreaKind)}
              >
                {AREA_OPTIONS.map(a => {
                  const displayName = getAreaDisplayName(a.value);
                  return (
                    <MenuItem key={a.value} value={a.value}>
                      {displayName.labelRu}{a.autoRatios?.length ? <Chip size="small" sx={{ ml: 1 }} label="автокф" /> : null}
                    </MenuItem>
                  );
                })}
                {/* Показываем кастомные области, если они есть */}
                {Object.entries(customAreaNames).map(([key, names]) => (
                  <MenuItem key={`custom_${key}`} value={key}>
                    {names.labelRu}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Общая площадь, м²"
              type="number"
              value={areaTotal}
              onChange={(e) => setAreaTotal(Number(e.target.value))}
              sx={{ width: 200 }}
            />
          </Stack>

          <PaintWorkPicker value={work} onChange={setWork} />

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
                  Добавить работу
                </Button>
                <Button color="error" onClick={clear}>Очистить</Button>
              </>
            )}
          </Stack>

          {/* Отдельный ряд для специальных функций */}
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button 
              variant="outlined" 
              onClick={() => setMarksModalOpen(true)}
            >
              Перекраска марок
            </Button>
            <Button 
              variant="outlined" 
              disabled
            >
              Защита
            </Button>
            <Button 
              variant="outlined" 
              disabled
            >
              Справочник работ
            </Button>
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
              row.type === 'section' ? (
                <TableRow key={i} sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    {row.labelEn}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    {row.labelRu}
                  </TableCell>
                  <TableCell colSpan={5} />
                </TableRow>
              ) : (
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
                  <TableCell align="right">{row.data.qty}</TableCell>
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
              )
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

      {/* Модальное окно детализации цены */}
      <PriceBreakdownModal
        open={breakdownModalOpen}
        onClose={() => setBreakdownModalOpen(false)}
        breakdown={selectedBreakdown}
        workTitle={selectedWorkTitle}
      />

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

      {/* Модальное окно для пользовательского раздела */}
      <CustomAreaModal
        open={customAreaModalOpen}
        onClose={() => {
          setCustomAreaModalOpen(false);
          setPendingAreaKind(null);
        }}
        onSave={handleCustomAreaSave}
      />

      {/* Модальное окно для марок */}
      <MarksModal
        open={marksModalOpen}
        onClose={() => setMarksModalOpen(false)}
        onSave={handleMarksSave}
      />
    </Container>
  );
}
