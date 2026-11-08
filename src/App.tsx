import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { SearchProvider } from "./contexts/SearchContext";
import { HomePage } from "./pages/HomePage";
import { MovieDetailPage } from "./pages/MovieDetailPage";
import { SearchPage } from "./pages/SearchPage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { WatchlistsPage } from "./pages/WatchlistsPage";
import { AIDiscoveryPage } from "./pages/AIDiscoveryPage";
import { WatchlistDetailPage } from "./pages/WatchlistDetailPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SearchProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/movie/:id" element={<MovieDetailPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/watchlists" element={<WatchlistsPage />} />
              <Route path="/watchlists/:id" element={<WatchlistDetailPage />} />
              <Route path="/ai-discovery" element={<AIDiscoveryPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SearchProvider>
    </QueryClientProvider>
  );
}
