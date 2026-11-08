import { useDebounce } from "@/hooks/useDebounce";
import { useSearchMovies } from "@/hooks/useMovies";

import type { Movie } from "@/types/movie";
import { createContext, type ReactNode, useContext, useState } from "react";

type SearchContextType = {
  inputValue: string;
  setInputValue: (value: string) => void;
  debouncedQuery: string;
  movies: Movie[];
  isLoading: boolean;
  totalResults: number;
  clearSearch: () => void;
  hasActiveSearch: boolean;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [inputValue, setInputValue] = useState("");
  const debouncedQuery = useDebounce(inputValue, 400);

  const { data, isLoading } = useSearchMovies(debouncedQuery, 1);

  //@ts-ignore
  const movies = data?.results ?? [];
  //@ts-ignore
  const totalResults = data?.total_results ?? 0;
  const hasActiveSearch = debouncedQuery.trim().length > 0;

  const clearSearch = () => {
    setInputValue("");
  };

  return (
    <SearchContext.Provider
      value={{
        inputValue,
        setInputValue,
        debouncedQuery,
        movies,
        isLoading,
        totalResults,
        clearSearch,
        hasActiveSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within SearchProvider");
  }
  return context;
};
