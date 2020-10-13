import { AuthenticationResult, ConfidentialClientApplication, Configuration } from "@azure/msal-node";
import {
    objectDefinedNotNull,
    IHttpClientImpl,
    assign,
} from "@pnp/common";
import { fetch } from "./fetch";

export class MsalFetchClient implements IHttpClientImpl {

    private confidentialClient: ConfidentialClientApplication;

    constructor(_config: Configuration, private _scopes: string[] = ["https://graph.microsoft.com/.default"]) {

        this.confidentialClient = new ConfidentialClientApplication(_config);
    }

    public fetch(url: string, options: any): Promise<Response> {

        if (!objectDefinedNotNull(options)) {
            options = {
                headers: new Headers(),
            };
        } else if (!objectDefinedNotNull(options.headers)) {
            options = assign(options, {
                headers: new Headers(),
            });
        }

        return this.acquireToken().then(token => {

            options.headers.set("Authorization", `${token.tokenType} ${token.accessToken}`);

            return fetch(url, options);
        });
    }

    public acquireToken(scopes: string[] = this._scopes): Promise<AuthenticationResult> {

        return this.confidentialClient.acquireTokenByClientCredential({ scopes });
    }
}
