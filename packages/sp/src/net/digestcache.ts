import { Dictionary } from "../collections/collections";
import { HttpClient } from "./httpclient";
import { Util } from "../utils/util";
import { ODataDefaultParser } from "../odata/parsers";
import { RuntimeConfig } from "../configuration/pnplibconfig";

export class CachedDigest {
    public expiration: Date;
    public value: string;
}

// allows for the caching of digests across all HttpClient's which each have their own DigestCache wrapper.
const digests = new Dictionary<CachedDigest>();

export class DigestCache {

    constructor(private _httpClient: HttpClient, private _digests: Dictionary<CachedDigest> = digests) { }

    public getDigest(webUrl: string): Promise<string> {

        const cachedDigest: CachedDigest = this._digests.get(webUrl);
        if (cachedDigest !== null) {
            const now = new Date();
            if (now < cachedDigest.expiration) {
                return Promise.resolve(cachedDigest.value);
            }
        }

        const url = Util.combinePaths(webUrl, "/_api/contextinfo");

        const headers = {
            "Accept": "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose;charset=utf-8",
        };

        return this._httpClient.fetchRaw(url, {
            cache: "no-cache",
            credentials: "same-origin",
            headers: Util.extend(headers, RuntimeConfig.spHeaders, true),
            method: "POST",
        }).then((response) => {
            const parser = new ODataDefaultParser();
            return parser.parse(response).then((d: any) => d.GetContextWebInformation);
        }).then((data: any) => {
            const newCachedDigest = new CachedDigest();
            newCachedDigest.value = data.FormDigestValue;
            const seconds = data.FormDigestTimeoutSeconds;
            const expiration = new Date();
            expiration.setTime(expiration.getTime() + 1000 * seconds);
            newCachedDigest.expiration = expiration;
            this._digests.add(webUrl, newCachedDigest);
            return newCachedDigest.value;
        });
    }

    public clear() {
        this._digests.clear();
    }
}

