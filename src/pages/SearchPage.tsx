import { XIcon } from "@/assets";
import { PremiumSelect } from "@/components/ui/PremiumSelect";
import { useSearch } from "@/contexts/SearchContext";
import {
  useDiscoverMovies,
  useGenres,
  useSearchMovies,
} from "@/hooks/useMovies";
import { useSearchParams } from "react-router-dom";
import { MovieCard } from "../components/movies/MovieCard";
import { MovieCardSkeleton } from "../components/ui/Skeleton";
import { EmptyState, ErrorState } from "../components/ui/States";
import type { Movie } from "../types/movie";
import { getYearOptions } from "../utils/format";

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Highest Rated" },
  { value: "primary_release_date.desc", label: "Newest First" },
  { value: "revenue.desc", label: "Box Office" },
];

const RATING_OPTIONS = [
  { value: "", label: "All Ratings" },
  { value: "9", label: "9+ Stars" },
  { value: "8", label: "8+ Stars" },
  { value: "7", label: "7+ Stars" },
  { value: "6", label: "6+ Stars" },
];

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    movies: globalSearchMovies,
    hasActiveSearch,
    isLoading: globalSearchLoading,
    debouncedQuery,
  } = useSearch();

  const { data: genres } = useGenres();
  const yearOptions = getYearOptions();

  // URL-based filters (still supported)
  const genre = searchParams.get("genre") ?? "";
  const year = searchParams.get("year") ?? "";
  const rating = searchParams.get("rating") ?? "";
  const sortBy = searchParams.get("sort") ?? "popularity.desc";

  const hasFilters = !!(
    genre ||
    year ||
    rating ||
    sortBy !== "popularity.desc"
  );

  // Helper to update URL params
  const updateParams = (updates: Partial<Record<string, string>>) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    if (!newParams.has("sort")) {
      newParams.set("sort", "popularity.desc");
    }

    setSearchParams(newParams, { replace: true });
  };

  const clearFilters = () => {
    const newParams = new URLSearchParams();
    newParams.set("sort", "popularity.desc");
    setSearchParams(newParams, { replace: true });
  };

  // Search vs Discover logic
  const searchResult = useSearchMovies(
    debouncedQuery || "",
    1,
    year || undefined,
  );
  const discoverParams: Record<string, string | number> = {
    sort_by: sortBy,
    ...(genre ? { with_genres: genre } : {}),
    ...(year ? { primary_release_year: year } : {}),
    ...(rating ? { "vote_average.gte": rating } : {}),
    "vote_count.gte": 50,
  };

  const discoverResult = useDiscoverMovies(discoverParams, !hasActiveSearch);

  const activeData = hasActiveSearch ? searchResult : discoverResult;
  //@ts-ignore
  const moviesFromQuery = activeData.data?.results ?? [];
  // Use global search results when searching from header
  const movies: Movie[] = hasActiveSearch
    ? globalSearchMovies
    : moviesFromQuery;

  const totalResults = hasActiveSearch
    ? globalSearchMovies.length
    : //@ts-ignore
      (activeData.data?.total_results ?? 0);

  const isLoading = hasActiveSearch
    ? globalSearchLoading
    : activeData.isLoading;

  // Client-side filtering when using global search + filters
  const filteredMovies = hasActiveSearch
    ? movies.filter((m) => {
        if (genre && !m.genre_ids.includes(Number(genre))) return false;
        if (rating && m.vote_average < Number(rating)) return false;
        return true;
      })
    : movies;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-6">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2.5 pt-6">
        <PremiumSelect
          value={genre}
          onChange={(val) => updateParams({ genre: val })}
          options={[
            { value: "", label: "All Genres" },
            ...(genres?.map((g) => ({ value: String(g.id), label: g.name })) ||
              []),
          ]}
        />
        <PremiumSelect
          value={year}
          onChange={(val) => updateParams({ year: val })}
          options={[
            { value: "", label: "All Years" },
            ...(yearOptions.map((y) => ({
              value: String(y),
              label: String(y),
            })) || []),
          ]}
        />
        <PremiumSelect
          value={rating}
          onChange={(val) => updateParams({ rating: val })}
          options={[
            ...(RATING_OPTIONS?.map((r) => ({
              value: String(r.value),
              label: r.label,
            })) || []),
          ]}
        />
        <PremiumSelect
          value={sortBy}
          onChange={(val) => updateParams({ sort: val })}
          options={[
            ...(SORT_OPTIONS?.map((s) => ({
              value: String(s.value),
              label: s.label,
            })) || []),
          ]}
        />

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-2.5 text-accent-red hover:text-red-300 text-xs font-semibold transition-colors rounded-xl border border-surface-border hover:border-accent-red/30"
          >
            <XIcon className="w-3 h-3" />
            Clear Filters
          </button>
        )}
      </div>

      {/* Results meta */}
      {!isLoading && (
        <div className="flex items-center justify-between py-1">
          <p className="text-text-primary font-semibold text-sm">
            {hasActiveSearch ? (
              <>
                Results for{" "}
                <span className="text-brand-primary">"{debouncedQuery}"</span>
              </>
            ) : (
              "Browse Movies"
            )}
          </p>
          {totalResults > 0 && (
            <span className="text-text-muted text-xs tabular-nums">
              {totalResults.toLocaleString()} titles
            </span>
          )}
        </div>
      )}

      {/* Grid */}
      {activeData.isError ? (
        <ErrorState message="Failed to load movies. Check your API key or try again." />
      ) : isLoading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredMovies.length === 0 ? (
        <EmptyState
          title={
            hasActiveSearch
              ? `No results for "${debouncedQuery}"`
              : "No movies found"
          }
          description="Try adjusting your filters or search for something else."
        />
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
