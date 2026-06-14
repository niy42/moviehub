import type { Movie, PaginatedResponse } from "../../types/movie";
import { defineEndpoint } from "../defineEndpoint";

export const searchServices = {
    searchMovies: defineEndpoint<PaginatedResponse<Movie>>("/search/movie"),
    discoverMovies: defineEndpoint<PaginatedResponse<Movie>>("/discover/movie"),
} as const;