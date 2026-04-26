import { TooltipProvider } from "./components/ui/tooltip";
import Router from "./components/Router";
import { ThemeProvider } from "./contexts/ThemeProvider";
import "@fontsource-variable/roboto/index.css";

const App = () => {
  return (
    <TooltipProvider>
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    </TooltipProvider>
  );
};

export default App;
