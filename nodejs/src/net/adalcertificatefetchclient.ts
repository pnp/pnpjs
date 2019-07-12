import { AuthenticationContext, TokenResponse, ErrorResponse } from "adal-node";
import {
    combine,
    objectDefinedNotNull,
    HttpClientImpl,
    isUrlAbsolute,
    extend,
} from "@pnp/common";
import { NodeFetchClient } from "./nodefetchclient";

/**
 * 
 * Creates a fetch client that will aquire an access token using the client credentials
 * flow with a certificate as the credentials.  Used for app only or server-to-server api
 * requests.
 * 
 * See https://docs.microsoft.com/en-us/azure/active-directory/develop/v1-oauth2-client-creds-grant-flow#service-to-service-access-token-request
 */
export class AdalCertificateFetchClient implements HttpClientImpl  {

    private _authContext: AuthenticationContext;

    /**
     * 
     * @param _tenant - Azure AD tenant id (guid)
     * @param _clientId - Client Id from Azure AD app registration
     * @param _thumbprint - Thumbprint of the client certificate
     * @param _privateKey - The private key for the client certificate used to sign requests
     * @param _resource - The resource the application is requesting access to i.e. https://graph.microsoft.com, https://<tenant>.sharepoint.com, etc
     * @param _authority - OAuth 2 authority.  Defaults to https://login.windows.net as is the authority in most cases
     * @param _fetchClient - The fetch client implementation to use when making HTTP request.  Defautls to NodeFetchClient to provide transient retries.
     */
    constructor(
        private _tenant: string,
        private _clientId: string,
        private _thumbprint: string,
        private _privateKey: string,
        private _resource = "https://graph.microsoft.com",
        private _authority = "https://login.windows.net",
        protected _fetchClient: HttpClientImpl = new NodeFetchClient(),
    ) {

            this._authContext = new AuthenticationContext(combine(this._authority, this._tenant));

    }

    public async fetch(url: string, options: any = {}): Promise<Response> {

        if (!objectDefinedNotNull(options)) {
            options = {
                headers: new Headers(),
            };
        } else if (!objectDefinedNotNull(options.headers)) {
            options = extend(options, {
                headers: new Headers(),
            });
        }

        if (!isUrlAbsolute(url)) {
            url = combine(this._resource, url);
        }

        const token = await this.acquireToken();

        options.headers.set("Authorization", `${token.tokenType} ${token.accessToken}`);

        return await this._fetchClient.fetch(url, options);

    }

    public async acquireToken(): Promise<TokenResponse> {

        return new Promise<TokenResponse>((resolve, reject) => {

            this._authContext.acquireTokenWithClientCertificate(
                this._resource,
                this._clientId,
                this._privateKey,
                this._thumbprint,
                (err: Error, token: TokenResponse | ErrorResponse) => {

                    if (err) {
                        reject(err);
                        return;
                    }

                    if ((token as ErrorResponse).error) {
                        const tokenError = token as ErrorResponse;
                        reject(new Error(`Error aquiring token.  Error: '${tokenError.error}' Error Description: ${tokenError.errorDescription}`));
                        return;
                    }

                    resolve(token as TokenResponse);

                },
            );

        });

    }

}
