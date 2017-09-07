import { HttpClientImpl } from "./httpclient";

declare var global: any;

/**
 * Makes requests using the fetch API
 */
export class FetchClient implements HttpClientImpl {
    public fetch(url: string, options: any): Promise<Response> {
        return global.fetch(url, options);
    }
}
