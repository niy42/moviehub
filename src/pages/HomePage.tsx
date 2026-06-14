import { useSearch } from "@/contexts/SearchContext";
import { useNowPlaying, usePopular, useTopRated } from "@/hooks/useMovies";
import { MovieSection } from "../components/movies/MovieSection";

export function HomePage() {
  const nowPlaying = useNowPlaying();
  const popular = usePopular();
  const topRated = useTopRated();

  const {
    movies: searchMovies,
    hasActiveSearch,
    isLoading: searchLoading,
    debouncedQuery,
    totalResults,
  } = useSearch();

  // Search Results View
  if (hasActiveSearch) {
    return (
      <div className="flex flex-col gap-8 md:gap-12 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="pt-6 md:pt-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-text-primary mb-2">
            Results for "{debouncedQuery}"
          </h1>
          {totalResults > 0 && (
            <p className="text-text-secondary text-sm md:text-base">
              {totalResults.toLocaleString()} movies found
            </p>
          )}
        </div>

        <MovieSection
          title="Search Results"
          movies={searchMovies}
          isLoading={searchLoading}
          isError={false}
          limit={undefined}
          viewAllPath={undefined}
        />
      </div>
    );
  }

  // Normal Homepage
  return (
    <div className="flex flex-col gap-8 md:gap-12 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Hero Section - Fully Responsive */}
      <div
        className="relative overflow-hidden rounded-2xl md:rounded-3xl px-6 py-8 md:px-8 md:py-10 border border-surface-border bg-surface-card"
        style={{
          background:
            "linear-gradient(135deg, var(--color-card) 0%, var(--color-elevated) 60%, rgba(99,102,241,0.08) 100%)",
        }}
      >
        {/* Ambient orbs - smaller on mobile */}
        <div className="absolute -top-12 -right-12 w-40 h-40 md:w-56 md:h-56 bg-brand-primary opacity-10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 left-6 w-32 h-32 md:w-48 md:h-48 bg-accent-red opacity-5 rounded-full blur-3xl pointer-events-none" />

        <p className="text-brand-primary text-xs font-semibold uppercase tracking-widest mb-3">
          Welcome back
        </p>

        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-text-primary leading-tight mb-3">
          Discover Movies
        </h1>

        <p className="text-text-secondary text-sm md:text-base max-w-md leading-relaxed">
          Find and explore your next favorite movie across every genre, era, and
          language.
        </p>
      </div>

      {/* Movie Sections */}
      <MovieSection
        title="Now Playing"
        //@ts-ignore
        movies={nowPlaying.data?.results}
        isLoading={nowPlaying.isLoading}
        isError={nowPlaying.isError}
        viewAllPath="/search?sort=now_playing"
        limit={6}
      />

      <MovieSection
        title="Popular Movies"
        //@ts-ignore
        movies={popular.data?.results}
        isLoading={popular.isLoading}
        isError={popular.isError}
        viewAllPath="/search?sort=popularity.desc"
        limit={6}
      />

      <MovieSection
        title="Top Rated"
        //@ts-ignore
        movies={topRated.data?.results}
        isLoading={topRated.isLoading}
        isError={topRated.isError}
        viewAllPath="/search?sort=vote_average.desc"
        limit={6}
      />
    </div>
  );
}
