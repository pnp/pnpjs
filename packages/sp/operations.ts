import { op, get, post, patch, del } from "@pnp/queryable";
import { ISPQueryable } from "./spqueryable.js";

export const spGet = <T = any>(o: ISPQueryable<any>, init?: RequestInit): Promise<T> => {
    return op(o, get, init);
};

export const spPost = <T = any>(o: ISPQueryable<any>, init?: RequestInit): Promise<T> => op(o, post, init);

export const spPostMerge = <T = any>(o: ISPQueryable<any>, init?: RequestInit): Promise<T> => {
    init = init || {};
    init.headers = { ...init.headers, "X-HTTP-Method": "MERGE" };

    return spPost<T>(o, init);
};

export const spPostDelete = <T = any>(o: ISPQueryable<any>, init?: RequestInit): Promise<T> => {
    init = init || {};
    init.headers = { ...init.headers || {}, "X-HTTP-Method": "DELETE" };

    return spPost<T>(o, init);
};

export const spPostDeleteETag = <T = any>(o: ISPQueryable<any>, init?: RequestInit, eTag = "*"): Promise<T> => {
    init = init || {};
    init.headers = { ...init.headers || {}, "IF-Match": eTag };

    return spPostDelete<T>(o, init);
};

export const spDelete = <T = any>(o: ISPQueryable<any>, init?: RequestInit): Promise<T> => op(o, del, init);

export const spPatch = <T = any>(o: ISPQueryable<any>, init?: RequestInit): Promise<T> => op(o, patch, init);
