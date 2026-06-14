import { Link } from "react-router-dom";
import { getPosterUrl } from "../../api/client";
import type { Movie } from "../../types/movie";
import { formatYear } from "../../utils/format";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const rating = movie.vote_average;

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group flex flex-col gap-2.5 outline-none"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-surface-elevated poster-hover shadow-card">
        <img
          src={getPosterUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Gradient overlay — always subtle, stronger on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

        {/* Rating badge */}
        <div className="absolute top-2.5 left-2.5">
          <span className="glass inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold">
            <svg
              className="w-3 h-3 fill-rating text-rating"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-text-primary">{rating.toFixed(1)}</span>
          </span>
        </div>

        {/* Quick-view on hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-white text-xs font-semibold line-clamp-2 leading-snug drop-shadow-lg">
            {movie.title}
          </p>
        </div>
      </div>

      {/* Info below card */}
      <div className="flex flex-col gap-0.5 px-0.5">
        <p className="text-text-primary text-sm font-medium line-clamp-2 leading-snug group-hover:text-brand-primary transition-colors duration-200">
          {movie.title}
        </p>
        <p className="text-text-muted text-xs tabular-nums">
          {formatYear(movie.release_date)}
        </p>
      </div>
    </Link>
  );
}
