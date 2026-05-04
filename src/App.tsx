import { TooltipProvider } from "./components/ui/tooltip";
import Router from "./components/Router";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { Toaster } from "./components/ui/sonner";
import "@fontsource-variable/roboto/index.css";

const App = () => {
  return (
    <TooltipProvider>
      <ThemeProvider>
        <Router />
        <Toaster position="bottom-left" />
      </ThemeProvider>
    </TooltipProvider>
  );
};

export default App;
