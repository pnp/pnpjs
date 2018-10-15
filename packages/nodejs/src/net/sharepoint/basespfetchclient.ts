declare var global: any;

import { HttpClientImpl, combine, isUrlAbsolute } from "@pnp/common";

/**
 * Fetch client for use within nodejs, requires you register a client id and secret with app only permissions
 */
export class BaseSPFetchClient implements HttpClientImpl {

    constructor(
        public siteUrl: string,
        protected _fetchClient: HttpClientImpl,
    ) {

        // here we set the globals for page context info to help when building absolute urls
        global._spPageContextInfo = {
            webAbsoluteUrl: siteUrl,
        };

    }

    public async fetch(url: string, options?: any): Promise<Response> {

        const uri = !isUrlAbsolute(url) ? combine(this.siteUrl, url) : url;

        return await this._fetchClient.fetch(uri, options || {});

    }

}
