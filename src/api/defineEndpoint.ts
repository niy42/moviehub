import { ApiMethods, type ApiService } from "./types";

export function defineEndpoint<Req = unknown, Res = unknown>(
    path: string,
    method: ApiMethods = ApiMethods.GET
): ApiService<Req, Res> {
    return { path, method };
}