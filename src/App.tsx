
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AnimePage from "./pages/AnimePage";
import WatchPage from "./pages/WatchPage";
import SearchPage from "./pages/SearchPage";
import AnimeListPage from "./pages/AnimeListPage";
import SeasonalAnimePage from "./pages/SeasonalAnimePage";
import CategoryPage from "./pages/CategoryPage";
import LegalPage from "./pages/LegalPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/anime" element={<AnimeListPage />} />
          <Route path="/anime/:id" element={<AnimePage />} />
          <Route path="/watch/:id/:episode" element={<WatchPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/seasonal" element={<SeasonalAnimePage />} />
          <Route path="/genre/:category" element={<CategoryPage />} />
          <Route path="/:page" element={<LegalPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
