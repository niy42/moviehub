// src/api/services/genreService.ts
import type { Genre } from "../../types/movie";
import { defineEndpoint } from "../defineEndpoint";

export const genreServices = {
    fetchGenres: defineEndpoint<unknown, { genres: Genre[] }>("/genre/movie/list"),
} as const;