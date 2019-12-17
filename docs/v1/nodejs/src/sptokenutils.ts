declare var require: (path: string) => any;
const u: any = require("url");
import { fetch } from "./net/fetch";
import * as jwt from "jsonwebtoken";
import { TypedHash } from "@pnp/common";
import { AuthToken, SharePointServicePrincipal, ITokenCacheManager } from "./types";

class MapCacheManager implements ITokenCacheManager {

    private map: Map<string, AuthToken> = new Map<string, AuthToken>();

    public getAccessToken(realm: string, cacheKey: string) {
        return this.map.get(this.buildKey(realm, cacheKey));
    }

    public setAccessToken(realm: string, cacheKey: string, token: AuthToken) {
        this.map.set(this.buildKey(realm, cacheKey), token);
    }

    private buildKey(realm: string, cacheKey: string) {
        return `${realm}:${cacheKey}`;
    }
}

const tokenCache: ITokenCacheManager = new MapCacheManager();

export async function validateProviderHostedRequestToken(requestToken: string, clientSecret: string): Promise<TypedHash<string>> {

    return new Promise<TypedHash<string>>((resolve, reject) => {

        const secret = Buffer.from(clientSecret, "base64");

        jwt.verify(requestToken, secret, (err: jwt.VerifyErrors, decoded: any) => {
            err ? reject(err) : resolve(decoded);
        });
    });
}

/**
 * Gets an add-in only authentication token based on the supplied site url, client id and secret
 */
export async function getAddInOnlyAccessToken(siteUrl: string, clientId: string, clientSecret: string, realm: string, stsUri: string): Promise<AuthToken> {
    return getTokenInternal({ siteUrl, clientId, clientSecret, refreshToken: null, realm, stsUri, cacheKey: `addinonly:${clientId}` });
}

/**
 * Gets a user authentication token based on the supplied site url, client id, client secret, and refresh token
 */
// tslint:disable-next-line: max-line-length
export function getUserAccessToken(siteUrl: string, clientId: string, clientSecret: string, refreshToken: string, realm: string, stsUri: string, cacheKey: string): Promise<AuthToken> {
    return getTokenInternal({ siteUrl, clientId, clientSecret, refreshToken, realm, stsUri, cacheKey: `user:${cacheKey}` });
}

interface GetTokenInternalParams {
    siteUrl: string;
    clientId: string;
    clientSecret: string;
    refreshToken: string;
    realm: string;
    stsUri: string;
    cacheKey: string;
}

async function getTokenInternal(params: GetTokenInternalParams): Promise<AuthToken> {

    let accessToken = tokenCache.getAccessToken(params.realm, params.cacheKey);
    if (accessToken && new Date() < toDate(accessToken.expires_on)) {
        return accessToken;
    }

    const resource = getFormattedPrincipal(SharePointServicePrincipal, u.parse(params.siteUrl).hostname, params.realm);
    const formattedClientId = getFormattedPrincipal(params.clientId, "", params.realm);

    const body: string[] = [];
    if (params.refreshToken) {
        body.push("grant_type=refresh_token");
        body.push(`refresh_token=${encodeURIComponent(params.refreshToken)}`);
    } else {
        body.push("grant_type=client_credentials");
    }
    body.push(`client_id=${formattedClientId}`);
    body.push(`client_secret=${encodeURIComponent(params.clientSecret)}`);
    body.push(`resource=${resource}`);

    const r = await fetch(params.stsUri, {
        body: body.join("&"),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
    });

    accessToken = await r.json();
    tokenCache.setAccessToken(params.realm, params.cacheKey, accessToken);
    return accessToken;
}

function getFormattedPrincipal(principalName: string, hostName: string, realm: string): string {
    let resource = principalName;
    if (hostName !== null && hostName !== "") {
        resource += "/" + hostName;
    }
    resource += "@" + realm;
    return resource;
}

function toDate(epoch: string): Date {
    let tmp = parseInt(epoch, 10);
    if (tmp < 10000000000) {
        tmp *= 1000;
    }
    const d = new Date();
    d.setTime(tmp);
    return d;
}
