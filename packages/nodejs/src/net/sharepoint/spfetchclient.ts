declare var require: (path: string) => any;

import { NodeFetchClient } from "../nodefetchclient";
import { BaseSPFetchClient } from "./basespfetchclient";

const u: any = require("url");
import { HttpClientImpl, combine } from "@pnp/common";


export interface AuthToken {
    token_type: string;
    expires_in: string;
    not_before: string;
    expires_on: string;
    resource: string;
    access_token: string;
}

export enum SPOAuthEnv {
    SPO,
    China,
    Germany,
    USDef,
    USGov,
}

/**
 * Fetch client for use within nodejs, requires you register a client id and secret with app only permissions
 */
export class SPFetchClient extends BaseSPFetchClient {

    protected static SharePointServicePrincipal = "00000003-0000-0ff1-ce00-000000000000";
    protected token: AuthToken | null = null;

    constructor(
        siteUrl: string,
        protected _clientId: string,
        protected _clientSecret: string,
        public authEnv: SPOAuthEnv = SPOAuthEnv.SPO,
        protected _realm = "",
        _fetchClient: HttpClientImpl = new NodeFetchClient()) {

        super(siteUrl, _fetchClient);
    }

    public async fetch(url: string, options: any): Promise<Response> {

        const token = await this.getAddInOnlyAccessToken();

        options.headers.set("Authorization", `Bearer ${token.access_token}`);
        return super.fetch(url, options);
    }

    /**
     * Gets an add-in only authentication token based on the supplied site url, client id and secret
     */
    public async getAddInOnlyAccessToken(): Promise<AuthToken> {

        if (this.token !== null && new Date() < this.toDate(this.token.expires_on)) {
            return Promise.resolve(this.token);
        }

        const realm = await this.getRealm();

        const resource = this.getFormattedPrincipal(SPFetchClient.SharePointServicePrincipal, u.parse(this.siteUrl).hostname, realm);
        const formattedClientId = this.getFormattedPrincipal(this._clientId, "", realm);

        const authUrl = await this.getAuthUrl(realm);

        const body: string[] = [];
        body.push("grant_type=client_credentials");
        body.push(`client_id=${formattedClientId}`);
        body.push(`client_secret=${encodeURIComponent(this._clientSecret)}`);
        body.push(`resource=${resource}`);

        const r = await super.fetch(authUrl, {
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

        const r = await super.fetch(url, {
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

        const r = await super.fetch(url);
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
}
