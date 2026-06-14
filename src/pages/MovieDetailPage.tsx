import { BackIcon, FavouriteIcon, RatingIcon } from "@/assets";
import type { MovieDetail } from "@/types/movie";
import { useNavigate, useParams } from "react-router-dom";
import { getBackdropUrl, getPosterUrl } from "../api/client";
import { MovieCard } from "../components/movies/MovieCard";
import { Skeleton } from "../components/ui/Skeleton";
import { ErrorState } from "../components/ui/States";
import { useMovieDetail, useSimilarMovies } from "../hooks/useMovies";
import {
  formatCurrency,
  formatDate,
  formatRuntime,
  formatYear,
} from "../utils/format";

export function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movieId = Number(id);

  const {
    data: movie,
    isLoading,
    isError,
  } = useMovieDetail(movieId) as {
    data: MovieDetail | undefined;
    isLoading: boolean;
    isError: boolean;
  };
  console.log("Movie Detail:", movie);
  const { data: similar } = useSimilarMovies(movieId) as {
    data: { results: MovieDetail[] } | undefined;
  };

  if (isError) return <ErrorState message="Failed to load movie details." />;

  const backdropUrl = movie
    ? getBackdropUrl(movie?.backdrop_path ?? null)
    : null;
  const director = movie?.credits?.crew.find((c) => c.job === "Director");
  const topCast = movie?.credits?.cast
    ?.slice(0, 4)
    ?.map((c) => c.name)
    ?.join(", ");

  return (
    <div className="max-w-5xl flex flex-col gap-8 px-4 sm:px-0">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm font-medium transition-colors w-fit group"
      >
        <BackIcon />
        Back
      </button>

      {/* Hero row — stacks vertically on mobile */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Poster */}
        <div className="shrink-0 w-full md:w-52">
          {isLoading ? (
            <Skeleton className="w-full md:w-52 aspect-[2/3] rounded-2xl" />
          ) : (
            <img
              src={getPosterUrl(movie?.poster_path ?? null, "w500")}
              alt={movie?.title}
              className="w-full md:w-52 aspect-[2/3] object-cover rounded-2xl shadow-poster"
            />
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5 flex-1 min-w-0">
          {isLoading ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-9 w-3/4 rounded-xl" />
              <Skeleton className="h-4 w-1/3 rounded-lg" />
              <Skeleton className="h-4 w-1/2 rounded-lg" />
            </div>
          ) : (
            <>
              <div>
                <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-text-primary leading-tight">
                  {movie?.title}
                </h1>
                <div className="flex items-center gap-2.5 mt-2 text-text-muted text-sm flex-wrap">
                  <span>{formatYear(movie?.release_date ?? "")}</span>
                  {movie?.runtime ? (
                    <>
                      <span className="w-1 h-1 rounded-full bg-text-muted inline-block" />
                      <span>{formatRuntime(movie.runtime)}</span>
                    </>
                  ) : null}
                </div>
              </div>

              {/* Rating + CTA — wraps on small screens */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 rounded-xl px-3 py-2 border border-surface-border bg-surface-elevated">
                  <RatingIcon />
                  <span className="text-text-primary font-bold text-xl tabular-nums">
                    {movie?.vote_average.toFixed(1)}
                  </span>
                  <span className="text-text-muted text-xs">
                    ({movie?.vote_count.toLocaleString()})
                  </span>
                </div>

                <button
                  className="flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:opacity-90 active:scale-95 whitespace-nowrap"
                  style={{
                    background: "linear-gradient(135deg, #6366F1, #4F46E5)",
                    boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
                  }}
                >
                  <FavouriteIcon className="w-4 h-4" />
                  Add to Favorites
                </button>
              </div>

              {/* Overview */}
              <div>
                <h3 className="text-text-primary font-semibold text-sm mb-2">
                  Overview
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {movie?.overview}
                </p>
              </div>

              {/* Genres */}
              {movie?.genres?.length ? (
                <div>
                  <h3 className="text-text-primary font-semibold text-sm mb-2">
                    Genres
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((g) => (
                      <span
                        key={g.id}
                        className="px-3 py-1 text-text-secondary text-xs rounded-full border border-surface-border bg-surface-elevated hover:border-brand-primary hover:text-brand-primary transition-colors cursor-default"
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Metadata grid — 1 col on mobile, 2 on desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm border-t border-surface-border pt-5">
                {[
                  {
                    label: "Release Date",
                    value: formatDate(movie?.release_date ?? ""),
                  },
                  { label: "Director", value: director?.name ?? "—" },
                  { label: "Cast", value: topCast ?? "—" },
                  {
                    label: "Language",
                    value: movie?.spoken_languages?.[0]?.name ?? "—",
                  },
                  {
                    label: "Budget",
                    value: formatCurrency(movie?.budget ?? 0),
                  },
                  {
                    label: "Revenue",
                    value: formatCurrency(movie?.revenue ?? 0),
                  },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-text-muted text-[10px] uppercase tracking-widest font-medium mb-0.5">
                      {label}
                    </p>
                    <p className="text-text-secondary text-sm">{value}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Backdrop */}
      {backdropUrl && (
        <div className="rounded-2xl sm:rounded-3xl overflow-hidden aspect-video w-full shadow-poster border border-surface-border">
          <img
            src={backdropUrl}
            alt={movie?.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Similar */}
      {similar?.results?.length ? (
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div
              className="w-1 h-5 rounded-full"
              style={{
                background: "linear-gradient(180deg, #6366F1, #4F46E5)",
              }}
            />
            <h2 className="text-text-primary font-semibold">Similar Movies</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {similar.results.slice(0, 5).map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
