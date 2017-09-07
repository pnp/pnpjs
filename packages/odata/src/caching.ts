import { ODataParser } from "./core";
import { RuntimeConfig, Util, PnPClientStore, PnPClientStorage } from "@pnp/common";

export interface ICachingOptions {
    expiration?: Date;
    storeName?: "session" | "local";
    key: string;
}

export class CachingOptions implements ICachingOptions {

    protected static storage = new PnPClientStorage();

    public expiration = Util.dateAdd(new Date(), "second", RuntimeConfig.defaultCachingTimeoutSeconds);

    public storeName: "session" | "local" = RuntimeConfig.defaultCachingStore;

    constructor(public key: string) { }

    public get store(): PnPClientStore {
        if (this.storeName === "local") {
            return CachingOptions.storage.local;
        } else {
            return CachingOptions.storage.session;
        }
    }
}

export class CachingParserWrapper<T> implements ODataParser<T> {

    constructor(
        private _parser: ODataParser<T>,
        private _cacheOptions: CachingOptions) { }

    public parse(response: Response): Promise<T> {

        // add this to the cache based on the options
        return this._parser.parse(response).then(data => {

            if (this._cacheOptions.store !== null) {
                this._cacheOptions.store.put(this._cacheOptions.key, data, this._cacheOptions.expiration);
            }

            return data;
        });
    }
}
