import { Link } from "react-router-dom";
import type { Movie } from "../../types/movie";
import { MovieCardSkeleton } from "../ui/Skeleton";
import { ErrorState } from "../ui/States";
import { MovieCard } from "./MovieCard";

interface MovieSectionProps {
  title: string;
  movies: Movie[] | undefined;
  isLoading: boolean;
  isError: boolean;
  viewAllPath?: string;
  limit?: number;
}

export function MovieSection({
  title,
  movies,
  isLoading,
  isError,
  viewAllPath,
  limit = 6,
}: MovieSectionProps) {
  return (
    <section className="flex flex-col gap-5">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <div
            className="w-1 h-5 rounded-full"
            style={{ background: "linear-gradient(180deg, #6366F1, #4F46E5)" }}
          />
          <h2 className="text-text-primary font-semibold text-lg md:text-xl tracking-tight">
            {title}
          </h2>
        </div>

        {viewAllPath && (
          <Link
            to={viewAllPath}
            className="flex items-center gap-1 text-brand-primary hover:text-brand-hover text-sm font-semibold transition-colors group"
          >
            View all
            <svg
              className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        )}
      </div>

      {isError ? (
        <ErrorState message={`Failed to load ${title.toLowerCase()}.`} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
          {isLoading
            ? Array.from({ length: limit }).map((_, i) => (
                <MovieCardSkeleton key={i} />
              ))
            : movies
                ?.slice(0, limit)
                .map((movie) => <MovieCard key={movie.id} movie={movie} />)}
        </div>
      )}
    </section>
  );
}
