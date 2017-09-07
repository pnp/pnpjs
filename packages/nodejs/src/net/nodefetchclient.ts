declare var global: any;
declare var require: (path: string) => any;
const nodeFetch = require("node-fetch");
const u: any = require("url");
import { HttpClientImpl } from "./httpclient";
import { Util } from "../utils/util";
import { AuthUrlException } from "../utils/exceptions";

export interface AuthToken {
    token_type: string;
    expires_in: string;
    not_before: string;
    expires_on: string;
    resource: string;
    access_token: string;
}

/**
 * Fetch client for use within nodejs, requires you register a client id and secret with app only permissions
 */
export class NodeFetchClient implements HttpClientImpl {

    private static SharePointServicePrincipal = "00000003-0000-0ff1-ce00-000000000000";
    private token: AuthToken = null;

    constructor(public siteUrl: string, private _clientId: string, private _clientSecret: string, private _realm = "") {

        // here we set the globals for fetch things when this client is instantiated
        global.Headers = nodeFetch.Headers;
        global.Request = nodeFetch.Request;
        global.Response = nodeFetch.Response;
        global._spPageContextInfo = {
            webAbsoluteUrl: siteUrl,
        };
    }

    public fetch(url: string, options: any): Promise<Response> {

        if (!Util.isUrlAbsolute(url)) {
            url = Util.combinePaths(this.siteUrl, url);
        }

        return this.getAddInOnlyAccessToken().then(token => {
            options.headers.set("Authorization", `Bearer ${token.access_token}`);
            return nodeFetch(url, options);
        });
    }

    /**
     * Gets an add-in only authentication token based on the supplied site url, client id and secret
     */
    public getAddInOnlyAccessToken(): Promise<AuthToken> {

        return new Promise<AuthToken>((resolve, reject) => {

            if (this.token !== null && new Date() < this.toDate(this.token.expires_on)) {
                resolve(this.token);
            } else {
                this.getRealm().then((realm: string) => {

                    const resource = this.getFormattedPrincipal(NodeFetchClient.SharePointServicePrincipal, u.parse(this.siteUrl).hostname, realm);
                    const formattedClientId = this.getFormattedPrincipal(this._clientId, "", realm);

                    this.getAuthUrl(realm).then((authUrl: string) => {

                        const body: string[] = [];
                        body.push("grant_type=client_credentials");
                        body.push(`client_id=${formattedClientId}`);
                        body.push(`client_secret=${encodeURIComponent(this._clientSecret)}`);
                        body.push(`resource=${resource}`);

                        nodeFetch(authUrl, {
                            body: body.join("&"),
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                            },
                            method: "POST",
                        }).then((r: Response) => r.json()).then((tok: AuthToken) => {
                            this.token = tok;
                            resolve(this.token);
                        });
                    });
                }).catch(e => reject(e));
            }
        });
    }

    private getRealm(): Promise<string> {

        return new Promise(resolve => {

            if (this._realm.length > 0) {
                resolve(this._realm);
            }

            const url = Util.combinePaths(this.siteUrl, "vti_bin/client.svc");

            nodeFetch(url, {
                "headers": {
                    "Authorization": "Bearer ",
                },
                "method": "POST",
            }).then((r: Response) => {

                const data: string = r.headers.get("www-authenticate");
                const index = data.indexOf("Bearer realm=\"");
                this._realm = data.substring(index + 14, index + 50);
                resolve(this._realm);
            });
        });
    }

    private getAuthUrl(realm: string): Promise<string> {

        const url = `https://accounts.accesscontrol.windows.net/metadata/json/1?realm=${realm}`;

        return nodeFetch(url).then((r: Response) => r.json()).then((json: { endpoints: { protocol: string, location: string }[] }) => {

            const eps = json.endpoints.filter(ep => ep.protocol === "OAuth2");
            if (eps.length > 0) {
                return eps[0].location;
            }

            throw new AuthUrlException(json);
        });
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
