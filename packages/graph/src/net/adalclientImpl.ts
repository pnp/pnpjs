import * as AuthenticationContext from "adal-angular/lib/adal";

export interface AdalJSClientConfig {
    tenant: string;
    clientId: string;
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

        const g = new AuthenticationContext(_config);
        console.log(JSON.stringify(g, null, 4));
    }

}
