import { AuthToken, validateProviderHostedRequestToken, getAddInOnlyAccessToken, getUserAccessToken } from "./token";

export async function getProviderHostedRequestContext(siteUrl: string, clientId: string, clientSecret: string, spAppToken: string) {
    const payload = await validateProviderHostedRequestToken(spAppToken, clientSecret);
    const appctx = JSON.parse(payload.appctx);
    return new ProviderHostedRequestContext(siteUrl, clientId, clientSecret, payload.iss.split("@")[1], payload.refreshtoken, appctx.SecurityTokenServiceUri, appctx.CacheKey);
}

export class ProviderHostedRequestContext {
    constructor(private siteUrl: string, private clientId: string, private clientSecret: string,
        private realm: string, private refreshToken: string, private stsUri: string, private cacheKey: string) {}

    public async getAddInOnlyConfig() {
        return this.getConfigOptions(await getAddInOnlyAccessToken(this.siteUrl, this.clientId, this.clientSecret, this.realm, this.stsUri));
    }
    public async getUserConfig() {
        return this.getConfigOptions(await getUserAccessToken(this.siteUrl, this.clientId, this.clientSecret, this.refreshToken, this.realm, this.stsUri, this.cacheKey));
    }

    private getConfigOptions(token: AuthToken) {
        return {
            headers: {
                "Authorization": `Bearer ${token.access_token}`,
            },
        };
    }
}
