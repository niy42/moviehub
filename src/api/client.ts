import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;

export const IMAGE_BASE = "https://image.tmdb.org/t/p";

export const getPosterUrl = (path: string | null, size = "w342") =>
    path ? `${IMAGE_BASE}/${size}${path}` : "/placeholder-poster.svg";

export const getBackdropUrl = (path: string | null, size = "w1280") =>
    path ? `${IMAGE_BASE}/${size}${path}` : null;

export const tmdbClient = axios.create({
    baseURL: BASE_URL,
    params: { api_key: API_KEY, language: "en-US" },
});