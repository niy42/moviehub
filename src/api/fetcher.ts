// src/api/fetcher.ts
import { tmdbClient } from "./client";
import type { ApiService } from "./types";

export async function apiFetch<T>(
    endpoint: ApiService<any, T>,
    config?: {
        params?: Record<string, any>;
        pathParams?: Record<string, string | number>;
        data?: any;
    }
) {
    let url = endpoint.path;

    // Replace dynamic path params like :id
    if (config?.pathParams) {
        Object.entries(config.pathParams).forEach(([key, value]) => {
            url = url.replace(`:${key}`, String(value));
        });
    }

    const response = await tmdbClient.request({
        method: endpoint.method,
        url,
        params: config?.params,
        data: config?.data,
    });

    return response.data as T;
}