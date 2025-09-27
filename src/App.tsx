import { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { PaintCalculator } from "./features/paint-calculator";
import Home from "./pages/Home/Home";

type Page = "paint-calculator" | "pipeline-calculator" | "home";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  const renderPage = () => {
    switch (currentPage) {
      case "paint-calculator":
        return <PaintCalculator />;
      case "pipeline-calculator":
        return <div>Калькулятор трубопроводных работ (в разработке)</div>;
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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Калькуляторы
          </Typography>
          <Button 
            color="inherit" 
            onClick={() => setCurrentPage("home")}
          >
            Главная
          </Button>
          <Button 
            color="inherit" 
            onClick={() => setCurrentPage("paint-calculator")}
          >
            Покраска
          </Button>
        </Toolbar>
      </AppBar>
      {renderPage()}
    </Box>
  );
}