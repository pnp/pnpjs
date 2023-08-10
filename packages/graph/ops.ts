import { op, get, post, patch, del, put } from "@pnp/queryable";
import { IGraphQueryable } from "./graphqueryable.js";

export const graphGet = <T = any>(o: IGraphQueryable<any>, init?: RequestInit): Promise<T> => {
    return op(o, get, init);
};

export const graphPost = <T = any>(o: IGraphQueryable<any>, init?: RequestInit): Promise<T> => {
    return op(o, post, init);
};

export const graphDelete = <T = any>(o: IGraphQueryable<any>, init?: RequestInit): Promise<T> => {
    return op(o, del, init);
};

export const graphPatch = <T = any>(o: IGraphQueryable<any>, init?: RequestInit): Promise<T> => {
    return op(o, patch, init);
};

export const graphPut = <T = any>(o: IGraphQueryable<any>, init?: RequestInit): Promise<T> => {
    return op(o, put, init);
};
