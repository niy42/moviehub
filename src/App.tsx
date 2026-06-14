import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { SearchProvider } from "./contexts/SearchContext";
import { HomePage } from "./pages/HomePage";
import { MovieDetailPage } from "./pages/MovieDetailPage";
import { SearchPage } from "./pages/SearchPage";

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
            </Route>
          </Routes>
        </BrowserRouter>
      </SearchProvider>
    </QueryClientProvider>
  );
}
