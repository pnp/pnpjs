import { FetchOptions, ISPFXGraphHttpClient, HttpClientImpl } from "@pnp/common";

export class SPfxClient implements HttpClientImpl {
    constructor(private _client: ISPFXGraphHttpClient, private _configuration: any = {}) { }

    public fetch(url: string, options: FetchOptions): Promise<Response> {
        return this._client.fetch(url, this._configuration, options);
    }
}
