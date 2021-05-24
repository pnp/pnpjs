import { Queryable2 } from "./queryable-2";

const initDefault: RequestInit = {
    method: "GET",
    headers: {},
};

export function get<T>(q: Queryable2): Promise<T> {
    return q.start(initDefault);
}

export function post<T>(q: Queryable2): Promise<T> {
    const y = JSON.parse(JSON.stringify(initDefault));
    y.method = "POST";
    return q.start(y);
}

// easily have any execute type method you want that applies defaults to the RequestInit!

