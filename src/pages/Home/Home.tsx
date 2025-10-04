import { Container, Typography, Button, Card, CardContent, Grid } from "@mui/material";
import { Brush, Settings, Build, MenuBook } from "@mui/icons-material";

type Page = "paint-calculator" | "pipeline-calculator" | "steel-calculator" | "work-reference" | "home";

interface HomeProps {
  onNavigate?: (page: Page) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        Добро пожаловать в систему калькуляторов!
      </Typography>
      
      <Typography variant="h6" sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}>
        Выберите нужный калькулятор для работы
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, alignItems: 'center' }}>
              <Brush sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 2 }}>
                Калькулятор покраски
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                Расчет стоимости работ по очистке и покраске судов с учетом всех коэффициентов
              </Typography>
              <Button 
                variant="contained" 
                fullWidth
                onClick={() => onNavigate?.("paint-calculator")}
              >
                Открыть калькулятор
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, alignItems: 'center' }}>
              <Build sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 2 }}>
                Калькулятор трубопроводных работ
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                Расчет стоимости труб по диаметру, типу и длине с учетом минимальной длины
              </Typography>
              <Button 
                variant="contained" 
                fullWidth
                onClick={() => onNavigate?.("pipeline-calculator")}
              >
                Открыть калькулятор
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', textAlign: 'center', opacity: 0.6, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, alignItems: 'center' }}>
              <Construction sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 2 }}>
                Калькулятор стальных работ
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                Расчет стоимости работ по изготовлению и ремонту стальных конструкций (в разработке)
              </Typography>
              <Button variant="outlined" fullWidth disabled>
                Скоро будет доступно
              </Button>
            </CardContent>
          </Card>
        </Grid> */}

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', textAlign: 'center', opacity: 0.6, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, alignItems: 'center' }}>
              <MenuBook sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 2 }}>
                Справочник всех работ
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                Полный каталог всех видов работ с описаниями и ценами (в разработке)
              </Typography>
              <Button variant="outlined" fullWidth disabled>
                Скоро будет доступно
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', textAlign: 'center', opacity: 0.6, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, alignItems: 'center' }}>
              <Settings sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 2 }}>
                Администрирование
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                Управление прайс-листами и настройками (в разработке)
              </Typography>
              <Button variant="outlined" fullWidth disabled>
                Скоро будет доступно
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
