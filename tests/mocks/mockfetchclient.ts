const nodeFetch = require("node-fetch");
declare var global: any;

import { HttpClientImpl, FetchOptions } from "../../src/pnp";

export class MockFetchClient implements HttpClientImpl {

    public options: any;

    constructor() {
        global.Headers = nodeFetch.Headers;
        global.Request = nodeFetch.Request;
        global.Response = nodeFetch.Response;
    }

    public fetch(url: string, options: FetchOptions): Promise<Response> {
        this.options = options;
        const response = new Response("{}", {
            status: 200,
        });

        return Promise.resolve(response);
    }
}
