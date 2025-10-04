import { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from "@mui/material";
import { PaintCalculator } from "./features/paint-calculator";
import { PipesCalculator } from "./features/pipes-calculator";
import Home from "./pages/Home/Home";

type Page = "paint-calculator" | "pipeline-calculator" | "steel-calculator" | "work-reference" | "home";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  const renderPage = () => {
    switch (currentPage) {
      case "paint-calculator":
        return <PaintCalculator />;
      case "pipeline-calculator":
        return <PipesCalculator />;
      case "steel-calculator":
        return <div>Калькулятор стальных работ (в разработке)</div>;
      case "work-reference":
        return <div>Справочник всех работ (в разработке)</div>;
      case "home":
        return <Home onNavigate={setCurrentPage} />;
      default:
        return <PaintCalculator />;
    }
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="home"
            onClick={() => setCurrentPage("home")}
            sx={{ mr: 2 }}
          >
            <img 
              src="./logo.png" 
              alt="Logo" 
              style={{ 
                height: '48px', 
                width: 'auto',
                filter: 'brightness(0) invert(1)' // Делаем логотип белым
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          </Typography>
          <Button 
            color="inherit" 
            onClick={() => setCurrentPage("paint-calculator")}
            sx={{ mr: 1 }}
          >
            Покраска
          </Button>
          <Button 
            color="inherit" 
            onClick={() => setCurrentPage("pipeline-calculator")}
          >
            Трубы
          </Button>
        </Toolbar>
      </AppBar>
      {renderPage()}
    </Box>
  );
}