declare var require: (path: string) => any;

import { IHttpClientImpl, mergeHeaders, IFetchOptions } from "@pnp/common";
import { fetch } from "./fetch";

/**
 * Makes requests using the fetch API adding the supplied token to the Authorization header
 */
export class BearerTokenFetchClient implements IHttpClientImpl {

    constructor(private _token: string | null) { }

    public get token() {
        return this._token || "";
    }

    public set token(token: string) {
        this._token = token;
    }

    public fetch(url: string, options: IFetchOptions = {}): Promise<Response> {

        const headers = new Headers();

        mergeHeaders(headers, options.headers);

        headers.set("Authorization", `Bearer ${this._token}`);

        options.headers = headers;

        return fetch(url, options);
    }
}
