import axios from "axios";

// Same-origin Worker API (see worker/index.ts). The TMDB key lives server-side.
const BASE_URL = "/api";

export const IMAGE_BASE = "https://image.tmdb.org/t/p";

export const getPosterUrl = (path: string | null, size = "w342") =>
    path ? `${IMAGE_BASE}/${size}${path}` : "/placeholder-poster.svg";

export const getBackdropUrl = (path: string | null, size = "w1280") =>
    path ? `${IMAGE_BASE}/${size}${path}` : null;

export const tmdbClient = axios.create({
    baseURL: BASE_URL,
});