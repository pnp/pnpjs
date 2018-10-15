declare var global: any;
declare var require: (path: string) => any;
const nodeFetch = require("node-fetch").default;
const u: any = require("url");

import { HttpClientImpl, combine, isUrlAbsolute } from "@pnp/common";
import { AuthToken, SPOAuthEnv } from "./spfetchclient";

export interface IRetryData {

    retryCount: number;
    error: any;
    retryInterval: number;

}

/**
 * Represents the default client retry interval, in milliseconds.
 */
const DEFAULT_CLIENT_RETRY_INTERVAL = 1000 * 30;

/**
 * Represents the default client retry count.
 */
const DEFAULT_CLIENT_RETRY_COUNT = 3;

/**
 * Represents the default maximum retry interval, in milliseconds.
 */
const DEFAULT_CLIENT_MAX_RETRY_INTERVAL = 1000 * 90;

/**
 * Represents the default minimum retry interval, in milliseconds.
 */
const DEFAULT_CLIENT_MIN_RETRY_INTERVAL = 1000 * 3;

/**
 * Fetch client for use within nodejs, requires you register a client id and secret with app only permissions
 */
export class SPFetchClientRetry implements HttpClientImpl {

    private static SharePointServicePrincipal = "00000003-0000-0ff1-ce00-000000000000";
    private token: AuthToken | null = null;

    constructor(public siteUrl: string, private _clientId: string, private _clientSecret: string, public authEnv: SPOAuthEnv = SPOAuthEnv.SPO, private _realm = "") {

        // here we set the globals for page context info to help when building absolute urls
        global._spPageContextInfo = {
            webAbsoluteUrl: siteUrl,
        };
    }

    public async fetch(url: string, options: any): Promise<any> {

        if (!isUrlAbsolute(url)) {
            url = combine(this.siteUrl, url);
        }

        const token = await this.getAddInOnlyAccessToken();

        options.headers.set("Authorization", `Bearer ${token.access_token}`);
        return this.retryFetch(url, options);

    }

    /**
     * Gets an add-in only authentication token based on the supplied site url, client id and secret
     */
    public async getAddInOnlyAccessToken(): Promise<AuthToken> {

        if (this.token !== null && new Date() < this.toDate(this.token.expires_on)) {
            return Promise.resolve(this.token);
        }

        const realm = await this.getRealm();

        const resource = this.getFormattedPrincipal(SPFetchClientRetry.SharePointServicePrincipal, u.parse(this.siteUrl).hostname, realm);
        const formattedClientId = this.getFormattedPrincipal(this._clientId, "", realm);

        const authUrl = await this.getAuthUrl(realm);

        const body: string[] = [];
        body.push("grant_type=client_credentials");
        body.push(`client_id=${formattedClientId}`);
        body.push(`client_secret=${encodeURIComponent(this._clientSecret)}`);
        body.push(`resource=${resource}`);

        const r = await this.retryFetch(authUrl, {
            body: body.join("&"),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            method: "POST",
        });

        const tok: AuthToken = await r.json();
        this.token = tok;
        return this.token;

    }

    public getAuthHostUrl(env: SPOAuthEnv): string {
        switch (env) {
            case SPOAuthEnv.China:
                return "accounts.accesscontrol.chinacloudapi.cn";
            case SPOAuthEnv.Germany:
                return "login.microsoftonline.de";
            default:
                return "accounts.accesscontrol.windows.net";
        }
    }

    private async getRealm(): Promise<string> {

        if (this._realm.length > 0) {
            return Promise.resolve(this._realm);
        }

        const url = combine(this.siteUrl, "_vti_bin/client.svc");

        const r = await this.retryFetch(url, {
            "headers": {
                "Authorization": "Bearer ",
            },
            "method": "POST",
        });

        const data: string = r.headers.get("www-authenticate") || "";
        const index = data.indexOf("Bearer realm=\"");
        this._realm = data.substring(index + 14, index + 50);
        return this._realm;

    }

    private async getAuthUrl(realm: string): Promise<string> {

        const url = `https://${this.getAuthHostUrl(this.authEnv)}/metadata/json/1?realm=${realm}`;

        const r = await this.retryFetch(url);
        const json: { endpoints: { protocol: string, location: string }[] } = await r.json();

        const eps = json.endpoints.filter(ep => ep.protocol === "OAuth2");
        if (eps.length > 0) {
            return eps[0].location;
        }

        throw Error("Auth URL Endpoint could not be determined from data.");
    }

    private getFormattedPrincipal(principalName: string, hostName: string, realm: string): string {
        let resource = principalName;
        if (hostName !== null && hostName !== "") {
            resource += "/" + hostName;
        }
        resource += "@" + realm;
        return resource;
    }

    private toDate(epoch: string): Date {
        let tmp = parseInt(epoch, 10);
        if (tmp < 10000000000) {
            tmp *= 1000;
        }
        const d = new Date();
        d.setTime(tmp);
        return d;
    }

    private async retryFetch(url: string, fetchOptions: any = {}) {

        const wrapper = async (retryData: any) => {

            try {

                const res = await nodeFetch(url, fetchOptions);
                return res;

            } catch (err) {

                const retry = this.updateRetryData(retryData, err);

                if (!err.code) { throw err; }

                if (
                    err.code === "ETIMEDOUT" ||
                    err.code === "ESOCKETTIMEDOUT" ||
                    err.code === "ECONNREFUSED" ||
                    err.code === "ECONNRESET") {

                    if (this.shouldRetry(retry)) {
                        await this.delay(retry.retryInterval);
                        wrapper(retry);
                    } else {
                        throw err;
                    }

                }
            }
        };

        return await wrapper(null);

    }

    private delay(ms: number) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, ms);
        });
    }

    private updateRetryData(retryData: IRetryData, err: any) {

        const data: IRetryData = retryData || {
            error: null,
            retryCount: 0,
            retryInterval: 0,
        };

        const newError = err || null;

        if (newError) {

            if (data.error) {
                newError.innerError = data.error;
            }

            data.error = newError;

        }
        // Adjust retry interval
        let incrementDelta = Math.pow(2, data.retryCount) - 1;
        const boundedRandDelta = DEFAULT_CLIENT_RETRY_INTERVAL * 0.8 +
            Math.floor(Math.random() * (DEFAULT_CLIENT_RETRY_INTERVAL * 1.2 - DEFAULT_CLIENT_RETRY_INTERVAL * 0.8));
        incrementDelta *= boundedRandDelta;
        const retryInterval = Math.min(DEFAULT_CLIENT_MIN_RETRY_INTERVAL + incrementDelta, DEFAULT_CLIENT_MAX_RETRY_INTERVAL);

        // Adjust retry count
        data.retryCount++;
        data.retryInterval = retryInterval;

        return data;

    }

    private shouldRetry(retryData: IRetryData) {

        if (!retryData) {
            throw new Error("ERROR: retryData cannot be null.");
        }

        const currentCount = (retryData && retryData.retryCount);
        return (currentCount < DEFAULT_CLIENT_RETRY_COUNT);

    }

}
