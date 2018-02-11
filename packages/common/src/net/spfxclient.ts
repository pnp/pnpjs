import { FetchOptions, HttpClientImpl } from "../netutil";
import { ISPFXGraphHttpClient } from "../spfxContextInterface";

export class SPfxClient implements HttpClientImpl {
    constructor(private _client: ISPFXGraphHttpClient, private _configuration: any = {}) { }

    public fetch(url: string, options: FetchOptions): Promise<Response> {
        return this._client.fetch(url, this._configuration, options);
    }
}
