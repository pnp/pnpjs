declare var require: (path: string) => any;

const nodeFetch = require("node-fetch").default;
import { HttpClientImpl } from "@pnp/common";

/**
 * Fetch client for use within nodejs, requires you register a client id and secret with app only permissions
 */
export class NodeFetchClient implements HttpClientImpl {

    public async fetch(url: string, options: any): Promise<Response> {

        return await nodeFetch(url, options || {});

    }

}
