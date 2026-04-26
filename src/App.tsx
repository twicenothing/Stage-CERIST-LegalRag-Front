import { TooltipProvider } from "./components/ui/tooltip";
import Router from "./components/Router";
import { ThemeProvider } from "./contexts/ThemeProvider";
import "@fontsource-variable/domine";
import "@fontsource-variable/figtree";

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
