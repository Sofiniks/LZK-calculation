import {
  Container, Paper, Stack, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, TableFooter,
  Typography, FormControl, InputLabel, Select, MenuItem, Chip, IconButton
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import PaintWorkPicker from "./PaintWorkPicker";
import { AREA_OPTIONS, type AreaKind } from "../types/areas";
import { usePaintCalculator } from "../hooks";

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
    saveEdit
  } = usePaintCalculator();

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
                onChange={(e) => setAreaKind(e.target.value as AreaKind)}
              >
                {AREA_OPTIONS.map(a => (
                  <MenuItem key={a.value} value={a.value}>
                    {a.labelRu}{a.autoRatios?.length ? <Chip size="small" sx={{ ml: 1 }} label="автокф" /> : null}
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
        </Stack>
      </Paper>

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
              <TableCell width={100}></TableCell>
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
                <TableRow key={i}>
                  <TableCell>{row.data.en}</TableCell>
                  <TableCell>{row.data.ru}</TableCell>
                  <TableCell align="right">{row.data.unit}</TableCell>
                  <TableCell align="right">{row.data.qty}</TableCell>
                  <TableCell align="right">{row.data.unitPrice.toFixed(2)}</TableCell>
                  <TableCell align="right">{row.data.total.toFixed(2)}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5}>
                      <IconButton 
                        size="small" 
                        color="primary" 
                        onClick={() => startEditWork(i)}
                        title="Редактировать работу"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => removeWork(i)}
                        title="Удалить работу"
                      >
                        <Delete fontSize="small" />
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
      </Paper>
    </Container>
  );
}
