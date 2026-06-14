export const ApiMethods = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
    PATCH: "PATCH",
} as const;

export type ApiMethods = (typeof ApiMethods)[keyof typeof ApiMethods];

export type ApiService<Req = unknown, Res = unknown> = {
    path: string;
    method: ApiMethods;
    request?: Req;
    response?: Res;
};