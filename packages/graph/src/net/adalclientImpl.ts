import AuthenticationContext from "adal-angular";



export interface AdalJSClientConfig {
    tenant: string;
    clientID: string;
    redirectUri?: string;
    instance?: string;
    endpoints?: any[];
    popUp?: boolean;
    localLoginUrl?: string;
    displayCall?: () => void;
    postLogoutRedirectUri?: string;
    anonymousEndpoints?: string;
    cacheLocation?: string;
    expireOffsetSeconds?: number;
    correlationId?: string;
}

export class AdalJSClient {

    constructor(private _config: AdalJSClientConfig) {

        this._config = null;

        const g = new AuthenticationContext(_config);
        console.log(JSON.stringify(g, null, 4));
    }

}
