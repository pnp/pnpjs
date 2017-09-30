import { HttpClientImpl } from "../types";

export class GraphFetchClient implements HttpClientImpl {

    constructor(private _tenant: string, private _clientId: string) { }

    public fetch(url: string, options: any): Promise<Response> {

        // TODO::
        return Promise.resolve(new Response());
    }
}
