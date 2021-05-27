import { Queryable2, queryableDefaultRequest } from "./queryable-2";


export function get<T = any>(q: Queryable2, init = { method: "GET", headers: {} }): Promise<T> {
    return Reflect.apply(queryableDefaultRequest, q, [init]);
}

export function post<T = any>(q: Queryable2, init = { method: "POST", headers: {} }): Promise<T> {
    return Reflect.apply(queryableDefaultRequest, q, [init]);
}

export function put<T = any>(q: Queryable2, init = { method: "POST", headers: {} }): Promise<T> {
    return Reflect.apply(queryableDefaultRequest, q, [init]);
}

export function del<T = any>(q: Queryable2, init = { method: "DELETE", headers: {} }): Promise<T> {
    return Reflect.apply(queryableDefaultRequest, q, [init]);
}
