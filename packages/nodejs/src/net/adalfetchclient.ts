/// <reference path="types.d.ts" />
declare var global: any;
declare var require: (path: string) => any;
import { AuthenticationContext } from "adal-node";
const nodeFetch = require("node-fetch");
import { Util, HttpClientImpl } from "@pnp/common";

interface IAuthenticationContext {

    new(authorityUrl: string): IAuthenticationContext;
    acquireTokenWithClientCredentials(resource: string, clientId: string, clientSecret: string, callback: (err: any, token: AADToken) => void): void;
}

export interface AADToken {
    accessToken: string;
    expiresIn: number;
    expiresOn: Date;
    isMRRT: boolean;
    resource: string;
    tokenType: string;
}

export class AdalFetchClient implements HttpClientImpl {

    private authContext: IAuthenticationContext;

    constructor(private _tenant: string,
        private _clientId: string,
        private _secret: string,
        private _resource = "https://graph.microsoft.com",
        private _authority = "https://login.windows.net") {

        global.Headers = nodeFetch.Headers;
        global.Request = nodeFetch.Request;
        global.Response = nodeFetch.Response;

        this.authContext = new AuthenticationContext(Util.combinePaths(this._authority, this._tenant));
    }

    public fetch(url: string, options: any): Promise<Response> {

        if (!Util.objectDefinedNotNull(options)) {
            options = {
                headers: new Headers(),
            };
        } else if (!Util.objectDefinedNotNull(options.headers)) {
            options = Util.extend(options, {
                headers: new Headers(),
            });
        }

        if (!Util.isUrlAbsolute(url)) {
            url = Util.combinePaths(this._resource, url);
        }

        return this.acquireToken().then(token => {

            options.headers.set("Authorization", `${token.tokenType} ${token.accessToken}`);

            return nodeFetch(url, options);
        });
    }

    public acquireToken(): Promise<AADToken> {
        return new Promise((resolve, reject) => {

            this.authContext.acquireTokenWithClientCredentials(this._resource, this._clientId, this._secret, (err: any, token: AADToken) => {

                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        });
    }
}
