import type { Movie, MovieDetail, PaginatedResponse } from "../../types/movie";
import { defineEndpoint } from "../defineEndpoint";
import { ApiMethods } from "../types";



const movieBase = "/movie";

export const movieServices = {
    fetchNowPlaying: defineEndpoint<PaginatedResponse<Movie>>(
        `${movieBase}/now_playing`
    ),

    fetchPopular: defineEndpoint<PaginatedResponse<Movie>>(
        `${movieBase}/popular`
    ),

    fetchTopRated: defineEndpoint<PaginatedResponse<Movie>>(
        `${movieBase}/top_rated`
    ),

    fetchUpcoming: defineEndpoint<PaginatedResponse<Movie>>(
        `${movieBase}/upcoming`
    ),

    fetchDetail: defineEndpoint<MovieDetail>(`${movieBase}/:id`, ApiMethods.GET),

    fetchSimilar: defineEndpoint<PaginatedResponse<Movie>>(
        `${movieBase}/:id/similar`
    ),
} as const;