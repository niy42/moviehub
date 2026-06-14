// src/hooks/useQueryService.ts
import { apiFetch } from "@/api/fetcher";
import type { ApiService } from "@/api/types";
import { useQuery, type QueryKey, type UseQueryOptions } from "@tanstack/react-query";

type UseQueryServiceProps<Res = unknown, TData = Res, TQueryKey extends QueryKey = QueryKey> = {
    service: ApiService<any, Res>;
    params?: Record<string, any>;
    pathParams?: Record<string, string | number>;
    queryKey?: TQueryKey;
} & Omit<UseQueryOptions<Res, Error, TData, TQueryKey>, "queryKey" | "queryFn">;

export function useQueryService<Res = unknown, TData = Res, TQueryKey extends QueryKey = QueryKey>({
    service,
    params,
    pathParams,
    queryKey,
    ...options
}: UseQueryServiceProps<Res, TData, TQueryKey>) {
    const defaultQueryKey = ["api", service.path, params, pathParams] as const;

    return useQuery({
        queryKey: (queryKey ?? defaultQueryKey) as TQueryKey,
        queryFn: () => apiFetch<Res>(service, { params, pathParams }),
        ...options,
    });
}