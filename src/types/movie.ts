export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  overview: string;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  original_language: string;
}

export interface MovieDetail extends Movie {
  genres: Genre[];
  runtime: number;
  tagline: string;
  budget: number;
  revenue: number;
  status: string;
  spoken_languages: { name: string }[];
  production_companies: { name: string; logo_path: string | null }[];
  credits?: {
    cast: CastMember[];
    crew: CrewMember[];
  };
}

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
}

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface SearchFilters {
  query: string;
  genre: string;
  year: string;
  rating: string;
  sortBy: string;
}
