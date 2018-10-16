declare var require: (path: string) => any;

const nodeFetch = require("node-fetch").default;
import { HttpClientImpl } from "@pnp/common";

/**
 * Fetch client that encapsulates the node-fetch library
 */
export class NodeFetchClient implements HttpClientImpl {

    public async fetch(url: string, options: any): Promise<Response> {

        return await nodeFetch(url, options || {});

    }

}
