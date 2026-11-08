import { genreServices, movieServices, searchServices } from "@/api";
import { useQueryService } from "./useQueryService";

// ==================== MOVIES ====================

export const useNowPlaying = (page = 1) =>
    useQueryService({
        service: movieServices.fetchNowPlaying,
        params: { page },
        staleTime: 5 * 60 * 1000,
    });

export const usePopular = (page = 1) =>
    useQueryService({
        service: movieServices.fetchPopular,
        params: { page },
        staleTime: 5 * 60 * 1000,
    });

export const useTopRated = (page = 1) =>
    useQueryService({
        service: movieServices.fetchTopRated,
        params: { page },
        staleTime: 5 * 60 * 1000,
    });

export const useUpcoming = (page = 1) =>
    useQueryService({
        service: movieServices.fetchUpcoming,
        params: { page },
        staleTime: 5 * 60 * 1000,
    });

export const useMovieDetail = (id: number) =>
    useQueryService({
        service: movieServices.fetchDetail,
        pathParams: { id },
        enabled: !!id,
        staleTime: 10 * 60 * 1000,
    });

export const useSimilarMovies = (id: number, page = 1) =>
    useQueryService({
        service: movieServices.fetchSimilar,
        pathParams: { id },
        params: { page },
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });

// ==================== SEARCH & DISCOVER ====================

export const useSearchMovies = (query: string, page = 1, year?: string) =>
    useQueryService({
        service: searchServices.searchMovies,
        params: { query, page, ...(year ? { year } : {}) },
        enabled: query.trim().length > 0,
        staleTime: 2 * 60 * 1000,
    });

export const useDiscoverMovies = (
    params: Record<string, string | number>,
    enabled = true
) =>
    useQueryService({
        service: searchServices.discoverMovies,
        params,
        enabled,
        staleTime: 5 * 60 * 1000,
    });

// ==================== GENRES ====================

export const useGenres = () =>
    useQueryService({
        service: genreServices.fetchGenres,
        select: (data) => data.genres,
        staleTime: 60 * 60 * 1000,
    });