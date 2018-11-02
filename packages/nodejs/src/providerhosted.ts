import { SPRest, Web } from "@pnp/sp";
import { AuthToken, validateProviderHostedRequestToken, getAddInOnlyAccessToken, getUserAccessToken } from "./token";

export async function getProviderHostedRequestContext(siteUrl: string, clientId: string, clientSecret: string, spAppToken: string) {
    const payload = await validateProviderHostedRequestToken(spAppToken, clientSecret);
    const appctx = JSON.parse(payload.appctx);
    return new ProviderHostedRequestContext(siteUrl, clientId, clientSecret, payload.iss.split("@")[1], payload.refreshtoken, appctx.SecurityTokenServiceUri, appctx.CacheKey);
}

export class ProviderHostedRequestContext {
    constructor(private siteUrl: string, private clientId: string, private clientSecret: string,
        private realm: string, private refreshToken: string, private stsUri: string, private cacheKey: string) {}

    public async getAddinOnlySP() {
        return this.getSPRest(await this.getAddInOnlyToken());
    }
    public async getAddinOnlyWeb(webAbsoluteUrl: string) {
        return this.getWeb(webAbsoluteUrl, await this.getAddInOnlyToken());
    }
    public async getUserSP() {
        return this.getSPRest(await this.getUserToken());
    }
    public async getUserWeb(webAbsoluteUrl: string) {
        return this.getWeb(webAbsoluteUrl, await this.getUserToken());
    }

    private getAddInOnlyToken() {
        return getAddInOnlyAccessToken(this.siteUrl, this.clientId, this.clientSecret, this.realm, this.stsUri);
    }
    private getUserToken() {
        return getUserAccessToken(this.siteUrl, this.clientId, this.clientSecret, this.refreshToken, this.realm, this.stsUri, this.cacheKey);
    }

    private getSPRest(token: AuthToken) {
        return new SPRest(this.getConfigOptions(token), this.siteUrl);
    }
    private getWeb(webAbsoluteUrl: string, token: AuthToken) {
        return new Web(webAbsoluteUrl).configure(this.getConfigOptions(token));
    }
    private getConfigOptions(token: AuthToken) {
        return {
            headers: {
                "Authorization": `Bearer ${token.access_token}`,
            },
        };
    }
}
