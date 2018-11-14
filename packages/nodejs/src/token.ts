declare var require: (path: string) => any;
declare var Buffer: any;
const u: any = require("url");
const nodeFetch = require("node-fetch").default;
import * as jwt from "jsonwebtoken";

export type JwtPayload = {
    [key: string]: string;
};

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

interface ITokenCacheManager {
    getAccessToken(realm: string, cacheKey: string): AuthToken;
    setAccessToken(realm: string, cacheKey: string, token: AuthToken): void;
}
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

const sharePointServicePrincipal = "00000003-0000-0ff1-ce00-000000000000";
const tokenCache: ITokenCacheManager = new MapCacheManager();

export async function validateProviderHostedRequestToken(requestToken: string, clientSecret: string): Promise<JwtPayload> {
    return new Promise<JwtPayload>((resolve, reject) => {
        jwt.verify(requestToken, Buffer.from(clientSecret, "base64"), (err: jwt.VerifyErrors, decoded: object | string) => err ? reject(err) : resolve(decoded as JwtPayload));
    });
}

/**
 * Gets an add-in only authentication token based on the supplied site url, client id and secret
 */
export async function getAddInOnlyAccessToken(siteUrl: string, clientId: string, clientSecret: string, realm: string, stsUri: string) {
    return getTokenInternal(siteUrl, clientId, clientSecret, null, realm, stsUri, `addinonly:${clientId}`);
}

/**
 * Gets a user authentication token based on the supplied site url, client id, client secret, and refresh token
 */
export function getUserAccessToken(siteUrl: string, clientId: string, clientSecret: string, refreshToken: string, realm: string, stsUri: string, cacheKey: string) {
    return getTokenInternal(siteUrl, clientId, clientSecret, refreshToken, realm, stsUri, `user:${cacheKey}`);
}

async function getTokenInternal(siteUrl: string, clientId: string, clientSecret: string,
    refreshToken: string, realm: string, stsUri: string, cacheKey: string): Promise<AuthToken> {

    let accessToken = tokenCache.getAccessToken(realm, cacheKey);
    if (accessToken && new Date() < toDate(accessToken.expires_on)) {
        return accessToken;
    }

    const resource = getFormattedPrincipal(sharePointServicePrincipal, u.parse(siteUrl).hostname, realm);
    const formattedClientId = getFormattedPrincipal(clientId, "", realm);

    const body: string[] = [];
    if (refreshToken) {
        body.push("grant_type=refresh_token");
        body.push(`refresh_token=${encodeURIComponent(refreshToken)}`);
    } else {
        body.push("grant_type=client_credentials");
    }
    body.push(`client_id=${formattedClientId}`);
    body.push(`client_secret=${encodeURIComponent(clientSecret)}`);
    body.push(`resource=${resource}`);

    const r = await nodeFetch(stsUri, {
        body: body.join("&"),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
    });

    accessToken = await r.json();
    tokenCache.setAccessToken(realm, cacheKey, accessToken);
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
