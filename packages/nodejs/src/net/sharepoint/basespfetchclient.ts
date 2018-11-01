declare var global: any;

import { HttpClientImpl, combine, isUrlAbsolute } from "@pnp/common";

/**
 * Base SharePoint fetch client for use within nodejs, requires a site url and 
 * the fetch client implementation to use for making requests.
 */
export class BaseSPFetchClient implements HttpClientImpl {

    /**
     * 
     * @param siteUrl: string - Root site url to make requests against
     * @param _fetchClient: HttpClientImpl - Overrides the default fetch client
     */
    constructor(public siteUrl: string, protected _fetchClient: HttpClientImpl) {

        // Here we set the globals for page context info to help when building absolute urls
        global._spPageContextInfo = {
            webAbsoluteUrl: siteUrl,
        };
    }

    public async fetch(url: string, options?: any): Promise<Response> {

        // Support for absolute and relative urls
        const uri = !isUrlAbsolute(url) ? combine(this.siteUrl, url) : url;

        return await this._fetchClient.fetch(uri, options || {});
    }
}
